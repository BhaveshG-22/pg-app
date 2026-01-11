import { Polar } from "@polar-sh/sdk"

const isSandbox = process.env.POLAR_SERVER === 'sandbox'

export function configurePolar() {
  const accessToken = isSandbox ? process.env.POLAR_ACCESS_TOKEN_SANDBOX : process.env.POLAR_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not set")
  }

  return new Polar({
    accessToken,
    server: process.env.POLAR_SERVER as "sandbox" | "production"
  })
}

// Polar product/price IDs for different plans
export const POLAR_PRICE_IDS = {
  pro: isSandbox ? process.env.POLAR_PRICE_ID_PRO_SANDBOX || "" : process.env.POLAR_PRICE_ID_PRO || "",
  creator: isSandbox ? process.env.POLAR_PRICE_ID_CREATOR_SANDBOX || "" : process.env.POLAR_PRICE_ID_CREATOR || "",
}

// Other Polar config
export const POLAR_WEBHOOK_SECRET = isSandbox ? process.env.POLAR_WEBHOOK_SECRET_SANDBOX : process.env.POLAR_WEBHOOK_SECRET
export const POLAR_ORGANIZATION_ID = isSandbox ? process.env.POLAR_ORGANIZATION_ID_SANDBOX : process.env.POLAR_ORGANIZATION_ID

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    priceValue: 0,
    interval: "month",
    priceId: null,
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
    priceId: POLAR_PRICE_IDS.pro,
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
    priceId: POLAR_PRICE_IDS.creator,
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
