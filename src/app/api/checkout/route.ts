import { NextRequest, NextResponse } from "next/server"
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js"
import { configureLemonSqueezy } from "@/lib/lemonsqueezy"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { variantId, userId, userEmail } = body

    if (!variantId || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Configure Lemon Squeezy
    configureLemonSqueezy()

    const storeId = process.env.LEMONSQUEEZY_STORE_ID
    if (!storeId) {
      throw new Error("LEMONSQUEEZY_STORE_ID is not set")
    }

    // Get the variant ID from environment variables
    const variantIdMap: Record<string, string> = {
      pro: process.env.LEMONSQUEEZY_VARIANT_ID_PRO || "",
      creator: process.env.LEMONSQUEEZY_VARIANT_ID_CREATOR || "",
    }

    const lsVariantId = variantIdMap[variantId]
    if (!lsVariantId) {
      return NextResponse.json(
        { error: "Invalid plan variant" },
        { status: 400 }
      )
    }

    // Create checkout session
    const checkout = await createCheckout(storeId, lsVariantId, {
      checkoutData: {
        email: userEmail,
        custom: {
          user_id: userId,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
      },
    })

    if (checkout.error) {
      console.error("Lemon Squeezy checkout error:", checkout.error)
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      checkoutUrl: checkout.data?.data.attributes.url,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
