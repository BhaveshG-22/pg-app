import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { configurePolar } from "@/lib/polar"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Race condition: Check both webhook (database) AND Polar API simultaneously
    // Whichever confirms payment first wins
    const [dbResult, polarResult] = await Promise.allSettled([
      // Check 1: Database (webhook update)
      checkDatabaseForSubscription(userId),
      // Check 2: Direct Polar API check
      checkPolarAPIForSubscription(userId),
    ])

    // If either check confirms payment, return success
    if (dbResult.status === 'fulfilled' && dbResult.value.confirmed) {
      console.log('[verify-payment] ✅ Confirmed via DATABASE (webhook)')
      return NextResponse.json({
        success: true,
        paymentConfirmed: true,
        source: 'webhook',
        subscription: dbResult.value.subscription,
      })
    }

    if (polarResult.status === 'fulfilled' && polarResult.value.confirmed) {
      console.log('[verify-payment] ✅ Confirmed via POLAR API (direct check)')
      return NextResponse.json({
        success: true,
        paymentConfirmed: true,
        source: 'polar_api',
        subscription: polarResult.value.subscription,
      })
    }

    // Payment not yet confirmed by either method
    console.log('[verify-payment] ⏳ Payment not confirmed yet, continuing to poll...')
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

// Check database for webhook-updated subscription
async function checkDatabaseForSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      polarSubscriptionId: true,
      subscriptionStatus: true,
      tier: true,
      email: true,
    },
  })

  if (!user) {
    return { confirmed: false, subscription: null }
  }

  // Check if subscription is active
  const isActive = !!(
    user.polarSubscriptionId &&
    user.subscriptionStatus &&
    (user.subscriptionStatus === 'active' ||
     user.subscriptionStatus === 'created' ||
     user.subscriptionStatus === 'trialing' ||
     user.subscriptionStatus === 'incomplete')
  )

  return {
    confirmed: isActive,
    subscription: isActive ? {
      id: user.polarSubscriptionId,
      status: user.subscriptionStatus,
      tier: user.tier,
    } : null,
  }
}

// Check Polar API directly for active subscriptions
async function checkPolarAPIForSubscription(userId: string) {
  try {
    const polar = configurePolar()

    // Get user email from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        email: true,
        polarCustomerId: true,
      },
    })

    if (!user?.email) {
      return { confirmed: false, subscription: null }
    }

    // List subscriptions for the organization and find this user's subscription
    const subscriptions = await polar.subscriptions.list({
      organizationId: process.env.POLAR_ORGANIZATION_ID || process.env.POLAR_ORGANIZATION_ID_SANDBOX,
      limit: 100,
    })

    // Find active subscription for this user by email or customer ID
    const activeSubscription = subscriptions.result?.items?.find((sub: any) => {
      const subEmail = sub.user?.email || sub.customer?.email
      const subCustomerId = sub.customerId

      const emailMatches = subEmail?.toLowerCase() === user.email.toLowerCase()
      const customerIdMatches = user.polarCustomerId && subCustomerId === user.polarCustomerId
      const isActiveStatus = sub.status === 'active' ||
                            sub.status === 'incomplete' ||
                            sub.status === 'trialing'

      return (emailMatches || customerIdMatches) && isActiveStatus
    })

    if (activeSubscription) {
      // Update database with the found subscription if not already updated
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          polarSubscriptionId: activeSubscription.id,
          polarCustomerId: activeSubscription.customerId,
          subscriptionStatus: activeSubscription.status,
        },
      }).catch(() => {
        // Ignore update errors - webhook may have already updated
      })

      return {
        confirmed: true,
        subscription: {
          id: activeSubscription.id,
          status: activeSubscription.status,
        },
      }
    }

    return { confirmed: false, subscription: null }
  } catch (error) {
    console.error('[verify-payment] Polar API check failed:', error)
    return { confirmed: false, subscription: null }
  }
}
