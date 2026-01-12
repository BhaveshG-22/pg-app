import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check database for subscription activation
    // This is faster than the general tier endpoint as it's optimized for this check
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        polarSubscriptionId: true,
        subscriptionStatus: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if subscription is now active
    const isActive = !!(
      user.polarSubscriptionId &&
      user.subscriptionStatus &&
      (user.subscriptionStatus === 'active' ||
       user.subscriptionStatus === 'trialing' ||
       user.subscriptionStatus === 'incomplete')
    )

    if (isActive) {
      return NextResponse.json({
        success: true,
        paymentConfirmed: true,
        subscription: {
          id: user.polarSubscriptionId,
          status: user.subscriptionStatus,
        },
      })
    }

    // Payment not yet confirmed
    return NextResponse.json({
      success: true,
      paymentConfirmed: false,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
