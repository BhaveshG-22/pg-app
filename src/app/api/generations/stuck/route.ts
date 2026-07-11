import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET - List stuck generations for current user
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find generations that are stuck (QUEUED or RUNNING for more than 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

    const stuckGenerations = await prisma.generation.findMany({
      where: {
        userId: user.id,
        status: { in: ["QUEUED", "RUNNING"] },
        createdAt: { lt: tenMinutesAgo }, // Older than 10 minutes
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        preset: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      stuck: stuckGenerations,
      count: stuckGenerations.length,
    })
  } catch (error) {
    console.error("Failed to list stuck generations:", error)
    return NextResponse.json(
      { error: "Failed to list stuck generations" },
      { status: 500 }
    )
  }
}

// DELETE - Cancel/delete stuck generations
export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get generation ID from query params (optional)
    const url = new URL(req.url)
    const generationId = url.searchParams.get("id")

    if (generationId) {
      // Cancel specific generation
      const generation = await prisma.generation.findFirst({
        where: {
          id: generationId,
          userId: user.id,
          status: { in: ["QUEUED", "RUNNING"] },
        },
      })

      if (!generation) {
        return NextResponse.json(
          { error: "Generation not found or already completed" },
          { status: 404 }
        )
      }

      // Mark as CANCELLED
      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: "CANCELLED",
          errorMessage: "Cancelled by user due to stuck job",
          completedAt: new Date(),
        },
      })

      console.log(`Generation ${generationId} cancelled by user ${user.id}`)

      return NextResponse.json({
        success: true,
        message: "Generation cancelled",
        id: generationId,
      })
    } else {
      // Cancel ALL stuck generations (older than 10 minutes)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

      const result = await prisma.generation.updateMany({
        where: {
          userId: user.id,
          status: { in: ["QUEUED", "RUNNING"] },
          createdAt: { lt: tenMinutesAgo },
        },
        data: {
          status: "CANCELLED",
          errorMessage: "Cancelled by user due to stuck job",
          completedAt: new Date(),
        },
      })

      console.log(`Cancelled ${result.count} stuck generations for user ${user.id}`)

      return NextResponse.json({
        success: true,
        message: `Cancelled ${result.count} stuck generation(s)`,
        count: result.count,
      })
    }
  } catch (error) {
    console.error("Failed to cancel stuck generations:", error)
    return NextResponse.json(
      { error: "Failed to cancel stuck generations" },
      { status: 500 }
    )
  }
}
