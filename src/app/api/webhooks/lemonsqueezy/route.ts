import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 401 })
    }

    // Verify webhook signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const hmac = crypto.createHmac("sha256", secret)
    const digest = hmac.update(body).digest("hex")

    if (digest !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse the webhook payload
    const payload = JSON.parse(body)
    const eventName = payload.meta.event_name
    const data = payload.data

    console.log("Lemon Squeezy webhook event:", eventName)

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
        await handleSubscriptionUpdate(data)
        break

      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionCancellation(data)
        break

      case "order_created":
        await handleOrderCreated(data)
        break

      default:
        console.log("Unhandled event type:", eventName)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionUpdate(data: any) {
  const userId = data.attributes.first_order_item?.custom_data?.user_id
  const status = data.attributes.status
  const variantName = data.attributes.variant_name?.toLowerCase()

  if (!userId) {
    console.error("No user ID in subscription data")
    return
  }

  // Map variant name to UserTier
  let tier: "FREE" | "PRO" | "CREATOR" = "FREE"
  if (variantName?.includes("pro")) {
    tier = "PRO"
  } else if (variantName?.includes("creator")) {
    tier = "CREATOR"
  }

  // Update user subscription in database
  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      tier,
      subscriptionStatus: status,
      lemonSqueezySubscriptionId: data.id,
      lemonSqueezyCustomerId: data.attributes.customer_id?.toString(),
    },
  })

  console.log(`Subscription updated for user ${userId}: ${tier} - ${status}`)
}

async function handleSubscriptionCancellation(data: any) {
  const userId = data.attributes.first_order_item?.custom_data?.user_id

  if (!userId) {
    console.error("No user ID in subscription data")
    return
  }

  // Update user subscription status and downgrade to free tier
  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      tier: "FREE",
      subscriptionStatus: "cancelled",
    },
  })

  console.log(`Subscription cancelled for user ${userId}`)
}

async function handleOrderCreated(data: any) {
  const userId = data.attributes.first_order_item?.custom_data?.user_id
  const orderTotal = data.attributes.total

  if (!userId) {
    console.error("No user ID in order data")
    return
  }

  console.log(`Order created for user ${userId}: $${orderTotal}`)
}
