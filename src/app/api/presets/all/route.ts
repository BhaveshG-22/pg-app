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
        variables: true,
        inputFields: true,
        badge: true,
        badgeColor: true,
        credits: true,
        category: true,
        examples: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      presets,
      total: presets.length
    })

  } catch (error) {
    console.error('Failed to fetch all presets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch presets' },
      { status: 500 }
    )
  }
}

export const revalidate = 300 // 5 minutes