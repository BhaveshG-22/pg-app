import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ success: true, paymentConfirmed: false })
    }

    // A purchase just completed if a CreditPurchase row for this user was
    // created in the last few minutes (the webhook creates this row as
    // soon as Polar confirms the order - see onOrderCreated).
    const recentCutoff = new Date(Date.now() - 5 * 60 * 1000)
    const recentPurchase = await prisma.creditPurchase.findFirst({
      where: { userId: user.id, createdAt: { gte: recentCutoff } },
      orderBy: { createdAt: "desc" },
    })

    if (recentPurchase) {
      return NextResponse.json({
        success: true,
        paymentConfirmed: true,
        purchase: {
          packName: recentPurchase.packName,
          creditsGranted: recentPurchase.creditsGranted,
        },
      })
    }

    return NextResponse.json({ success: true, paymentConfirmed: false })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
