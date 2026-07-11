import { Webhooks } from "@polar-sh/nextjs"
import { prisma } from "@/lib/prisma"
import { CREDIT_PACKS, POLAR_WEBHOOK_SECRET } from "@/lib/polar"

// Define webhook payload type locally since it's not exported from the SDK
type WebhookOrderCreatedPayload = any

export const POST = Webhooks({
  webhookSecret: POLAR_WEBHOOK_SECRET!,
  onOrderCreated: async (payload: WebhookOrderCreatedPayload) => {
    console.log("Order created:", payload)

    // The Polar SDK parses the raw webhook body (snake_case
    // `billing_reason`) into a camelCase `billingReason` field before
    // handlers ever see it. A one-time purchase sets this to "purchase";
    // anything else (refunds processed as separate order types, etc.)
    // should not grant credits.
    const billingReason = payload.data.billingReason
    if (billingReason !== "purchase") {
      console.log(`Order created with billingReason: ${billingReason}, skipping credit grant`)
      return
    }

    const clerkUserId = payload.data.metadata?.user_id as string | undefined
    const productId = payload.data.productId as string | undefined
    const orderId = payload.data.id as string | undefined

    if (!clerkUserId || !productId || !orderId) {
      console.error("Order created webhook missing user_id, productId, or order id")
      return
    }

    const pack = CREDIT_PACKS.find((p) => p.productId === productId)
    if (!pack) {
      console.error(`Unknown credit pack product: ${productId}`)
      return
    }

    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({ where: { clerkId: clerkUserId } })

        await tx.creditPurchase.create({
          data: {
            userId: user.id,
            polarOrderId: orderId,
            productId,
            packName: pack.name,
            creditsGranted: pack.credits,
            amountCents: payload.data.totalAmount ?? 0,
          },
        })

        await tx.user.update({
          where: { id: user.id },
          data: { credits: { increment: pack.credits } },
        })
      })

      console.log(`Granted ${pack.credits} credits (pack: ${pack.name}) to user ${clerkUserId} for order ${orderId}`)
    } catch (e: any) {
      if (e.code === "P2002") {
        console.log(`Order ${orderId} already credited (duplicate webhook delivery), skipping`)
        return
      }
      throw e
    }
  },
})
