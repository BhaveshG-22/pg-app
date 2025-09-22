import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imageQueue } from '@/lib/queue';

export const runtime = 'nodejs';

interface ConfirmUploadRequest {
  s3Key: string;
  presetId: string;
  inputValues: Record<string, string>;
  outputSize: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const { s3Key, presetId, inputValues, outputSize }: ConfirmUploadRequest = await req.json();

    if (!s3Key || !presetId || !outputSize) {
      return NextResponse.json(
        { error: 'Missing required fields: s3Key, presetId, outputSize' },
        { status: 400 }
      );
    }

    // 3. Get user info
    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, tier: true, credits: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Check in-flight generation limits
    const inflight = await prisma.generation.count({
      where: { userId: user.id, status: { in: ['QUEUED', 'RUNNING'] } }
    });

    // Set caps based on user tier: FREE=1, PRO=2, ENTERPRISE=100
    let cap: number;
    switch (user.tier) {
      case 'ENTERPRISE':
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

    // 5. Validate preset exists and get credits required
    const preset = await prisma.preset.findUnique({
      where: { id: presetId },
      select: { credits: true, isActive: true }
    });

    if (!preset || !preset.isActive) {
      return NextResponse.json({ error: 'preset_not_found' }, { status: 404 });
    }

    // 6. Check user has enough credits
    if (user.credits < preset.credits) {
      return NextResponse.json({ error: 'insufficient_credits' }, { status: 402 });
    }

    // 7. Create generation record with uploaded image reference
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        presetId: presetId,
        inputValues: inputValues || {},
        outputSize: outputSize as any,
        status: 'QUEUED',
        creditsUsed: preset.credits,
        // Store the S3 key of uploaded image for worker to process
        userImageId: null, // We'll store S3 key in inputValues for now
      }
    });

    // Add S3 key to input values for worker processing
    const finalInputValues = {
      ...inputValues,
      __uploadedImageKey: s3Key
    };

    // Update generation with final input values
    await prisma.generation.update({
      where: { id: generation.id },
      data: { inputValues: finalInputValues }
    });

    // 8. Enqueue processing job
    await imageQueue.add(
      'generate',
      { generationId: generation.id, userId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1500 },
        jobId: generation.id,
        removeOnComplete: true
      }
    );

    return NextResponse.json({ 
      jobId: generation.id,
      message: 'Upload confirmed, processing started'
    });

  } catch (error) {
    console.error('Confirm upload error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm upload' },
      { status: 500 }
    );
  }
}