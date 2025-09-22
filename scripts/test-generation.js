import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from './src/generated/prisma/index.js';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();

async function testImageGeneration() {
  console.log('🧪 Testing image generation workflow...\n');

  try {
    // 1. Find preset with Flux provider
    console.log('1️⃣ Finding Flux preset...');
    const preset = await prisma.preset.findFirst({
      where: { 
        isActive: true,
        provider: { in: ['FLUX_DEV', 'FLUX_PRO', 'FLUX_SCHNELL'] }
      },
      orderBy: { credits: 'desc' }
    });
    
    if (!preset) {
      console.log('❌ No active presets found');
      return;
    }
    
    console.log(`✅ Found preset: "${preset.title}" (${preset.credits} credits, ${preset.provider})`);

    // 2. Find a user to test with
    console.log('\n2️⃣ Finding user...');
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('❌ No users found');
      return;
    }
    
    console.log(`✅ Found user: ${user.email} (${user.credits} credits available)`);

    // 3. Create a test generation
    console.log('\n3️⃣ Creating generation record...');
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        presetId: preset.id,
        outputSize: 'SQUARE',
        inputValues: { prompt: 'a beautiful sunset over mountains' },
        creditsUsed: preset.credits,
        status: 'PENDING'
      }
    });
    
    console.log(`✅ Created generation: ${generation.id}`);

    // 4. Add job to queue
    console.log('\n4️⃣ Adding job to queue...');
    const queue = new Queue('image-generate', {
      connection: { url: process.env.REDIS_URL }
    });
    
    const job = await queue.add('generate', {
      generationId: generation.id
    });
    
    console.log(`✅ Job added to queue: ${job.id}`);

    // 5. Check queue status
    console.log('\n5️⃣ Queue status:');
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();
    
    console.log(`📥 Waiting: ${waiting.length}`);
    console.log(`⚡ Active: ${active.length}`);
    console.log(`✅ Completed: ${completed.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    // 6. Monitor for completion (for 30 seconds)
    console.log('\n6️⃣ Monitoring generation (30s timeout)...');
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      const updated = await prisma.generation.findUnique({
        where: { id: generation.id }
      });
      
      console.log(`⏳ Status: ${updated.status} (${attempts + 1}/${maxAttempts})`);
      
      if (updated.status === 'COMPLETED') {
        console.log(`🎉 Generation completed!`);
        console.log(`🖼️  Output URL: ${updated.outputUrl}`);
        
        // Check updated user credits
        const updatedUser = await prisma.user.findUnique({
          where: { id: user.id }
        });
        console.log(`💰 Credits after generation: ${updatedUser.credits} (used ${updatedUser.totalCreditsUsed} total)`);
        break;
      } else if (updated.status === 'FAILED') {
        console.log(`💥 Generation failed: ${updated.errorMessage}`);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      console.log('⏰ Timeout reached');
    }

    await queue.close();

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

testImageGeneration();