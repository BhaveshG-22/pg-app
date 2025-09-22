import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

interface SaveImageRequest {
  s3Key: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const { 
      s3Key, 
      fileName, 
      originalFileName, 
      fileSize, 
      mimeType,
      width = 1024,
      height = 1024 
    }: SaveImageRequest = await req.json();

    if (!s3Key || !fileName || !originalFileName || !fileSize || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields: s3Key, fileName, originalFileName, fileSize, mimeType' },
        { status: 400 }
      );
    }

    // 3. Get user info
    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Store S3 key (we'll generate presigned URLs when needed)
    const imageUrl = s3Key; // Store S3 key instead of full URL
    const thumbnailUrl = s3Key; // Same S3 key for thumbnail

    // 5. Save image to database
    const userImage = await prisma.userImage.create({
      data: {
        userId: user.id,
        fileName: fileName,
        originalFileName: originalFileName,
        fileSize: fileSize,
        mimeType: mimeType,
        url: imageUrl,
        thumbnailUrl: thumbnailUrl,
        width: width,
        height: height,
      },
      select: {
        id: true,
        fileName: true,
        originalFileName: true,
        fileSize: true,
        mimeType: true,
        url: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        uploadedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      image: userImage,
      message: 'Image saved successfully'
    });

  } catch (error) {
    console.error('Save image error:', error);
    return NextResponse.json(
      { error: 'Failed to save image' },
      { status: 500 }
    );
  }
}