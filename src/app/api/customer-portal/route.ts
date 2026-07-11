import { NextRequest, NextResponse } from "next/server"
import { configurePolar } from "@/lib/polar"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  try {
    // Verify the user is authenticated
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user from database to retrieve polarCustomerId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        polarCustomerId: true,
        tier: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Only allow access for paid tier users
    if (user.tier === 'FREE') {
      return NextResponse.json(
        { error: "Customer portal is only available for paid subscribers" },
        { status: 403 }
      )
    }

    if (!user.polarCustomerId) {
      return NextResponse.json(
        { error: "No customer ID found. Please subscribe to a plan first." },
        { status: 404 }
      )
    }

    // Initialize Polar SDK
    const polar = configurePolar()

    console.log("Creating customer portal session for:", user.polarCustomerId)

    // Generate customer portal session
    const session = await polar.customerSessions.create({
      customerId: user.polarCustomerId,
    })

    console.log("Customer portal session created:", session.customerPortalUrl)

    return NextResponse.json({
      portalUrl: session.customerPortalUrl,
    })
  } catch (error: any) {
    console.error("Customer portal error:", error)

    // Handle specific Polar API errors
    if (error.message?.includes("not found") || error.message?.includes("404")) {
      return NextResponse.json(
        { error: "Customer not found in Polar. Please contact support." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate customer portal link" },
      { status: 500 }
    )
  }
}
