import { Webhooks } from "@polar-sh/nextjs"
import { prisma } from "@/lib/prisma"
import { POLAR_PRICE_IDS, POLAR_WEBHOOK_SECRET } from "@/lib/polar"

// Define webhook payload types locally since they're not exported from the SDK
type WebhookSubscriptionCreatedPayload = any
type WebhookSubscriptionActivePayload = any
type WebhookSubscriptionUpdatedPayload = any
type WebhookSubscriptionCanceledPayload = any
type WebhookSubscriptionRevokedPayload = any

// Map Polar price IDs to user tiers
function getTierFromPriceId(priceId: string): "FREE" | "PRO" | "CREATOR" {
  if (priceId === POLAR_PRICE_IDS.pro) {
    return "PRO"
  } else if (priceId === POLAR_PRICE_IDS.creator) {
    return "CREATOR"
  }
  return "FREE"
}

export const POST = Webhooks({
  webhookSecret: POLAR_WEBHOOK_SECRET!,
  onSubscriptionCreated: async (payload: WebhookSubscriptionCreatedPayload) => {
    console.log("Subscription created:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined
    const priceId = payload.data.priceId

    if (!userId) {
      console.error("No user ID in subscription created webhook")
      return
    }

    const tier = getTierFromPriceId(priceId)

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        polarSubscriptionId: payload.data.id,
        polarCustomerId: payload.data.customerId,
        tier,
        subscriptionStatus: "created",
      },
    })

    console.log(`Subscription created for user ${userId}: ${tier}`)
  },

  onSubscriptionActive: async (payload: WebhookSubscriptionActivePayload) => {
    console.log("Subscription activated:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined
    const priceId = payload.data.priceId

    if (!userId) {
      console.error("No user ID in subscription active webhook")
      return
    }

    const tier = getTierFromPriceId(priceId)

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        polarSubscriptionId: payload.data.id,
        polarCustomerId: payload.data.customerId,
        tier,
        subscriptionStatus: "active",
        subscriptionEndsAt: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
      },
    })

    console.log(`Subscription activated for user ${userId}: ${tier}`)
  },

  onSubscriptionUpdated: async (payload: WebhookSubscriptionUpdatedPayload) => {
    console.log("Subscription updated:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined
    const priceId = payload.data.priceId

    if (!userId) {
      console.error("No user ID in subscription updated webhook")
      return
    }

    const tier = getTierFromPriceId(priceId)

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        tier,
        subscriptionEndsAt: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
      },
    })

    console.log(`Subscription updated for user ${userId}: ${tier}`)
  },

  onSubscriptionCanceled: async (payload: WebhookSubscriptionCanceledPayload) => {
    console.log("Subscription canceled:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined

    if (!userId) {
      console.error("No user ID in subscription canceled webhook")
      return
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        subscriptionStatus: "cancelled",
        // Keep tier active until end of billing period
        subscriptionEndsAt: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
      },
    })

    console.log(`Subscription cancelled for user ${userId}`)
  },

  onSubscriptionRevoked: async (payload: WebhookSubscriptionRevokedPayload) => {
    console.log("Subscription revoked:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined

    if (!userId) {
      console.error("No user ID in subscription revoked webhook")
      return
    }

    // Immediately downgrade to free tier
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        tier: "FREE",
        subscriptionStatus: "revoked",
        subscriptionEndsAt: null,
      },
    })

    console.log(`Subscription revoked for user ${userId}`)
  },
})
