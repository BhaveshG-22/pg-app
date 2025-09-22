const { PrismaClient } = require('../src/generated/prisma');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

const presets = [
  {
    title: "Double Exposure MotoGP (by Faruk Creative)",
    description: "A futuristic, double exposure cinematic poster featuring a MotoGP rider intertwined with racing visuals.",
    slug: "double-exposure-motogp",
    prompt: "Double Exposure, Midjourney Style, Compositing, Blending, Superimposing\nAn extraordinary futuristic masterpiece that reveals a stunning double exposure composition in which the silhouette of a MotoGP rider is harmoniously intertwined with the high-octane, precision-engineered world of MotoGP racing.\nInside the figure: a sleek BMW MotoGP motorcycle carving through a wet twilight circuit at intense speed, under futuristic LED track lights, reflective tarmac, and atmospheric motion blur.\nShades of cool steel blue, gunmetal grey, and subtle electric neon accents combine to convey a sense of modern tension, cutting-edge technology, and adrenaline.\nThe background remains neutral and slightly foggy, rendered in cool grey-blue tones, offering strong visual contrast while keeping focus on the intricate double exposure.\nThe silhouette gleams with cold cinematic lighting, hyper-detailed reflections, wet track light trails, and technical photorealism enhanced by fine lens flares and a documentary-meets-sci-fi mood.\n(Detailed:1.45). (Detailed background:1.4).",
    badge: "NEW",
    badgeColor: "blue",
    credits: 3,
    category: "Art",
    provider: "OPENAI"
  },
  {
    title: "Copilot Embroidery Mockup (by Godofeditsss)",
    description: "A photorealistic embroidered logo patch for branding mockups.",
    slug: "copilot-embroidery-mockup",
    prompt: "A high-quality, hyper-realistic embroidered patch of a logo or symbol, crafted with detailed thread and a stitched border.\nThe patch is displayed on a textured background such as canvas, denim, or neutral fabric.\nThe embroidery features detailed, tight stitching with visible thread texture and soft lighting that enhances the 3D depth of the stitches.\nThe composition is centered, with a clean and minimal layout. Shadows are subtle, and the overall image is crisp, detailed, and suitable for a product mockup or branding preview.",
    badge: "PRO",
    badgeColor: "purple",
    credits: 2,
    category: "Transform",
    provider: "OPENAI"
  },
  {
    title: "Hyper-Detailed Graphic Poster (by Capturedbyvishal)",
    description: "Black-and-white high-contrast artistic poster with strong branding and layered text.",
    slug: "hyper-detailed-graphic-poster",
    prompt: "Create a hyper-detailed graphic design featuring a striking portrait of a person with a confident demeanor. The composition includes voluminous hair texture, adding depth and visual interest.\nThe design uses high-contrast black and white tones with bold typography and layered text elements.\nThe overall aesthetic is modern, editorial, and suitable for branding or poster design with strong visual impact.",
    badge: "HOT",
    badgeColor: "red",
    credits: 2,
    category: "Art",
    provider: "OPENAI"
  },
  {
    title: "Editorial Fashion Portrait (by Capturedbyvishal)",
    description: "An ultra-stylized fashion portrait with cinematic lighting and minimal background.",
    slug: "editorial-fashion-portrait",
    prompt: "A highly stylized portrait with sharp features, flawless skin, wearing black sunglasses and standing against a bold red gradient background.\nThe lighting is cinematic and professional, creating dramatic shadows and highlights.\nThe composition is clean and minimal with a high-fashion editorial aesthetic.\nThe overall mood is confident and sophisticated with premium production quality.",
    badge: "FEATURED",
    badgeColor: "green",
    credits: 2,
    category: "Portrait",
    provider: "OPENAI"
  },
  {
    title: "3D Logo on Sportswear (ChatGPT for Designers)",
    description: "Prompt to convert a logo into a 3D embroidered patch on jersey fabric.",
    slug: "3d-logo-sportswear",
    prompt: "Convert an image into a realistic 3D embroidered patch on fabric that matches the dominant colors of the design.\nThe embroidery must preserve the exact shape, color, and proportion of the original while adding realistic textile texture.\nUse outdoor natural daylight for lighting, with a top-left camera perspective.\nThe result should look like professional sportswear branding with high-quality stitching details.",
    badge: "NEW",
    badgeColor: "blue",
    credits: 2,
    category: "Transform",
    provider: "OPENAI"
  },
  {
    title: "Photorealistic Selfie Poster (by nishwhy)",
    description: "Recreate a portrait exactly like a reference image using the user's selfie.",
    slug: "photorealistic-selfie-poster",
    prompt: "Create an ultra-realistic portrait that replicates professional photo composition, pose, and styling.\nThe output should maintain the user's facial features while enhancing the overall production quality.\nThe result should resemble a high-end smartphone photo in 4K resolution with perfect lighting and composition.\nFocus on creating a polished, professional-looking portrait with natural skin tones and realistic lighting.",
    badge: "POPULAR",
    badgeColor: "yellow",
    credits: 1,
    category: "Portrait",
    provider: "OPENAI"
  },
  {
    title: "Cinematic City View (by medex18)",
    description: "Bird's-eye cinematic view of a person on a city sidewalk.",
    slug: "cinematic-city-view",
    prompt: "Transform the image into a cinematic bird's-eye view of a person standing with hands in pockets on a brick city sidewalk.\nThe aesthetic should have a 35mm film effect with shallow depth of field and sharp focus on the subject.\nThe urban environment should be detailed with realistic textures and atmospheric lighting.\nThe overall mood should be cinematic and contemplative with professional film quality.",
    badge: "CINEMATIC",
    badgeColor: "purple",
    credits: 3,
    category: "Style",
    provider: "OPENAI"
  },
  {
    title: "Y2K Skate Culture Style (by Capturedbyvishal)",
    description: "Y2K-themed mid-air shot with fisheye effect and urban streetwear.",
    slug: "y2k-skate-culture-style",
    prompt: "Surreal Y2K-style action shot of a person mid-air in a dramatic leap, captured from an overhead fisheye view.\nThe aesthetic should be grainy like a 2001 skate video game frame with vibrant colors and urban streetwear styling.\nInclude nostalgic Y2K visual elements like digital glitch effects, bold colors, and retro urban environments.\nThe overall vibe should be energetic, rebellious, and authentically early 2000s.",
    badge: "RETRO",
    badgeColor: "pink",
    credits: 2,
    category: "Style",
    provider: "OPENAI"
  },
  {
    title: "9:16 Fashion Portrait (by Capturedbyvishal)",
    description: "Vertical high-fashion red background portrait with editorial vibes.",
    slug: "9-16-fashion-portrait",
    prompt: "A highly stylized vertical portrait with sharp features and flawless skin against a bold red background.\nThe composition should be symmetrical and minimal with editorial fashion photography aesthetics.\nUse professional lighting that creates dramatic contrast and highlights facial features.\nThe final image should be in 4K resolution with a 9:16 aspect ratio perfect for social media and fashion portfolios.",
    badge: "SOCIAL",
    badgeColor: "red",
    credits: 1,
    category: "Portrait",
    provider: "OPENAI"
  },
  {
    title: "Nostalgic Train Portrait (by Capturedbyvishal)",
    description: "Side profile shot on a train with a nostalgic 35mm film aesthetic.",
    slug: "nostalgic-train-portrait",
    prompt: "Side view of a person looking out the window of a moving train with a contemplative expression.\nThe aesthetic should be nostalgic and reminiscent of 35mm film with soft grain and moody natural lighting.\nCapture the romance of train travel with realistic interior details and atmospheric window reflections.\nThe overall mood should be peaceful, introspective, and cinematically beautiful with warm, natural tones.",
    badge: "VINTAGE",
    badgeColor: "gray",
    credits: 2,
    category: "Portrait",
    provider: "OPENAI"
  }
];

async function addPresets() {
  try {
    console.log('🚀 Starting to add presets...');
    
    for (const preset of presets) {
      try {
        // Check if preset already exists
        const existing = await prisma.preset.findUnique({
          where: { slug: preset.slug }
        });

        if (existing) {
          console.log(`⏭️  Skipping "${preset.title}" - already exists`);
          continue;
        }

        // Create the preset
        const created = await prisma.preset.create({
          data: preset
        });

        console.log(`✅ Created "${preset.title}" (${preset.slug})`);
      } catch (error) {
        console.error(`❌ Failed to create "${preset.title}":`, error.message);
      }
    }

    console.log('\n🎉 Finished adding presets!');
    
    // Show summary
    const totalPresets = await prisma.preset.count();
    console.log(`📊 Total presets in database: ${totalPresets}`);

  } catch (error) {
    console.error('💥 Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addPresets();