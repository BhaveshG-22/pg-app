import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Preset ID is required' },
        { status: 400 }
      )
    }

    // Find preset by ID (public data only)
    const preset = await prisma.preset.findFirst({
      where: {
        id: id,
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
        isActive: true
      }
    })

    if (!preset) {
      return NextResponse.json(
        { success: false, error: 'Preset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      preset
    })

  } catch (error) {
    console.error('Failed to fetch preset by ID:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}