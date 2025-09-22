import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get user info
    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Get pagination parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 4. Fetch user's images with pagination
    const [images, total] = await Promise.all([
      prisma.userImage.findMany({
        where: { userId: user.id },
        orderBy: { uploadedAt: 'desc' },
        skip: offset,
        take: limit,
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
      }),
      prisma.userImage.count({
        where: { userId: user.id }
      })
    ]);

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Fetch user images error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user images' },
      { status: 500 }
    );
  }
}