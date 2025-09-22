import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  try {
    const { prisma } = await import('@/lib/prisma');
    
    const generation = await prisma.generation.findUnique({ 
      where: { id },
      include: { user: true }
    });
    
    if (!generation) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Ensure user can only access their own generations
    if (generation.user.clerkId !== userId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      outputUrl: generation.outputUrl,
      error: generation.errorMessage,
      createdAt: generation.createdAt,
      updatedAt: generation.updatedAt,
      progress: undefined // add if you wire pubsub
    });

  } catch (error) {
    console.error('Get generation error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  try {
    const { prisma } = await import('@/lib/prisma');
    
    const generation = await prisma.generation.findUnique({ 
      where: { id },
      include: { user: true }
    });
    
    if (!generation) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Ensure user can only cancel their own generations
    if (generation.user.clerkId !== userId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // Only allow cancellation if not completed
    if (generation.status === 'COMPLETED') {
      return NextResponse.json({ error: 'cannot_cancel_completed' }, { status: 409 });
    }

    // Mark as cancelled - worker will check this before/during processing
    await prisma.generation.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        errorMessage: 'Cancelled by user'
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cancel generation error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}