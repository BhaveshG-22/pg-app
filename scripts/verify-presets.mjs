// Verify all presets are using NANO_BANANA provider
import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function verifyPresets() {
  console.log('🔍 Verifying preset providers...\n');

  try {
    const presets = await prisma.preset.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        provider: true,
        isActive: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`Found ${presets.length} presets:\n`);

    let nanoBananaCount = 0;

    for (const preset of presets) {
      const icon = preset.provider === 'NANO_BANANA' ? '✅' : '❌';
      const status = preset.isActive ? '🟢' : '🔴';

      console.log(`${icon} ${status} ${preset.title}`);
      console.log(`   Provider: ${preset.provider}`);
      console.log(`   Slug: ${preset.slug}`);
      console.log('');

      if (preset.provider === 'NANO_BANANA') {
        nanoBananaCount++;
      }
    }

    console.log('📊 Summary:');
    console.log(`   Total presets: ${presets.length}`);
    console.log(`   Using NANO_BANANA: ${nanoBananaCount}`);
    console.log(`   Using other providers: ${presets.length - nanoBananaCount}`);

    if (nanoBananaCount === presets.length) {
      console.log('\n🎉 All presets are successfully using NANO_BANANA!');
    } else {
      console.log('\n⚠️  Some presets are not using NANO_BANANA');
    }

  } catch (error) {
    console.error('❌ Error verifying presets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPresets();