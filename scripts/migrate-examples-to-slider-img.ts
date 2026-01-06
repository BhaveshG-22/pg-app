import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateExamplesToSliderImg() {
  try {
    console.log('Starting migration from examples to slider_img...\n');

    // Get all presets
    const presets = await prisma.preset.findMany({
      select: {
        id: true,
        slug: true,
        examples: true,
        slider_img: true,
      },
    });

    console.log(`Found ${presets.length} presets total\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const preset of presets) {
      // Check if examples has data but slider_img doesn't
      if (preset.examples && !preset.slider_img) {
        console.log(`Copying data for preset: ${preset.slug}`);
        try {
          await prisma.preset.update({
            where: { id: preset.id },
            data: {
              slider_img: preset.examples,
            },
          });
          updatedCount++;
          console.log(`  ✓ Successfully copied data\n`);
        } catch (error) {
          errorCount++;
          console.log(`  ✗ Error: ${error}\n`);
        }
      } else if (preset.slider_img) {
        skippedCount++;
        console.log(`Skipped ${preset.slug} - slider_img already has data`);
      } else {
        skippedCount++;
        console.log(`Skipped ${preset.slug} - no data in either field`);
      }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`Total presets: ${presets.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('-------------------------\n');

    if (updatedCount > 0) {
      console.log('✓ Migration completed successfully!');
      console.log('You can now safely drop the examples column.');
    } else if (errorCount === 0) {
      console.log('✓ All data is already in slider_img column.');
      console.log('You can now safely drop the examples column.');
    } else {
      console.log('⚠ Some errors occurred. Please review before dropping the examples column.');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateExamplesToSliderImg();
