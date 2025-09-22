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
        examples: true,
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

    // Get transformations only for the current preset
    const transformations = []
    if (preset.examples && Array.isArray(preset.examples)) {
      transformations.push(...preset.examples
        .filter((example): example is [string, string] =>
          Array.isArray(example) &&
          example.length === 2 &&
          typeof example[0] === 'string' &&
          typeof example[1] === 'string'
        )
        .map((example) => ({
          before: example[0],
          after: example[1],
          title: preset.title
        }))
      )
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