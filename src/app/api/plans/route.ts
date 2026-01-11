import { NextResponse } from "next/server"
import { configurePolar, POLAR_ORGANIZATION_ID } from "@/lib/polar"

export async function GET() {
  try {
    const polar = configurePolar()

    // Fetch products with their prices from Polar
    const products = await polar.products.list({
      organizationId: POLAR_ORGANIZATION_ID!,
    })

    // Transform Polar products into our plan format
    const polarPlans = products.result.items.map((product) => {
      // Get the first active price for the product
      const price = product.prices?.find((p) => p.isArchived === false)

      // Get price amount if it exists (free prices don't have priceAmount)
      const priceAmount = price && 'priceAmount' in price ? price.priceAmount : 0

      return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: priceAmount ? (priceAmount / 100).toFixed(2) : "0",
        priceValue: priceAmount ? priceAmount / 100 : 0,
        priceId: price?.id || null,
        productId: product.id,
        interval: price?.recurringInterval || "month",
        features: product.benefits?.map((b) => b.description) || [],
        isHighlighted: false, // Can be set based on product metadata
      }
    })

    // Add hardcoded Free plan
    const freePlan = {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      priceValue: 0,
      priceId: null,
      productId: "free",
      interval: "month",
      features: [
        "20 credits per month",
        "Premium AI model quality",
        "Standard processing speed",
        "Limited watermark",
        "1 concurrent job",
      ],
      isHighlighted: false,
    }

    // Combine Free plan with Polar plans and sort by price
    const allPlans = [freePlan, ...polarPlans]
    allPlans.sort((a, b) => a.priceValue - b.priceValue)

    return NextResponse.json({ plans: allPlans })
  } catch (error) {
    console.error("Error fetching plans from Polar:", error)
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    )
  }
}
