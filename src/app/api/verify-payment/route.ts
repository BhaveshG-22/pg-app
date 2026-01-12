import { NextRequest, NextResponse } from "next/server"
import { configurePolar } from "@/lib/polar"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { customerSessionToken } = body

    if (!customerSessionToken) {
      return NextResponse.json(
        { error: "Missing customer_session_token" },
        { status: 400 }
      )
    }

    const polar = configurePolar()

    // Get customer session to check payment status
    try {
      const session = await polar.customerSessions.get({
        customerSessionToken,
      })

      console.log("Customer session:", session)

      // Check if customer has an active subscription
      if (session.customer?.id) {
        // Get customer's subscriptions
        const subscriptions = await polar.subscriptions.list({
          customerId: session.customer.id,
        })

        // Find active subscription
        const activeSubscription = subscriptions.result?.items?.find(
          (sub: any) => sub.status === 'active' || sub.status === 'incomplete' || sub.status === 'trialing'
        )

        if (activeSubscription) {
          return NextResponse.json({
            success: true,
            paymentConfirmed: true,
            subscription: {
              id: activeSubscription.id,
              status: activeSubscription.status,
            },
          })
        }
      }

      // Payment not yet confirmed
      return NextResponse.json({
        success: true,
        paymentConfirmed: false,
      })
    } catch (error: any) {
      console.error("Polar API error:", error)

      // If session is invalid/expired, check database instead
      return NextResponse.json({
        success: true,
        paymentConfirmed: false,
        fallbackToPolling: true,
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
