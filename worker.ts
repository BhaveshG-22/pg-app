import { config } from 'dotenv';
config({ path: '.env.local' });

import { Worker, QueueEvents, Job } from 'bullmq';
import { prisma } from './src/lib/prisma';
import { callEngineAndUploadToS3 } from './src/lib/engine';
import { getRedisClient } from './src/lib/redis';

// Helper to identify transient errors that should be retried
function isTransient(err: any): boolean {
  const m = (err?.message || '').toLowerCase();
  return ['timeout', '429', 'rate limit', 'temporarily', 'econnreset', 'etimedout', '5'].some(s => m.includes(s));
}

// Simple token bucket rate limiter using Redis
async function takeToken(bucket: string, maxPerMinute: number): Promise<void> {
  const redis = await getRedisClient();
  const key = `rl:${bucket}:${Math.floor(Date.now() / 60000)}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, 65);
  if (n > maxPerMinute) throw new Error('RATE_LIMIT_LOCAL');
}

const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY ?? 6);

new Worker('image-generate', async (job: Job) => {
  const { generationId } = job.data;

  // Load job from DB
  const g = await prisma.generation.findUnique({ where: { id: generationId } });
  if (!g || g.status === 'CANCELLED') return;

  // Atomically: flip to RUNNING and debit credits once
  const startedAt = new Date();
  await prisma.$transaction(async (tx) => {
    const row = await tx.generation.findUnique({ 
      where: { id: g.id }, 
      include: { user: true } 
    });
    if (!row) throw new Error('GEN_NOT_FOUND');
    if (row.status === 'CANCELLED' || row.status === 'COMPLETED' || row.status === 'FAILED') return;
    if (row.status === 'QUEUED' || row.status === 'PENDING') {
      if ((row.creditsUsed ?? 0) > row.user.credits) {
        await tx.generation.update({ 
          where: { id: g.id }, 
          data: { status: 'FAILED', errorMessage: 'INSUFFICIENT_CREDITS' }
        });
        throw new Error('INSUFFICIENT_CREDITS');
      }
      await tx.user.update({ 
        where: { id: row.userId }, 
        data: { credits: { decrement: row.creditsUsed } } 
      });
    }
    await tx.generation.update({ 
      where: { id: g.id }, 
      data: { status: 'RUNNING' } 
    });
  });

  try {
    // Rate limit upstream calls to avoid 429s (temporarily disabled due to Redis connection issues)
    // await takeToken('openai:images', 100); // 100/min for OpenAI
    // await takeToken('replicate:flux', 50);  // 50/min for Replicate
    
    // Load preset & secret prompt server-side
    // Time-box the external call (10–12s) and stream bytes -> S3
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort('provider-timeout'), 12_000);
    const { outputUrl } = await callEngineAndUploadToS3({
      presetId: g.presetId,
      inputValues: g.inputValues as Record<string, string>,
      outputSize: g.outputSize as any,
      signal: ac.signal,
      generationId: g.id
    });
    clearTimeout(timeout);

    // Check for cancellation before final update
    const latest = await prisma.generation.findUnique({ 
      where: { id: g.id }, 
      select: { status: true } 
    });
    if (latest?.status === 'CANCELLED') return;

    const finishedAt = new Date();
    
    console.log(`Job ${generationId} completed successfully`);
    
    // Update generation to completed (credits already debited at RUNNING)
    await prisma.generation.update({
      where: { id: g.id },
      data: {
        status: 'COMPLETED',
        outputUrl,
        completedAt: finishedAt,
        processingTime: finishedAt.getTime() - startedAt.getTime()
      }
    });
  } catch (err: any) {
    const isFinal = (job.attemptsMade + 1) >= (job.opts.attempts ?? 1);
    await prisma.$transaction([
      prisma.generation.update({
        where: { id: g.id },
        data: { 
          status: 'FAILED', 
          errorMessage: String(err?.message ?? 'Generation failed').slice(0, 500) 
        }
      }),
      ...(isFinal ? [prisma.user.update({
        where: { id: g.userId },
        data: { credits: { increment: g.creditsUsed } }
      })] : [])
    ]);
    // Rethrow only if transient → let BullMQ retry
    if (isTransient(err)) throw err;
  }
}, { connection: { url: process.env.REDIS_URL! }, concurrency: CONCURRENCY });

// Optional QueueEvents for monitoring/metrics
new QueueEvents('image-generate', { connection: { url: process.env.REDIS_URL! } });

console.log(`Worker started with concurrency: ${CONCURRENCY}`);