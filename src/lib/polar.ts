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

// Other Polar config
export const POLAR_WEBHOOK_SECRET = isSandbox ? process.env.POLAR_WEBHOOK_SECRET_SANDBOX : process.env.POLAR_WEBHOOK_SECRET
export const POLAR_ORGANIZATION_ID = isSandbox ? process.env.POLAR_ORGANIZATION_ID_SANDBOX : process.env.POLAR_ORGANIZATION_ID

// One-time credit packs (pay-as-you-go). Each must be created as a
// one-time (non-recurring) product in Polar's dashboard; the resulting
// product ID goes into the matching env var below.
export const CREDIT_PACKS = [
  {
    key: "starter",
    name: "Starter",
    credits: 50,
    priceLabel: "$4.99",
    badge: null as string | null,
    features: [
      "One-time purchase",
      "Perfect for trying PixelGlow",
      "Never expires*",
    ],
    productId: isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PACK_STARTER_SANDBOX || "" : process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PACK_STARTER || "",
  },
  {
    key: "popular",
    name: "Popular",
    credits: 250,
    priceLabel: "$19.99",
    badge: "Most Popular" as string | null,
    features: [
      "Best value for most users",
      "Save 20% per credit vs Starter",
      "Never expires*",
    ],
    productId: isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PACK_POPULAR_SANDBOX || "" : process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PACK_POPULAR || "",
  },
  {
    key: "bulk",
    name: "Pro",
    credits: 700,
    priceLabel: "$49.99",
    badge: null as string | null,
    features: [
      "Lowest price per credit",
      "Ideal for heavy creators",
      "Never expires*",
    ],
    productId: isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PACK_BULK_SANDBOX || "" : process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PACK_BULK || "",
  },
]
