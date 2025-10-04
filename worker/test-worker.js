require('dotenv').config();

const { Queue } = require('bullmq');
const { prisma } = require('./prisma');

// Test configuration
const QUEUE_NAME = 'image-generate';

async function testWorker() {
  console.log('🧪 Testing PixelGlow Worker...\n');

  try {
    // 1. Test Redis connection
    console.log('1️⃣ Testing Redis connection...');
    const queue = new Queue(QUEUE_NAME, {
      connection: {
        url: process.env.REDIS_URL,
        socket: {
          tls: process.env.REDIS_URL?.startsWith('rediss://'),
          rejectUnauthorized: false
        }
      }
    });

    await queue.waitUntilReady();
    console.log('✅ Redis connection successful\n');

    // 2. Test Database connection
    console.log('2️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // 3. Check if we have test data
    console.log('3️⃣ Checking for test data...');

    const userCount = await prisma.user.count();
    const presetCount = await prisma.preset.count();

    console.log(`📊 Found ${userCount} users and ${presetCount} presets`);

    if (userCount === 0 || presetCount === 0) {
      console.log('⚠️  No test data found. Please create a user and preset first.\n');
      return;
    }

    // 4. Get test user and preset
    const testUser = await prisma.user.findFirst({
      where: { credits: { gt: 0 } }
    });

    const testPreset = await prisma.preset.findFirst({
      where: {
        provider: 'NANO_BANANA',
        isActive: true
      }
    });

    if (!testUser) {
      console.log('⚠️  No user with credits found. Please add credits to a user.\n');
      return;
    }

    if (!testPreset) {
      console.log('⚠️  No NANO_BANANA preset found. Please create one first.\n');
      return;
    }

    console.log(`👤 Test user: ${testUser.email} (${testUser.credits} credits)`);
    console.log(`🎨 Test preset: ${testPreset.title}\n`);

    // 5. Create test generation
    console.log('4️⃣ Creating test generation...');

    const testGeneration = await prisma.generation.create({
      data: {
        userId: testUser.id,
        presetId: testPreset.id,
        inputValues: {
          style: 'vibrant',
          subject: 'cute robot'
        },
        outputSize: 'SQUARE',
        creditsUsed: 1,
        status: 'QUEUED'
      }
    });

    console.log(`🎯 Created generation: ${testGeneration.id}\n`);

    // 6. Add job to queue
    console.log('5️⃣ Adding job to queue...');

    const job = await queue.add('generate-image', {
      generationId: testGeneration.id
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });

    console.log(`🚀 Job added to queue: ${job.id}`);
    console.log(`📋 Job data:`, job.data);
    console.log('\n✅ Test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the worker: npm start');
    console.log('2. Monitor the logs for job processing');
    console.log(`3. Check generation status: ${testGeneration.id}`);

    // Clean up
    await queue.close();

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run test if called directly
if (require.main === module) {
  testWorker().catch(console.error);
}

module.exports = { testWorker };