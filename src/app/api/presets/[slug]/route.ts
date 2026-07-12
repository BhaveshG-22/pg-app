import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Preset slug is required' },
        { status: 400 }
      )
    }

    // Find preset by slug (public data only)
    const preset = await prisma.preset.findFirst({
      where: {
        slug: slug,
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
        slider_img: true,
        gallery: true,
        inputFields: true,
        variables: true,
        isActive: true
      }
    })

    if (!preset) {
      return NextResponse.json(
        { success: false, error: 'Preset not found' },
        { status: 404 }
      )
    }

    // Get transformations only for the current preset.
    // slider_img entries can be stored as either a [before, after] tuple or a
    // { before, after } object - accept both. Skip pairs where before/after are
    // identical (placeholder data with no real transformation to show).
    const transformations = []
    if (preset.slider_img && Array.isArray(preset.slider_img)) {
      for (const example of preset.slider_img) {
        let before: unknown
        let after: unknown

        if (Array.isArray(example) && example.length === 2) {
          [before, after] = example
        } else if (example && typeof example === 'object') {
          before = (example as Record<string, unknown>).before
          after = (example as Record<string, unknown>).after
        }

        if (typeof before === 'string' && typeof after === 'string' && before !== after) {
          transformations.push({ before, after, title: preset.title })
        }
      }
    }

    return NextResponse.json({
      success: true,
      preset,
      transformations
    })

  } catch (error) {
    console.error('Failed to fetch preset:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}