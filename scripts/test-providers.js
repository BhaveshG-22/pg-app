import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from './src/generated/prisma/index.js';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();

async function testMultipleProviders() {
  console.log('🧪 Testing multiple providers...\n');

  try {
    // 1. Find user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No users found');
      return;
    }
    console.log(`✅ Found user: ${user.email} (${user.credits} credits)`);

    // 2. Test OpenAI provider
    console.log('\n🎨 Testing OpenAI provider...');
    await testProvider('OPENAI', user);

    // 3. Test Flux providers (if configured)
    if (process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN !== 'your_replicate_token_here') {
      console.log('\n⚡ Testing Flux Schnell provider...');
      await testProvider('FLUX_SCHNELL', user);

      console.log('\n🌟 Testing FLUX-1 Kontext provider...');
      await testProvider('FLUX_KONTEXT', user);
    } else {
      console.log('\n⚠️  Skipping Flux tests - REPLICATE_API_TOKEN not configured');
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

async function testProvider(providerType, user) {
  // Find or create preset for this provider
  let preset = await prisma.preset.findFirst({
    where: { provider: providerType, isActive: true }
  });

  if (!preset) {
    console.log(`📝 Creating test preset for ${providerType}...`);
    preset = await prisma.preset.create({
      data: {
        title: `Test ${providerType} Preset`,
        description: `Test preset for ${providerType} provider`,
        slug: `test-${providerType.toLowerCase()}`,
        prompt: 'A majestic mountain landscape at sunset, highly detailed, cinematic lighting',
        badge: 'Test',
        badgeColor: '#3b82f6',
        credits: providerType === 'OPENAI' ? 3 : 1,
        category: 'test',
        provider: providerType,
        isActive: true
      }
    });
  }

  console.log(`✅ Using preset: "${preset.title}" (${preset.credits} credits, ${preset.provider})`);

  // Create generation
  const generation = await prisma.generation.create({
    data: {
      userId: user.id,
      presetId: preset.id,
      outputSize: 'SQUARE',
      inputValues: { test: 'value' },
      creditsUsed: preset.credits,
      status: 'PENDING'
    }
  });

  console.log(`✅ Created generation: ${generation.id}`);

  // Add to queue
  const queue = new Queue('image-generate', {
    connection: { url: process.env.REDIS_URL }
  });

  const job = await queue.add('generate', {
    generationId: generation.id
  });

  console.log(`✅ Job added to queue: ${job.id}`);

  // Monitor for completion (30 seconds)
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    const updated = await prisma.generation.findUnique({
      where: { id: generation.id }
    });
    
    console.log(`⏳ ${providerType} Status: ${updated.status} (${attempts + 1}/${maxAttempts})`);
    
    if (updated.status === 'COMPLETED') {
      console.log(`🎉 ${providerType} generation completed!`);
      console.log(`🖼️  Output URL: ${updated.outputUrl?.slice(0, 80)}...`);
      
      // Check credits
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      console.log(`💰 Credits remaining: ${updatedUser.credits}`);
      break;
    } else if (updated.status === 'FAILED') {
      console.log(`💥 ${providerType} generation failed: ${updated.errorMessage}`);
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    console.log(`⏰ ${providerType} timeout reached`);
  }

  await queue.close();
}

testMultipleProviders();