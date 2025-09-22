import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPresignedPutUrl, generateUploadKey, validateUpload } from '@/lib/s3';

export const runtime = 'nodejs'; // Important for AWS SDK

interface PresignRequest {
  filename: string;
  mimeType: string;
  fileSize: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const { filename, mimeType, fileSize }: PresignRequest = await req.json();

    if (!filename || !mimeType || !fileSize) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, mimeType, fileSize' },
        { status: 400 }
      );
    }

    // 3. Get user info for tier-based limits
    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, tier: true, credits: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Validate file type and size based on user tier
    const validation = validateUpload(mimeType, fileSize, user.tier);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 5. Check if user has credits for potential generation
    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits for image processing' },
        { status: 402 }
      );
    }

    // 6. Generate unique S3 key
    const s3Key = generateUploadKey(user.id, filename);

    // 7. Create presigned URL (5 minutes expiry)
    const presignedUrl = await createPresignedPutUrl(s3Key, mimeType, 300);

    // 8. Return presigned URL and metadata
    return NextResponse.json({
      url: presignedUrl,
      key: s3Key,
      headers: {
        'Content-Type': mimeType
      },
      expiresIn: 300 // 5 minutes
    });

  } catch (error) {
    console.error('Presign URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}