/**
 * Clean up stalled and failed jobs from the BullMQ queue
 * Run this after fixing queue configuration to clear old stuck jobs
 */
const { Queue } = require('bullmq');
require('dotenv').config();

async function cleanStalledJobs() {
  const queue = new Queue('image-generate', {
    connection: {
      url: process.env.REDIS_URL,
      tls: {
        rejectUnauthorized: false
      }
    }
  });

  try {
    console.log('🧹 Cleaning stalled and failed jobs...\n');

    // Get counts before cleaning
    const stalledCount = await queue.getJobCounts('stalled');
    const failedCount = await queue.getJobCounts('failed');
    const waitingCount = await queue.getJobCounts('waiting');
    const activeCount = await queue.getJobCounts('active');

    console.log('Current job counts:');
    console.log(`  Waiting: ${waitingCount.waiting}`);
    console.log(`  Active: ${activeCount.active}`);
    console.log(`  Stalled: ${stalledCount.stalled}`);
    console.log(`  Failed: ${failedCount.failed}\n`);

    // Clean stalled jobs
    const stalledJobs = await queue.getJobs(['stalled']);
    console.log(`Found ${stalledJobs.length} stalled jobs`);
    for (const job of stalledJobs) {
      console.log(`  - Removing stalled job: ${job.id}`);
      await job.remove();
    }

    // Clean failed jobs (optional - keeps last 50)
    const failedJobs = await queue.getJobs(['failed']);
    console.log(`\nFound ${failedJobs.length} failed jobs`);
    if (failedJobs.length > 50) {
      const toRemove = failedJobs.slice(50); // Keep last 50
      for (const job of toRemove) {
        console.log(`  - Removing old failed job: ${job.id}`);
        await job.remove();
      }
    } else {
      console.log(`  - Keeping all failed jobs (${failedJobs.length} ≤ 50)`);
    }

    // Get counts after cleaning
    const newCounts = await queue.getJobCounts();
    console.log('\n✅ Cleanup complete!');
    console.log('New job counts:');
    console.log(`  Waiting: ${newCounts.waiting}`);
    console.log(`  Active: ${newCounts.active}`);
    console.log(`  Stalled: ${newCounts.stalled}`);
    console.log(`  Failed: ${newCounts.failed}`);

  } catch (error) {
    console.error('❌ Error cleaning jobs:', error);
  } finally {
    await queue.close();
    process.exit(0);
  }
}

cleanStalledJobs();
