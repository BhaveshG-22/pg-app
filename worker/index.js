require('dotenv').config();

const { Worker, QueueEvents } = require('bullmq');
const { prisma } = require('./prisma');
const { getRedisClient, closeRedisClient } = require('./redis');
const { ImageGenerationEngine } = require('./engine');

// Configuration
const QUEUE_NAME = 'image-generate';
const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY) || 6;
const MAX_RETRIES = 3;

// Helper to identify transient errors that should be retried
function isTransientError(error) {
  const message = (error?.message || '').toLowerCase();
  const transientIndicators = [
    'timeout', 'etimedout', 'econnreset', 'enotfound',
    'rate_limit', 'temporarily', '429', '502', '503', '504'
  ];

  return transientIndicators.some(indicator => message.includes(indicator));
}

// Simple rate limiter using Redis
async function checkRateLimit(bucket, maxPerMinute) {
  const redis = await getRedisClient();
  const key = `rl:${bucket}:${Math.floor(Date.now() / 60000)}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 65); // Expire after 65 seconds
  }

  if (count > maxPerMinute) {
    throw new Error('RATE_LIMIT_LOCAL');
  }
}

// Credit management functions
async function debitCreditsAtomically(generationId) {
  console.log(`[Worker] Starting credit debit for generation: ${generationId}`);

  return await prisma.$transaction(async (tx) => {
    const generation = await tx.generation.findUnique({
      where: { id: generationId },
      include: { user: true }
    });

    if (!generation) {
      throw new Error('Generation not found');
    }

    // Check if already processed or cancelled
    if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(generation.status)) {
      console.log(`[Worker] Generation ${generationId} already processed: ${generation.status}`);
      return { status: generation.status, generation };
    }

    // Check if user has sufficient credits
    if (generation.user.credits < generation.creditsUsed) {
      await tx.generation.update({
        where: { id: generationId },
        data: {
          status: 'FAILED',
          errorMessage: 'Insufficient credits'
        }
      });
      throw new Error('INSUFFICIENT_CREDITS');
    }

    // Debit credits and mark as running
    await tx.user.update({
      where: { id: generation.userId },
      data: { credits: { decrement: generation.creditsUsed } }
    });

    await tx.generation.update({
      where: { id: generationId },
      data: { status: 'RUNNING' }
    });

    console.log(`[Worker] Credits debited for generation: ${generationId}`);
    return { status: 'RUNNING', generation };
  });
}

async function refundCredits(generationId, creditsToRefund) {
  console.log(`[Worker] Refunding ${creditsToRefund} credits for generation: ${generationId}`);

  const generation = await prisma.generation.findUnique({
    where: { id: generationId },
    select: { userId: true }
  });

  if (generation) {
    await prisma.user.update({
      where: { id: generation.userId },
      data: { credits: { increment: creditsToRefund } }
    });
    console.log(`[Worker] Credits refunded for generation: ${generationId}`);
  }
}

// Main job processor
async function processImageGenerationJob(job) {
  const { generationId } = job.data;
  const engine = new ImageGenerationEngine();

  console.log(`[Worker] Processing job ${job.id} for generation: ${generationId}`);

  try {
    // Rate limiting (optional, can be disabled if Redis issues)
    try {
      await checkRateLimit('replicate', 50); // 50 requests per minute
    } catch (rateLimitError) {
      console.warn(`[Worker] Rate limit check failed: ${rateLimitError.message}`);
      // Continue without rate limiting if Redis is unavailable
    }

    // Step 1: Debit credits atomically
    const { status, generation } = await debitCreditsAtomically(generationId);

    if (status === 'CANCELLED') {
      console.log(`[Worker] Job cancelled: ${generationId}`);
      return;
    }

    if (status !== 'RUNNING') {
      console.log(`[Worker] Job already processed: ${generationId} (${status})`);
      return;
    }

    // Step 2: Process the generation
    const startTime = Date.now();
    const result = await engine.processGeneration(generationId);
    const processingTime = Date.now() - startTime;

    if (result.status === 'cancelled') {
      console.log(`[Worker] Generation was cancelled during processing: ${generationId}`);
      return;
    }

    // Step 3: Update generation with results
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        outputUrl: result.outputUrl,
        completedAt: new Date(),
        processingTime
      }
    });

    console.log(`[Worker] Job completed successfully: ${generationId} (${processingTime}ms)`);

  } catch (error) {
    console.error(`[Worker] Job failed: ${generationId}`, error.message);

    const isFinalAttempt = (job.attemptsMade + 1) >= MAX_RETRIES;

    // Update generation status
    await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: 'FAILED',
        errorMessage: error.message.slice(0, 500)
      }
    });

    // Refund credits only on final failure
    if (isFinalAttempt) {
      const generation = await prisma.generation.findUnique({
        where: { id: generationId },
        select: { creditsUsed: true }
      });

      if (generation) {
        await refundCredits(generationId, generation.creditsUsed);
      }
    }

    // Rethrow transient errors to trigger retry
    if (isTransientError(error) && !isFinalAttempt) {
      console.log(`[Worker] Retrying job due to transient error: ${error.message}`);
      throw error;
    }
  }
}

// Create worker
const worker = new Worker(QUEUE_NAME, processImageGenerationJob, {
  connection: {
    url: process.env.REDIS_URL,
    socket: {
      tls: process.env.REDIS_URL?.startsWith('rediss://'),
      rejectUnauthorized: false
    }
  },
  concurrency: CONCURRENCY,
  lockDuration: 60000,        // 60 seconds - how long a job can be locked
  stalledInterval: 30000,     // 30 seconds - how often to check for stalled jobs
  maxStalledCount: 2,         // Allow 2 stall attempts before failing
  removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
  removeOnFail: { count: 50 }       // Keep last 50 failed jobs
});

// Create queue events for monitoring
const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: {
    url: process.env.REDIS_URL,
    socket: {
      tls: process.env.REDIS_URL?.startsWith('rediss://'),
      rejectUnauthorized: false
    }
  }
});

// Event listeners
worker.on('ready', () => {
  console.log(`[Worker] Ready! Concurrency: ${CONCURRENCY}`);
});

worker.on('active', (job) => {
  console.log(`[Worker] Job active: ${job.id} (${job.data.generationId})`);
});

worker.on('completed', (job) => {
  console.log(`[Worker] Job completed: ${job.id} (${job.data.generationId})`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job failed: ${job?.id} (${job?.data?.generationId}) - ${err.message}`);
});

worker.on('error', (err) => {
  console.error('[Worker] Worker error:', err);
});

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`[Queue] Job waiting: ${jobId}`);
});

queueEvents.on('stalled', ({ jobId }) => {
  console.warn(`[Queue] Job stalled: ${jobId}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Worker] Received SIGTERM, shutting down gracefully...');
  await worker.close();
  await queueEvents.close();
  await closeRedisClient();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Worker] Received SIGINT, shutting down gracefully...');
  await worker.close();
  await queueEvents.close();
  await closeRedisClient();
  await prisma.$disconnect();
  process.exit(0);
});

console.log(`[Worker] PixelGlow Worker starting...`);
console.log(`[Worker] Queue: ${QUEUE_NAME}`);
console.log(`[Worker] Concurrency: ${CONCURRENCY}`);
console.log(`[Worker] Max Retries: ${MAX_RETRIES}`);