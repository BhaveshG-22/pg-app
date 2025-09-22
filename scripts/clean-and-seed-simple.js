import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function cleanAndSeedSimplePresets() {
  console.log('🧹 Cleaning existing presets and creating simple ones...\n');

  try {
    // 1. Remove all existing data (generations first due to foreign key constraints)
    const deleteGenerations = await prisma.generation.deleteMany({});
    console.log(`🗑️  Removed ${deleteGenerations.count} existing generations`);
    
    const deletePresets = await prisma.preset.deleteMany({});
    console.log(`🗑️  Removed ${deletePresets.count} existing presets`);

    // 2. Create simple test presets
    const simplePresets = [
      {
        title: "Cat Driving Car",
        description: "A cute cat driving a car",
        slug: "cat-driving-car",
        prompt: "A cute cat driving a car, realistic style, detailed",
        badge: "Fun",
        badgeColor: "#FF6B6B",
        credits: 1,
        category: "fun",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Blue Car",
        description: "A beautiful blue car",
        slug: "blue-car",
        prompt: "A beautiful blue car, modern design, high quality photo",
        badge: "Vehicles",
        badgeColor: "#4ECDC4",
        credits: 1,
        category: "vehicles",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Red Sports Car",
        description: "A sleek red sports car",
        slug: "red-sports-car",
        prompt: "A sleek red sports car, racing style, detailed automotive photography",
        badge: "Sports",
        badgeColor: "#FF4757",
        credits: 1,
        category: "vehicles",
        provider: "FLUX_DEV",
        isActive: true
      },
      {
        title: "Dog in Sunglasses",
        description: "A cool dog wearing sunglasses",
        slug: "dog-sunglasses",
        prompt: "A cool dog wearing sunglasses, sitting in the sun, professional photo",
        badge: "Pets",
        badgeColor: "#FFA726",
        credits: 1,
        category: "animals",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Sunset Beach",
        description: "Beautiful sunset at the beach",
        slug: "sunset-beach",
        prompt: "Beautiful sunset at the beach, golden hour, peaceful waves, scenic view",
        badge: "Nature",
        badgeColor: "#66BB6A",
        credits: 2,
        category: "landscapes",
        provider: "FLUX_PRO",
        isActive: true
      },
      {
        title: "Mountain Lake",
        description: "Serene mountain lake reflection",
        slug: "mountain-lake",
        prompt: "Serene mountain lake with perfect reflection, surrounded by pine trees, morning mist",
        badge: "Landscape",
        badgeColor: "#42A5F5",
        credits: 1,
        category: "landscapes",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Space Astronaut",
        description: "Astronaut floating in space",
        slug: "space-astronaut",
        prompt: "Astronaut floating in space, Earth in background, cosmic scene, detailed spacesuit",
        badge: "Space",
        badgeColor: "#7E57C2",
        credits: 3,
        category: "space",
        provider: "OPENAI",
        isActive: true
      },
      {
        title: "Coffee Cup",
        description: "Steaming hot coffee cup",
        slug: "coffee-cup",
        prompt: "Steaming hot coffee cup on wooden table, cozy cafe atmosphere, warm lighting",
        badge: "Food",
        badgeColor: "#8D6E63",
        credits: 1,
        category: "food",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Golden Retriever Puppy",
        description: "Adorable golden retriever puppy playing",
        slug: "golden-puppy",
        prompt: "Adorable golden retriever puppy playing in grass, sunny day, cute expression",
        badge: "Cute",
        badgeColor: "#FFD54F",
        credits: 1,
        category: "animals",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Pizza Slice",
        description: "Delicious cheese pizza slice",
        slug: "pizza-slice",
        prompt: "Delicious cheese pizza slice, melted cheese, crispy crust, food photography",
        badge: "Food",
        badgeColor: "#FF8A65",
        credits: 1,
        category: "food",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Tropical Paradise",
        description: "Beautiful tropical beach scene",
        slug: "tropical-paradise",
        prompt: "Beautiful tropical beach with palm trees, crystal clear water, white sand",
        badge: "Paradise",
        badgeColor: "#4DB6AC",
        credits: 2,
        category: "landscapes",
        provider: "FLUX_DEV",
        isActive: true
      },
      {
        title: "City Skyline",
        description: "Modern city skyline at night",
        slug: "city-skyline",
        prompt: "Modern city skyline at night, illuminated buildings, urban photography",
        badge: "Urban",
        badgeColor: "#9575CD",
        credits: 1,
        category: "urban",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Butterfly Garden",
        description: "Colorful butterflies in flower garden",
        slug: "butterfly-garden",
        prompt: "Colorful butterflies flying in beautiful flower garden, spring scene, vibrant colors",
        badge: "Nature",
        badgeColor: "#81C784",
        credits: 1,
        category: "nature",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Vintage Motorcycle",
        description: "Classic vintage motorcycle",
        slug: "vintage-motorcycle",
        prompt: "Classic vintage motorcycle, chrome details, leather seat, retro style photography",
        badge: "Vintage",
        badgeColor: "#A1887F",
        credits: 1,
        category: "vehicles",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Robot Friend",
        description: "Friendly cartoon robot",
        slug: "robot-friend",
        prompt: "Friendly cartoon robot with big eyes, colorful design, futuristic but cute",
        badge: "Sci-Fi",
        badgeColor: "#64B5F6",
        credits: 2,
        category: "sci-fi",
        provider: "FLUX_DEV",
        isActive: true
      },
      {
        title: "Ice Cream Cone",
        description: "Delicious ice cream cone",
        slug: "ice-cream-cone",
        prompt: "Delicious colorful ice cream cone, multiple scoops, waffle cone, summer treat",
        badge: "Sweet",
        badgeColor: "#F8BBD9",
        credits: 1,
        category: "food",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Dragon Flying",
        description: "Majestic dragon soaring through clouds",
        slug: "dragon-flying",
        prompt: "Majestic dragon soaring through clouds, fantasy art, detailed scales, epic scene",
        badge: "Fantasy",
        badgeColor: "#E57373",
        credits: 3,
        category: "fantasy",
        provider: "OPENAI",
        isActive: true
      },
      {
        title: "Cozy Fireplace",
        description: "Warm fireplace in living room",
        slug: "cozy-fireplace",
        prompt: "Warm fireplace in cozy living room, crackling fire, comfortable armchair, homey atmosphere",
        badge: "Cozy",
        badgeColor: "#FFAB91",
        credits: 1,
        category: "interior",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Hot Air Balloon",
        description: "Colorful hot air balloon in sky",
        slug: "hot-air-balloon",
        prompt: "Colorful hot air balloon floating in blue sky, peaceful scene, aerial view",
        badge: "Adventure",
        badgeColor: "#90CAF9",
        credits: 1,
        category: "adventure",
        provider: "FLUX_SCHNELL",
        isActive: true
      },
      {
        title: "Wizard Castle",
        description: "Magical wizard castle on mountain",
        slug: "wizard-castle",
        prompt: "Magical wizard castle perched on mountain peak, mystical fog, fantasy architecture",
        badge: "Magic",
        badgeColor: "#BA68C8",
        credits: 3,
        category: "fantasy",
        provider: "OPENAI",
        isActive: true
      }
    ];

    // 3. Create the simple presets
    for (const presetData of simplePresets) {
      const preset = await prisma.preset.create({
        data: presetData
      });
      console.log(`✅ Created: "${preset.title}" (${preset.provider}, ${preset.credits} credits)`);
    }

    console.log(`\n🎉 Created ${simplePresets.length} simple presets for UI testing!`);
    
    // 4. Show summary
    console.log('\n📋 Available presets:');
    const allPresets = await prisma.preset.findMany({
      orderBy: { credits: 'asc' }
    });
    
    allPresets.forEach(preset => {
      console.log(`   • ${preset.title} (${preset.provider}) - ${preset.credits} credits`);
    });

  } catch (error) {
    console.error('💥 Operation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndSeedSimplePresets();