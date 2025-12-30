import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getImageQueue } from '@/lib/queue';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  try {
    const { prisma } = await import('@/lib/prisma');
    const { searchParams } = new URL(req.url);
    const presetId = searchParams.get('presetId');

    // Get user
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });

    // Build where clause - filter by preset if provided
    const whereClause: any = {
      userId: user.id,
      status: 'COMPLETED',
      outputUrl: { not: null }
    };

    if (presetId) {
      whereClause.presetId = presetId;
    }

    // Fetch user's completed generations, ordered by most recent
    const generations = await prisma.generation.findMany({
      where: whereClause,
      select: {
        id: true,
        outputUrl: true,
        outputSize: true,
        createdAt: true,
        presetId: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 most recent
    });

    return NextResponse.json({ generations });
  } catch (error) {
    console.error('Get generations API error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const idemp = req.headers.get('idempotency-key') ?? undefined;
  const body = await req.json(); // { presetId, inputValues, outputSize }

  try {
    const { prisma } = await import('@/lib/prisma');

    // 1) Idempotency fast-path
    if (idemp) {
      const existing = await prisma.generation.findUnique({ where: { idempotencyKey: idemp } });
      if (existing) return NextResponse.json({ jobId: existing.id });
    }

    // 2) Get user tier for in-flight limits
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });

    // 3) Clean up stuck jobs (running for more than 5 minutes)
    await prisma.generation.updateMany({
      where: {
        status: 'RUNNING',
        updatedAt: {
          lt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        }
      },
      data: {
        status: 'FAILED',
        errorMessage: 'Job timed out - cleaned up by system'
      }
    });

    // 4) Per-user in-flight cap
    const inflight = await prisma.generation.count({
      where: { userId: user.id, status: { in: ['QUEUED', 'RUNNING'] } }
    });

    // Set caps based on user tier: FREE=1, PRO=2, CREATOR=100
    let cap: number;
    switch (user.tier) {
      case 'CREATOR':
        // cap = 10;
        cap = 100; //for Testing
        break;
      case 'PRO':
        cap = 2;
        break;
      case 'FREE':
      default:
        cap = 1;
        break;
    }

    if (inflight >= cap) {
      return NextResponse.json({ error: 'too_many_in_flight' }, { status: 409 });
    }

    // 5) Validate preset exists and get credits required
    const preset = await prisma.preset.findUnique({
      where: { id: body.presetId },
      select: { credits: true, isActive: true }
    });

    if (!preset || !preset.isActive) {
      return NextResponse.json({ error: 'preset_not_found' }, { status: 404 });
    }

    // 6) Check user has enough credits
    if (user.credits < preset.credits) {
      return NextResponse.json({ error: 'insufficient_credits' }, { status: 402 });
    }

    // 7) Create DB row
    const gen = await prisma.generation.create({
      data: {
        userId: user.id,
        presetId: body.presetId,
        inputValues: body.inputValues,
        outputSize: body.outputSize,
        status: 'QUEUED',
        idempotencyKey: idemp,
        creditsUsed: preset.credits
      }
    });

    // 8) Enqueue (credits will be debited atomically by worker)
    try {
      const queue = getImageQueue();
      await queue.add(
        'generate',
        { generationId: gen.id, userId },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1500 },
          jobId: gen.id,
          removeOnComplete: true
        }
      );
      console.log(`✅ Successfully queued job ${gen.id}`);
    } catch (queueError) {
      console.error('❌ Failed to add job to queue:', queueError);
      // Update generation status to failed if queue add fails
      await prisma.generation.update({
        where: { id: gen.id },
        data: {
          status: 'FAILED',
          errorMessage: 'Failed to add job to queue: ' + String(queueError)
        }
      });
      throw queueError;
    }

    return NextResponse.json({ jobId: gen.id });

  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}