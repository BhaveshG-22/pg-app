import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        tier: true,
        polarSubscriptionId: true,
        subscriptionStatus: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has an active subscription
    // Exclude canceled, unpaid, and expired subscriptions
    const hasActiveSubscription = !!(
      user.polarSubscriptionId &&
      user.subscriptionStatus &&
      user.subscriptionStatus !== 'canceled' &&
      user.subscriptionStatus !== 'cancelled' && // Legacy spelling
      user.subscriptionStatus !== 'revoked' && // Legacy status
      user.subscriptionStatus !== 'unpaid' &&
      user.subscriptionStatus !== 'incomplete_expired' &&
      (user.subscriptionStatus === 'active' ||
       user.subscriptionStatus === 'created' || // Legacy status from webhook
       user.subscriptionStatus === 'incomplete' ||
       user.subscriptionStatus === 'trialing')
    )

    return NextResponse.json({
      tier: user.tier,
      subscriptionId: user.polarSubscriptionId,
      hasActiveSubscription,
      subscriptionStatus: user.subscriptionStatus,
    })
  } catch (error) {
    console.error("Error fetching user tier:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
