require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const { Queue } = require('bullmq');

const prisma = new PrismaClient();

// Create queue connection
const queue = new Queue('image-generate', {
  connection: {
    url: process.env.REDIS_URL,
    tls: process.env.REDIS_URL?.includes('rediss://') ? {
      rejectUnauthorized: false
    } : undefined
  }
});

async function createDemoJob() {
  try {
    console.log('🔄 Creating demo generation job...');

    // Find a user to test with
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      return;
    }

    // Find an active preset
    const preset = await prisma.preset.findFirst({
      where: { isActive: true }
    });
    if (!preset) {
      console.error('❌ No active presets found. Please create a preset first.');
      return;
    }

    console.log(`👤 Using user: ${user.email || user.clerkId}`);
    console.log(`🎨 Using preset: ${preset.title} (${preset.provider})`);

    // Create a test generation record
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        presetId: preset.id,
        inputValues: {
          style: 'professional',
          mood: 'confident',
          setting: 'office'
        },
        outputSize: 'SQUARE',
        status: 'QUEUED',
        creditsUsed: preset.credits,
      }
    });

    console.log(`📝 Created generation record: ${generation.id}`);

    // Add job to queue
    const job = await queue.add(
      'generate',
      {
        generationId: generation.id,
        userId: user.id
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1500 },
        jobId: generation.id,
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50       // Keep last 50 failed jobs
      }
    );

    console.log(`🚀 Demo job added to queue!`);
    console.log(`   Job ID: ${job.id}`);
    console.log(`   Generation ID: ${generation.id}`);
    console.log(`   Queue: image-generate`);
    console.log('');
    console.log('👀 Check your worker logs to see if it picks up the job!');
    console.log('📊 You can also check the generation status in your database');

  } catch (error) {
    console.error('❌ Error creating demo job:', error);
  } finally {
    await queue.close();
    await prisma.$disconnect();
  }
}

async function checkQueueStatus() {
  try {
    console.log('📊 Checking queue status...');

    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    console.log(`⏳ Waiting jobs: ${waiting.length}`);
    console.log(`🔄 Active jobs: ${active.length}`);
    console.log(`✅ Completed jobs: ${completed.length}`);
    console.log(`❌ Failed jobs: ${failed.length}`);

    if (waiting.length > 0) {
      console.log('');
      console.log('⏳ Waiting jobs:');
      waiting.forEach(job => {
        console.log(`   - Job ${job.id}: ${job.name} (${job.data.generationId})`);
      });
    }

    if (active.length > 0) {
      console.log('');
      console.log('🔄 Active jobs:');
      active.forEach(job => {
        console.log(`   - Job ${job.id}: ${job.name} (${job.data.generationId})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking queue:', error);
  } finally {
    await queue.close();
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'create':
    createDemoJob();
    break;
  case 'status':
    checkQueueStatus();
    break;
  default:
    console.log('🧪 Worker Test Script');
    console.log('');
    console.log('Usage:');
    console.log('  node test-worker.js create  - Create a demo job');
    console.log('  node test-worker.js status  - Check queue status');
    console.log('');
    console.log('Examples:');
    console.log('  node test-worker.js create');
    console.log('  node test-worker.js status');
}