import { NextRequest, NextResponse } from "next/server"
import { configurePolar } from "@/lib/polar"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { priceId, productId, userId, userEmail } = body

    if (!priceId || !productId || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the user is authenticated
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId || clerkUserId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user from database to check for existing subscription
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        polarSubscriptionId: true,
        subscriptionStatus: true,
        tier: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    console.log("User data:", {
      tier: user.tier,
      subscriptionId: user.polarSubscriptionId,
      subscriptionStatus: user.subscriptionStatus,
    })

    // Initialize Polar SDK
    const polar = configurePolar()

    // Check if user has an active subscription in DB
    let hasActiveSubscription = !!(
      user.polarSubscriptionId &&
      (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'created')
    )

    console.log("hasActiveSubscription (from DB):", hasActiveSubscription)

    // If we have a subscription ID, ALWAYS verify with Polar API to be safe
    if (user.polarSubscriptionId) {
      console.log("⚠️ Subscription ID exists, verifying with Polar API...")
      try {
        const subscription = await polar.subscriptions.get({ id: user.polarSubscriptionId })
        console.log("Polar subscription status:", subscription.status)

        // Check if subscription is active in Polar
        if (subscription.status === 'active' || subscription.status === 'incomplete' || subscription.status === 'trialing') {
          hasActiveSubscription = true
          console.log("✅ Confirmed active subscription via Polar API")
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'incomplete_expired') {
          // Subscription is canceled/expired/unpaid - treat as no active subscription
          hasActiveSubscription = false
          console.log(`⚠️ Subscription is ${subscription.status}, allowing new subscription`)

          // Update database to reflect canceled status
          await prisma.user.update({
            where: { clerkId: userId },
            data: {
              subscriptionStatus: subscription.status,
            },
          })
        } else {
          console.log(`⚠️ Subscription exists but status is: ${subscription.status}`)
          hasActiveSubscription = false
        }
      } catch (error) {
        console.error("Failed to fetch subscription from Polar:", error)
        // If subscription not found in Polar, treat as no active subscription
        hasActiveSubscription = false
      }
    } else if (!user.polarSubscriptionId && user.tier !== 'FREE') {
      // CRITICAL: User is on paid tier but no subscription ID in DB
      // This means webhook failed or subscription wasn't recorded
      // Try to find subscription from Polar by customer email
      console.log("🚨 Data inconsistency detected: Paid tier but no subscription ID!")
      console.log("Attempting to recover subscription from Polar API...")

      try {
        // Search for subscriptions by email
        const subscriptions = await polar.subscriptions.list({
          organizationId: process.env.POLAR_ORGANIZATION_ID || process.env.POLAR_ORGANIZATION_ID_SANDBOX,
        })

        // Find active subscription for this user
        const activeSubscription = subscriptions.result?.items?.find(
          (sub: any) =>
            (sub.status === 'active' || sub.status === 'incomplete') &&
            (sub.user?.email === userEmail || sub.customer?.email === userEmail)
        )

        if (activeSubscription) {
          console.log("✅ Found active subscription in Polar:", activeSubscription.id)
          console.log("Updating database with subscription ID...")

          // Update database with the found subscription
          await prisma.user.update({
            where: { clerkId: userId },
            data: {
              polarSubscriptionId: activeSubscription.id,
              polarCustomerId: activeSubscription.customerId,
              subscriptionStatus: activeSubscription.status,
            },
          })

          hasActiveSubscription = true
          // Update the local user object for this request
          user.polarSubscriptionId = activeSubscription.id
          console.log("✅ Database updated successfully")
        } else {
          console.log("⚠️ No active subscription found in Polar for this email")
        }
      } catch (error) {
        console.error("Failed to recover subscription from Polar:", error)
      }
    }

    console.log("Final hasActiveSubscription:", hasActiveSubscription)

    if (hasActiveSubscription && user.polarSubscriptionId) {
      // UPGRADE FLOW: Update existing subscription
      console.log("🔄 UPGRADE FLOW: Attempting to update subscription", user.polarSubscriptionId)
      try {
        const updatedSubscription = await polar.subscriptions.update({
          id: user.polarSubscriptionId,
          subscriptionUpdate: {
            productId: productId,
          },
        })

        console.log("✅ Subscription upgraded successfully:", updatedSubscription)

        // Return success without redirect URL (upgrade happens immediately)
        return NextResponse.json({
          success: true,
          upgraded: true,
          message: "Subscription upgraded successfully",
        })
      } catch (error) {
        console.error("❌ Polar subscription update error:", error)
        return NextResponse.json(
          { error: "Failed to upgrade subscription" },
          { status: 500 }
        )
      }
    } else {
      // NEW SUBSCRIPTION FLOW: Create checkout session
      console.log("🆕 NEW SUBSCRIPTION FLOW: Creating checkout session")
      try {
        const checkout = await polar.checkouts.create({
          products: [productId],
          customerEmail: userEmail,
          metadata: {
            user_id: userId,
            price_id: priceId,
          },
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
        })

        if (!checkout) {
          throw new Error("Failed to create checkout session")
        }

        return NextResponse.json({
          checkoutUrl: checkout.url,
        })
      } catch (checkoutError: any) {
        console.error("❌ Checkout creation failed:", checkoutError)

        // If error is "already has subscription", this means our detection failed
        if (checkoutError.message?.includes("already have an active subscription")) {
          console.error("🚨 CRITICAL: User has active subscription but we didn't detect it!")
          console.error("This should not happen. User data was:", user)

          return NextResponse.json({
            error: "You already have an active subscription. Please contact support.",
            debug: {
              message: "Subscription detection failed",
              userId: userId,
              polarSubscriptionId: user.polarSubscriptionId,
            }
          }, { status: 400 })
        }

        throw checkoutError
      }
    }
  } catch (error) {
    console.error("Polar checkout error:", error)
    return NextResponse.json(
      { error: "Failed to process subscription request" },
      { status: 500 }
    )
  }
}
