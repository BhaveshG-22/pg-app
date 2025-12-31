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
    console.log("Full webhook payload:", JSON.stringify(payload, null, 2))

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
        await handleSubscriptionUpdate(data, payload.meta)
        break

      case "subscription_cancelled":
      case "subscription_expired":
        await handleSubscriptionCancellation(data, payload.meta)
        break

      case "order_created":
        await handleOrderCreated(data, payload.meta)
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

async function handleSubscriptionUpdate(data: any, meta: any) {
  // Custom data is in meta.custom_data according to Lemon Squeezy docs
  const userId = meta.custom_data?.user_id

  const status = data.attributes.status
  const variantName = data.attributes.variant_name?.toLowerCase()
  const productName = data.attributes.product_name?.toLowerCase()

  console.log("Subscription data:", {
    userId,
    status,
    variantName,
    productName,
    customerId: data.attributes.customer_id
  })

  if (!userId) {
    console.error("No user ID in subscription data")
    console.error("Meta:", JSON.stringify(meta, null, 2))
    return
  }

  // Map variant name or product name to UserTier
  let tier: "FREE" | "PRO" | "CREATOR" = "FREE"
  const nameToCheck = (variantName || productName || "").toLowerCase()

  if (nameToCheck.includes("pro")) {
    tier = "PRO"
  } else if (nameToCheck.includes("creator")) {
    tier = "CREATOR"
  }

  console.log(`Mapped tier: ${tier} from name: ${nameToCheck}`)

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

async function handleSubscriptionCancellation(data: any, meta: any) {
  // Custom data is in meta.custom_data according to Lemon Squeezy docs
  const userId = meta.custom_data?.user_id

  if (!userId) {
    console.error("No user ID in subscription cancellation data")
    console.error("Meta:", JSON.stringify(meta, null, 2))
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

async function handleOrderCreated(data: any, meta: any) {
  // Custom data is in meta.custom_data according to Lemon Squeezy docs
  const userId = meta.custom_data?.user_id
  const orderTotal = data.attributes.total

  console.log("Order data:", {
    userId,
    orderTotal,
    customData: meta.custom_data
  })

  if (!userId) {
    console.error("No user ID in order data")
    console.error("Meta:", JSON.stringify(meta, null, 2))
    return
  }

  console.log(`Order created for user ${userId}: $${orderTotal}`)
}
