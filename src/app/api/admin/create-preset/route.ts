import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if user is admin
    const { prisma } = await import('@/lib/prisma');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Verify admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!adminEmail || user.email !== adminEmail) {
      console.log('Admin check failed:');
      console.log('User email:', user.email);
      console.log('Required admin email:', adminEmail);
      return NextResponse.json({ 
        error: `Admin access required. Your email: ${user.email}, Required: ${adminEmail}` 
      }, { status: 403 });
    }

    // 4. Parse and validate request body
    const body = await req.json();
    const {
      title,
      description,
      slug,
      prompt,
      badge,
      badgeColor,
      credits,
      category,
      provider,
      owner,
      slider_img,
      gallery,
      isActive,
      inputFields,
      variables
    } = body;

    // 5. Validate required fields
    if (!title || !description || !slug || !prompt || !badge || !badgeColor || credits === undefined || !category || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 6. Validate provider
    const validProviders = ['OPENAI', 'FLUX_DEV', 'FLUX_PRO', 'FLUX_SCHNELL'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    // 7. Validate slug format
    if (!/^[a-z0-9-_]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
    }

    // 8. Check if slug exists
    const existingPreset = await prisma.preset.findUnique({ where: { slug } });
    if (existingPreset) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    // 9. Create preset
    const preset = await prisma.preset.create({
      data: {
        title,
        description,
        slug,
        prompt,
        badge,
        badgeColor,
        credits: Number(credits),
        category,
        provider,
        owner: owner || null,
        slider_img: slider_img || null,
        gallery: gallery || null,
        isActive: Boolean(isActive ?? true),
        inputFields: inputFields || null,
        variables: variables || null,
      }
    });

    return NextResponse.json({
      success: true,
      preset,
      message: 'Preset created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create preset error:', error);
    return NextResponse.json({ error: 'Failed to create preset' }, { status: 500 });
  }
}