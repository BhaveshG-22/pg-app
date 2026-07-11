import { NextRequest, NextResponse } from "next/server"
import { configurePolar, CREDIT_PACKS } from "@/lib/polar"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, userId, userEmail } = body

    if (!productId || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the user is authenticated and matches the requested purchase
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId || clerkUserId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only allow checkout for a known credit pack product
    const pack = CREDIT_PACKS.find((p) => p.productId === productId)
    if (!pack) {
      return NextResponse.json(
        { error: "Unknown credit pack" },
        { status: 400 }
      )
    }

    const polar = configurePolar()

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: userEmail,
      metadata: {
        user_id: userId,
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
