import { Webhooks } from "@polar-sh/nextjs"
import { prisma } from "@/lib/prisma"
import { POLAR_PRICE_IDS, POLAR_PRODUCT_IDS, POLAR_WEBHOOK_SECRET } from "@/lib/polar"

// Define webhook payload types locally since they're not exported from the SDK
type WebhookSubscriptionCreatedPayload = any
type WebhookSubscriptionActivePayload = any
type WebhookSubscriptionUpdatedPayload = any
type WebhookSubscriptionCanceledPayload = any
type WebhookSubscriptionRevokedPayload = any
type WebhookOrderCreatedPayload = any

// Map Polar price IDs to user tiers (legacy, for backwards compatibility)
function getTierFromPriceId(priceId: string): "FREE" | "PRO" | "CREATOR" {
  if (priceId === POLAR_PRICE_IDS.pro) {
    return "PRO"
  } else if (priceId === POLAR_PRICE_IDS.creator) {
    return "CREATOR"
  }
  return "FREE"
}

// Map Polar product IDs to user tiers (primary method)
function getTierFromProductId(productId: string): "FREE" | "PRO" | "CREATOR" {
  console.log("Matching productId:", productId)
  console.log("Expected PRO:", POLAR_PRODUCT_IDS.pro)
  console.log("Expected CREATOR:", POLAR_PRODUCT_IDS.creator)

  if (productId === POLAR_PRODUCT_IDS.pro) {
    return "PRO"
  } else if (productId === POLAR_PRODUCT_IDS.creator) {
    return "CREATOR"
  }

  // Fallback: check product name from payload
  console.warn(`⚠️ Product ID ${productId} not recognized, defaulting to FREE`)
  return "FREE"
}

// Map user tier to monthly credits
function getMonthlyCredits(tier: "FREE" | "PRO" | "CREATOR"): number {
  switch (tier) {
    case "PRO":
      return 100
    case "CREATOR":
      return 400
    case "FREE":
    default:
      return 5
  }
}

const TIER_RANK: Record<"FREE" | "PRO" | "CREATOR", number> = {
  FREE: 0,
  PRO: 1,
  CREATOR: 2,
}

export const POST = Webhooks({
  webhookSecret: POLAR_WEBHOOK_SECRET!,
  onSubscriptionCreated: async (payload: WebhookSubscriptionCreatedPayload) => {
    console.log("Subscription created:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined
    const productId = payload.data.productId

    if (!userId) {
      console.error("No user ID in subscription created webhook")
      return
    }

    const tier = getTierFromProductId(productId)

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
    const productId = payload.data.productId

    if (!userId) {
      console.error("No user ID in subscription active webhook")
      return
    }

    const tier = getTierFromProductId(productId)
    const monthlyCredits = getMonthlyCredits(tier)

    // Get current user credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { credits: true },
    })

    if (!user) {
      console.error(`User not found: ${userId}`)
      return
    }

    // Update subscription and add initial monthly credits
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
        credits: user.credits + monthlyCredits,
      },
    })

    console.log(`Subscription activated for user ${userId}: ${tier}. Granted ${monthlyCredits} credits. New balance: ${user.credits + monthlyCredits}`)
  },

  onSubscriptionUpdated: async (payload: WebhookSubscriptionUpdatedPayload) => {
    console.log("Subscription updated:", payload)

    const userId = payload.data.metadata?.user_id as string | undefined
    const productId = payload.data.productId

    if (!userId) {
      console.error("No user ID in subscription updated webhook")
      return
    }

    if (!productId) {
      console.error("No product ID in subscription updated webhook")
      return
    }

    const newTier = getTierFromProductId(productId)

    // Get user's current tier and credits
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tier: true, credits: true },
    })

    if (!user) {
      console.error(`User not found: ${userId}`)
      return
    }

    const oldTier = user.tier
    const isUpgrade = TIER_RANK[newTier] > TIER_RANK[oldTier]

    // Only grant credits on an actual upgrade (higher tier), never on a
    // lateral change or downgrade.
    let newCredits = user.credits
    if (isUpgrade) {
      const monthlyCredits = getMonthlyCredits(newTier)
      newCredits = user.credits + monthlyCredits
      console.log(`Upgrade detected from ${oldTier} to ${newTier}. Granting ${monthlyCredits} credits.`)
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        tier: newTier,
        subscriptionEndsAt: payload.data.currentPeriodEnd
          ? new Date(payload.data.currentPeriodEnd)
          : null,
        credits: newCredits,
      },
    })

    console.log(`Subscription updated for user ${userId}: ${oldTier} -> ${newTier}. New balance: ${newCredits}`)
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

  onOrderCreated: async (payload: WebhookOrderCreatedPayload) => {
    console.log("Order created:", payload)

    // NOTE: the Polar SDK parses the raw webhook body (snake_case
    // `billing_reason`) into a camelCase `billingReason` field before
    // handlers ever see it - reading `billing_reason` here always returns
    // undefined and silently skips every order, including renewals.
    const billingReason = payload.data.billingReason

    // Only grant credits here for pure renewals. Upgrades are already
    // credited in `onSubscriptionUpdated` (using the correct *new* tier) -
    // Polar fires both `subscription.updated` and `order.created`
    // (billing_reason "subscription_update") for the same upgrade, so
    // granting here too would double-credit the user.
    if (billingReason !== 'subscription_cycle') {
      console.log(`Order created with billingReason: ${billingReason}, skipping credit grant`)
      return
    }

    console.log("Subscription renewal detected, granting monthly credits")

    const userId = payload.data.metadata?.user_id as string | undefined

    if (!userId) {
      console.error("No user ID in order created webhook")
      return
    }

    // Get user's current tier
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tier: true, credits: true },
    })

    if (!user) {
      console.error(`User not found: ${userId}`)
      return
    }

    const monthlyCredits = getMonthlyCredits(user.tier)

    // Add monthly credits to user's account
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        credits: user.credits + monthlyCredits,
      },
    })

    console.log(`Granted ${monthlyCredits} credits to user ${userId} (tier: ${user.tier}). New balance: ${user.credits + monthlyCredits}`)
  },
})
