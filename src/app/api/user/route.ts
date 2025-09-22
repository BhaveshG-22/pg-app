import { NextResponse } from 'next/server'
import { ensureUserInDatabase } from '@/lib/auth'

export async function GET() {
  try {
    const user = await ensureUserInDatabase()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        credits: user.credits,
        totalCreditsUsed: user.totalCreditsUsed,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error('Failed to get user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    )
  }
}