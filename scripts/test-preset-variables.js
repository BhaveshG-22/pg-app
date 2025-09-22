import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from './src/generated/prisma/index.js';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();

async function testPresetVariables() {
  console.log('🧪 Testing presets with variables...\n');

  try {
    // 1. Find user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No users found');
      return;
    }
    console.log(`✅ Found user: ${user.email} (${user.credits} credits)\n`);

    // 2. Get all our seeded presets
    const presets = await prisma.preset.findMany({
      where: {
        slug: {
          in: [
            'artistic-portrait-flux',
            'landscape-scene-flux', 
            'product-photo-flux',
            'character-design-openai',
            'architecture-openai'
          ]
        },
        isActive: true
      },
      orderBy: { createdAt: 'asc' }
    });

    if (presets.length === 0) {
      console.log('❌ No test presets found. Run seed-presets.js first.');
      return;
    }

    console.log(`📋 Found ${presets.length} presets to test\n`);

    // 3. Test cases with different variable values
    const testCases = [
      {
        slug: 'artistic-portrait-flux',
        inputValues: {
          style: 'oil painting',
          subject: 'an elderly man with a white beard',
          mood: 'dramatic',
          details: 'wearing a vintage hat, wise eyes'
        }
      },
      {
        slug: 'landscape-scene-flux', 
        inputValues: {
          landscape_type: 'forest',
          time_of_day: 'sunrise',
          weather: 'foggy',
          season: 'autumn',
          style: 'impressionist'
        }
      },
      {
        slug: 'product-photo-flux',
        inputValues: {
          product: 'a luxury watch with leather strap',
          background: 'marble surface',
          lighting: 'dramatic',
          angle: 'top view'
        }
      },
      {
        slug: 'character-design-openai',
        inputValues: {
          character_type: 'cyberpunk hacker',
          art_style: 'anime',
          gender: 'female',
          age: 'young adult',
          personality: 'mysterious and tech-savvy',
          clothing: 'futuristic jacket with LED accents',
          color_scheme: 'dark and moody'
        }
      },
      {
        slug: 'architecture-openai',
        inputValues: {
          building_type: 'modern house',
          style: 'scandinavian',
          materials: 'wood, glass, and stone',
          lighting_type: 'natural daylight',
          environment: 'nestled in a pine forest'
        }
      }
    ];

    // 4. Test each preset
    for (const testCase of testCases) {
      const preset = presets.find(p => p.slug === testCase.slug);
      if (!preset) {
        console.log(`⚠️  Preset ${testCase.slug} not found, skipping...`);
        continue;
      }

      console.log(`🎨 Testing: "${preset.title}" (${preset.provider})`);
      console.log(`📝 Input values:`, JSON.stringify(testCase.inputValues, null, 2));
      
      // Preview the final prompt
      let finalPrompt = preset.prompt;
      Object.entries(testCase.inputValues).forEach(([key, value]) => {
        finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
      console.log(`🔮 Final prompt: "${finalPrompt}"`);

      // Check if user has enough credits
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { credits: true }
      });

      if (currentUser.credits < preset.credits) {
        console.log(`💸 Insufficient credits (need ${preset.credits}, have ${currentUser.credits}), skipping generation\n`);
        continue;
      }

      // Create generation
      const generation = await prisma.generation.create({
        data: {
          userId: user.id,
          presetId: preset.id,
          outputSize: 'SQUARE',
          inputValues: testCase.inputValues,
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

      // Monitor for completion (60 seconds for this test)
      let attempts = 0;
      const maxAttempts = 60;
      
      while (attempts < maxAttempts) {
        const updated = await prisma.generation.findUnique({
          where: { id: generation.id }
        });
        
        console.log(`⏳ ${preset.provider} Status: ${updated.status} (${attempts + 1}/${maxAttempts})`);
        
        if (updated.status === 'COMPLETED') {
          console.log(`🎉 ${preset.provider} generation completed!`);
          console.log(`🖼️  Output URL: ${updated.outputUrl?.slice(0, 80)}...`);
          
          // Check credits
          const updatedUser = await prisma.user.findUnique({
            where: { id: user.id }
          });
          console.log(`💰 Credits remaining: ${updatedUser.credits}`);
          break;
        } else if (updated.status === 'FAILED') {
          console.log(`💥 ${preset.provider} generation failed: ${updated.errorMessage}`);
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        console.log(`⏰ ${preset.provider} timeout reached`);
      }

      await queue.close();
      console.log(''); // Empty line for readability
      
      // Wait a bit between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 5. Show summary of all generations created
    console.log('📊 Test Summary:');
    const recentGenerations = await prisma.generation.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      include: {
        preset: {
          select: { title: true, provider: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n🎯 Created ${recentGenerations.length} test generations:`);
    recentGenerations.forEach(gen => {
      const status = gen.status === 'COMPLETED' ? '✅' : 
                    gen.status === 'FAILED' ? '❌' : '⏳';
      console.log(`${status} ${gen.preset.title} (${gen.preset.provider}) - ${gen.status}`);
      if (gen.status === 'COMPLETED' && gen.outputUrl) {
        console.log(`   🔗 ${gen.outputUrl}`);
      }
      if (gen.status === 'FAILED' && gen.errorMessage) {
        console.log(`   💥 ${gen.errorMessage}`);
      }
    });

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

// Helper function to test just one specific preset
async function testSinglePreset(slug, inputValues) {
  console.log(`🎯 Testing single preset: ${slug}\n`);
  
  const preset = await prisma.preset.findUnique({
    where: { slug }
  });
  
  if (!preset) {
    console.log(`❌ Preset not found: ${slug}`);
    return;
  }

  console.log(`📋 Preset: "${preset.title}" (${preset.provider})`);
  console.log(`🔧 Variables:`, JSON.stringify(preset.variables, null, 2));
  console.log(`📝 Your input:`, JSON.stringify(inputValues, null, 2));
  
  // Show final prompt
  let finalPrompt = preset.prompt;
  Object.entries(inputValues).forEach(([key, value]) => {
    finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  console.log(`🔮 Final prompt: "${finalPrompt}"`);
}

// Export functions for individual testing
export { testSinglePreset };

// Run full test if called directly
testPresetVariables();