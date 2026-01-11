import { Polar } from "@polar-sh/sdk"

export function configurePolar() {
  const accessToken = process.env.POLAR_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not set")
  }

  return new Polar({
    accessToken,
  })
}

// Polar product/price IDs for different plans
export const POLAR_PRICE_IDS = {
  pro: process.env.POLAR_PRICE_ID_PRO || "",
  creator: process.env.POLAR_PRICE_ID_CREATOR || "",
}

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
