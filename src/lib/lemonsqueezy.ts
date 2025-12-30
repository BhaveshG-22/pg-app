import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js"

export function configureLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY

  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not set")
  }

  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      console.error("Lemon Squeezy Error:", error)
      throw error
    },
  })
}

export const PLAN_VARIANTS = {
  pro: process.env.LEMONSQUEEZY_VARIANT_ID_PRO || "",
  creator: process.env.LEMONSQUEEZY_VARIANT_ID_CREATOR || "",
}

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceValue: 0,
    interval: "month",
    variantId: null,
    features: [
      "20 credits per month",
      "Premium AI model quality",
      "Standard processing speed",
      "Limited watermark",
      "1 concurrent job",
    ],
  },
  {
    name: "Pro",
    price: "$4.99",
    priceValue: 4.99,
    interval: "month",
    variantId: PLAN_VARIANTS.pro,
    popular: true,
    features: [
      "100 credits per month",
      "Premium AI model quality",
      "No watermark",
      "Faster processing",
      "3 concurrent jobs",
      "Commercial usage rights",
      "Email support",
    ],
  },
  {
    name: "Creator",
    price: "$14.99",
    priceValue: 14.99,
    interval: "month",
    variantId: PLAN_VARIANTS.creator,
    features: [
      "400 credits per month",
      "Premium AI model quality",
      "Early access to new presets",
      "Priority processing",
      "Unlimited concurrent jobs",
      "Priority customer support",
      "API access (coming soon)",
    ],
  },
]
