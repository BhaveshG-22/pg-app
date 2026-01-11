import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const presetId = searchParams.get('presetId');

    if (!presetId) {
      return NextResponse.json(
        { error: 'presetId is required' },
        { status: 400 }
      );
    }

    // Fetch gallery images for this specific preset
    const presetGalleryImages = await prisma.gallery_jobs.findMany({
      where: {
        presetId: presetId,
        status: 'DONE',
        imageUrl: {
          not: null
        }
      },
      select: {
        id: true,
        imageUrl: true,
        modelId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    // Extract image URLs
    const imageUrls = presetGalleryImages
      .filter(img => img.imageUrl)
      .map(img => img.imageUrl as string);

    return NextResponse.json({
      success: true,
      images: imageUrls,
      count: imageUrls.length
    });

  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}
