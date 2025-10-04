import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const presets = await prisma.preset.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        badge: true,
        badgeColor: true,
        credits: true,
        category: true,
        examples: true,
        thumbnailUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { category: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Transform presets to include thumbnail and before/after images
    const transformedPresets = presets.map(preset => {
      let beforeImage = '';
      let afterImage = '';
      let thumbnailImage = '';
      let featured = false;

      // Use thumbnailUrl if available, otherwise fall back to examples
      if (preset.thumbnailUrl && preset.thumbnailUrl.trim() !== '') {
        thumbnailImage = preset.thumbnailUrl;
        beforeImage = preset.thumbnailUrl; // Use thumbnail as beforeImage for backward compatibility
      } else if (preset.examples && Array.isArray(preset.examples)) {
        const firstExample = preset.examples[0] as any;
        if (firstExample && typeof firstExample === 'object') {
          beforeImage = firstExample.before || '';
          afterImage = firstExample.after || '';
          thumbnailImage = firstExample.before || ''; // Use example as thumbnail fallback
        }
      }

      // Mark some presets as featured (you can customize this logic)
      featured = preset.category === 'featured' || preset.credits <= 3;

      return {
        ...preset,
        beforeImage,
        afterImage,
        thumbnailImage,
        featured
      };
    });

    return NextResponse.json({
      success: true,
      presets: transformedPresets,
      total: transformedPresets.length
    })

  } catch (error) {
    console.error('Failed to fetch presets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch presets' },
      { status: 500 }
    )
  }
}

export const revalidate = 300 // 5 minutes