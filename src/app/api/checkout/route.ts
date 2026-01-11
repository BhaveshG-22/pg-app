import { NextRequest, NextResponse } from "next/server"
import { configurePolar } from "@/lib/polar"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { priceId, productId, userId, userEmail } = body

    if (!priceId || !productId || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Initialize Polar SDK
    const polar = configurePolar()

    // Create checkout session with the Polar product ID
    const checkout = await polar.checkouts.create({
      products: [productId], // Array of product ID strings
      customerEmail: userEmail,
      metadata: {
        user_id: userId,
        price_id: priceId, // Store price ID in metadata if needed
      },
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
    })

    if (!checkout) {
      throw new Error("Failed to create checkout session")
    }

    return NextResponse.json({
      checkoutUrl: checkout.url,
    })
  } catch (error) {
    console.error("Polar checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
