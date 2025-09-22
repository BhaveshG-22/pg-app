import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function seedPresets() {
  console.log('🌱 Seeding presets with variables...\n');

  try {
    // Flux presets with variables
    const fluxPresets = [
      {
        title: "Artistic Portrait Generator",
        description: "Generate artistic portraits with customizable style and mood",
        slug: "artistic-portrait-flux",
        prompt: "A {{style}} portrait of {{subject}}, {{mood}} lighting, {{details}}, highly detailed, professional photography",
        badge: "Portrait",
        badgeColor: "#8B5CF6",
        credits: 1,
        category: "portraits",
        provider: "FLUX_SCHNELL",
        variables: {
          style: {
            type: "select",
            label: "Art Style",
            options: ["realistic", "oil painting", "watercolor", "digital art", "sketch"],
            default: "realistic"
          },
          subject: {
            type: "text",
            label: "Subject",
            placeholder: "a young woman with curly hair",
            required: true
          },
          mood: {
            type: "select", 
            label: "Lighting Mood",
            options: ["soft", "dramatic", "golden hour", "studio", "natural"],
            default: "soft"
          },
          details: {
            type: "text",
            label: "Additional Details",
            placeholder: "wearing elegant jewelry",
            required: false
          }
        },
        inputFields: [
          { name: "style", required: true },
          { name: "subject", required: true },
          { name: "mood", required: true },
          { name: "details", required: false }
        ]
      },
      {
        title: "Landscape Scene Creator",
        description: "Create stunning landscape scenes with weather and time variations",
        slug: "landscape-scene-flux",
        prompt: "A {{landscape_type}} landscape during {{time_of_day}}, {{weather}} weather, {{season}} season, {{style}}, cinematic, highly detailed",
        badge: "Landscape",
        badgeColor: "#10B981",
        credits: 1,
        category: "landscapes",
        provider: "FLUX_DEV",
        variables: {
          landscape_type: {
            type: "select",
            label: "Landscape Type",
            options: ["mountain", "forest", "beach", "desert", "valley", "lake"],
            default: "mountain"
          },
          time_of_day: {
            type: "select",
            label: "Time of Day",
            options: ["sunrise", "morning", "noon", "afternoon", "sunset", "twilight", "night"],
            default: "sunset"
          },
          weather: {
            type: "select",
            label: "Weather",
            options: ["clear", "cloudy", "stormy", "foggy", "rainy", "snowy"],
            default: "clear"
          },
          season: {
            type: "select",
            label: "Season",
            options: ["spring", "summer", "autumn", "winter"],
            default: "summer"
          },
          style: {
            type: "select",
            label: "Art Style",
            options: ["photorealistic", "impressionist", "fantasy", "minimalist"],
            default: "photorealistic"
          }
        },
        inputFields: [
          { name: "landscape_type", required: true },
          { name: "time_of_day", required: true },
          { name: "weather", required: true },
          { name: "season", required: true },
          { name: "style", required: true }
        ]
      },
      {
        title: "Product Photography Studio",
        description: "Professional product photos with customizable backgrounds and lighting",
        slug: "product-photo-flux",
        prompt: "Professional product photography of {{product}}, {{background}} background, {{lighting}} lighting, {{angle}} angle, commercial quality, high resolution",
        badge: "Product",
        badgeColor: "#F59E0B",
        credits: 2,
        category: "commercial",
        provider: "FLUX_PRO",
        variables: {
          product: {
            type: "text",
            label: "Product Description",
            placeholder: "a sleek smartphone",
            required: true
          },
          background: {
            type: "select",
            label: "Background",
            options: ["white studio", "black studio", "gradient", "wooden table", "marble surface", "transparent"],
            default: "white studio"
          },
          lighting: {
            type: "select",
            label: "Lighting Style",
            options: ["soft box", "ring light", "natural", "dramatic", "rim lighting"],
            default: "soft box"
          },
          angle: {
            type: "select",
            label: "Camera Angle",
            options: ["front view", "3/4 view", "top view", "side profile", "isometric"],
            default: "3/4 view"
          }
        },
        inputFields: [
          { name: "product", required: true },
          { name: "background", required: true },
          { name: "lighting", required: true },
          { name: "angle", required: true }
        ]
      }
    ];

    // OpenAI presets with variables  
    const openaiPresets = [
      {
        title: "Character Design Workshop",
        description: "Design unique characters with customizable traits and styles",
        slug: "character-design-openai",
        prompt: "A {{character_type}} character design, {{art_style}} art style, {{gender}} {{age}}, {{personality}} personality, {{clothing}}, {{color_scheme}} color palette, concept art",
        badge: "Character",
        badgeColor: "#EF4444",
        credits: 3,
        category: "characters",
        provider: "OPENAI",
        variables: {
          character_type: {
            type: "select",
            label: "Character Type",
            options: ["fantasy warrior", "space explorer", "medieval knight", "cyberpunk hacker", "magical wizard", "steampunk inventor"],
            default: "fantasy warrior"
          },
          art_style: {
            type: "select",
            label: "Art Style",
            options: ["anime", "realistic", "cartoon", "comic book", "concept art"],
            default: "concept art"
          },
          gender: {
            type: "select",
            label: "Gender",
            options: ["male", "female", "non-binary"],
            default: "male"
          },
          age: {
            type: "select",
            label: "Age Group",
            options: ["young adult", "middle-aged", "elderly", "teenager"],
            default: "young adult"
          },
          personality: {
            type: "text",
            label: "Personality Traits",
            placeholder: "brave and determined",
            required: true
          },
          clothing: {
            type: "text",
            label: "Clothing/Armor",
            placeholder: "leather armor with metal details",
            required: true
          },
          color_scheme: {
            type: "select",
            label: "Color Scheme",
            options: ["earth tones", "vibrant", "dark and moody", "pastel", "monochromatic"],
            default: "earth tones"
          }
        },
        inputFields: [
          { name: "character_type", required: true },
          { name: "art_style", required: true },
          { name: "gender", required: true },
          { name: "age", required: true },
          { name: "personality", required: true },
          { name: "clothing", required: true },
          { name: "color_scheme", required: true }
        ]
      },
      {
        title: "Architecture Visualizer",
        description: "Visualize architectural designs and interior spaces",
        slug: "architecture-openai",
        prompt: "{{building_type}} architecture, {{style}} style, {{materials}} materials, {{lighting_type}} lighting, {{environment}}, architectural visualization, professional rendering",
        badge: "Architecture",
        badgeColor: "#6366F1",
        credits: 4,
        category: "architecture",
        provider: "OPENAI",
        variables: {
          building_type: {
            type: "select",
            label: "Building Type",
            options: ["modern house", "office building", "apartment complex", "restaurant interior", "hotel lobby", "retail store"],
            default: "modern house"
          },
          style: {
            type: "select",
            label: "Architectural Style",
            options: ["minimalist", "industrial", "scandinavian", "mediterranean", "contemporary", "traditional"],
            default: "minimalist"
          },
          materials: {
            type: "text",
            label: "Primary Materials",
            placeholder: "glass, steel, and concrete",
            required: true
          },
          lighting_type: {
            type: "select",
            label: "Lighting",
            options: ["natural daylight", "warm interior", "dramatic spotlights", "ambient LED", "candlelight"],
            default: "natural daylight"
          },
          environment: {
            type: "text",
            label: "Environment/Setting",
            placeholder: "surrounded by gardens",
            required: false
          }
        },
        inputFields: [
          { name: "building_type", required: true },
          { name: "style", required: true },
          { name: "materials", required: true },
          { name: "lighting_type", required: true },
          { name: "environment", required: false }
        ]
      }
    ];

    // Combine all presets
    const allPresets = [...fluxPresets, ...openaiPresets];

    // Create presets
    for (const presetData of allPresets) {
      const existingPreset = await prisma.preset.findUnique({
        where: { slug: presetData.slug }
      });

      if (existingPreset) {
        console.log(`⚠️  Preset "${presetData.title}" already exists, skipping...`);
        continue;
      }

      const preset = await prisma.preset.create({
        data: presetData
      });

      console.log(`✅ Created preset: "${preset.title}" (${preset.provider})`);
    }

    console.log('\n🎉 Preset seeding completed!');

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedPresets();