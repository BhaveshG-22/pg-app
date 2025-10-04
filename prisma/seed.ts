import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

const presetData = [
  {
    id: "1",
    title: "Fashion Shoot Portrait",
    description: "Transform your photos into professional fashion editorial shots with cinematic lighting and clean backgrounds.",
    badge: "📸 AI Fashion Filter",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    beforeImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&sat=2&hue=120",
    credits: 3,
    slug: "fashion-shoot-portrait",
    prompt: "He stands casually with hands in his pockets against a clean gradient background ((gradient)), looking straight at the camera. No text or logos in the background. Use shallow depth of field. Shot on a ((camera_model)) + ((lens)), ((lighting)), ((resolution)), cinematic editorial fashion shoot style.",
    category: "Professional"
  },
  {
    id: "2", 
    title: "Embroidery Patch",
    description: "Transform logos and designs into realistic embroidered patches with raised stitching and authentic texture.",
    badge: "🧵 AI Embroidery Filter",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    beforeImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=350&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=350&fit=crop&sat=2&hue=180",
    credits: 2,
    slug: "embroidery-patch",
    prompt: "Create a highly detailed embroidered patch of the ((uploaded_logo)). The patch should feature raised stitching and textured embroidery, giving it a realistic, 3D look. Maintain accurate colors and logo proportions. Present the patch isolated on a transparent PNG background, without any fabric or surface beneath it. Make it look like a professionally made logo patch ready for ((use_case)).",
    category: "Creative"
  },
  {
    id: "3",
    title: "Professional Headshots",
    description: "Get LinkedIn-ready professional headshots with perfect lighting and corporate backgrounds.",
    badge: "💼 Professional",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200", 
    beforeImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&sat=1.2&brightness=1.1",
    credits: 3,
    slug: "professional-headshots",
    prompt: "Professional corporate headshot with clean ((background_style)) background, natural lighting, sharp focus on face, business attire, confident expression, shot with ((camera_setup)), ((lighting_setup)), high resolution professional photography style.",
    category: "Professional"
  },
  {
    id: "4",
    title: "Anime Portrait Style",
    description: "Transform your photos into stunning anime-style artwork with vibrant colors and artistic flair.",
    badge: "🎌 Anime Style",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-200",
    beforeImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&sat=2&hue=30",
    credits: 4,
    slug: "anime-portrait-style", 
    prompt: "Anime style portrait artwork, ((style_type)) anime aesthetic, vibrant colors, ((art_style)), detailed eyes, smooth shading, manga-inspired, digital art style, ((color_palette)) color scheme, high quality anime illustration.",
    category: "Artistic"
  },
  {
    id: "5",
    title: "Cyberpunk Neon",
    description: "Create futuristic cyberpunk portraits with neon lighting and sci-fi aesthetics.",
    badge: "⚡ Cyberpunk",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    beforeImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&sat=2&hue=180",
    credits: 4,
    slug: "cyberpunk-neon",
    prompt: "Cyberpunk style portrait with ((neon_colors)) neon lighting, futuristic ((setting)), dramatic shadows, high contrast, sci-fi aesthetic, ((tech_elements)), cyberpunk 2077 style, neon glow effects, dark atmospheric background.",
    category: "Creative"
  },
  {
    id: "6",
    title: "Vintage Hollywood",
    description: "Classic golden age Hollywood glamour with dramatic lighting and timeless elegance.",
    badge: "🎬 Hollywood",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    beforeImage: "https://images.unsplash.com/photo-1494790108755-2616c668-40a2?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1494790108755-2616c668-40a2?w=300&h=400&fit=crop&sepia=60&contrast=1.2",
    credits: 3,
    slug: "vintage-hollywood",
    prompt: "Vintage Hollywood glamour portrait, ((decade)) style, classic ((lighting_style)) lighting, elegant pose, timeless beauty, film noir aesthetic, ((background_mood)), golden age cinema, dramatic shadows and highlights.",
    category: "Artistic"
  },
  {
    id: "7",
    title: "3D Avatar",
    description: "Create realistic 3D character avatars perfect for gaming and virtual worlds.", 
    badge: "🎮 3D Avatar",
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    beforeImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=400&fit=crop&sat=1.5",
    credits: 5,
    slug: "3d-avatar",
    prompt: "3D rendered character avatar, ((render_style)) rendering, detailed facial features, ((character_style)) design, game-ready model, clean background, ((lighting_setup)) lighting, high quality 3D graphics, Pixar-style or realistic rendering.",
    category: "Creative"
  },
  {
    id: "8",
    title: "Pop Art Style",
    description: "Bold pop art transformations with vibrant colors and comic book aesthetics.",
    badge: "🎨 Pop Art", 
    badgeColor: "bg-red-100 text-red-800 border-red-200",
    beforeImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&sat=3&contrast=1.5",
    credits: 3,
    slug: "pop-art-style",
    prompt: "Pop art style portrait, ((color_scheme)) color palette, bold outlines, ((art_technique)), comic book aesthetic, Andy Warhol inspired, high contrast, vibrant colors, graphic design style, retro pop culture art.",
    category: "Artistic"
  },
  {
    id: "9",
    title: "Watercolor Painting",
    description: "Soft watercolor painting style with artistic brushstrokes and natural flow.",
    badge: "🖌️ Watercolor",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    beforeImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=400&fit=crop&sat=1.3&blur=1",
    credits: 3,
    slug: "watercolor-painting",
    prompt: "Watercolor painting style portrait, ((color_palette)) colors, soft brushstrokes, ((painting_technique)), artistic flow, natural watercolor textures, ((mood)) atmosphere, hand-painted aesthetic, flowing pigments.",
    category: "Artistic"
  },
  {
    id: "10",
    title: "Film Noir",
    description: "Classic black and white film noir style with dramatic shadows and vintage mood.",
    badge: "🎭 Film Noir",
    badgeColor: "bg-gray-100 text-gray-800 border-gray-200", 
    beforeImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&sat=0&contrast=1.8",
    credits: 3,
    slug: "film-noir",
    prompt: "Film noir style portrait, dramatic ((lighting_angle)) lighting, high contrast black and white, ((mood)) atmosphere, vintage 1940s aesthetic, deep shadows, classic cinema style, mysterious mood, chiaroscuro lighting.",
    category: "Artistic"
  }
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (order matters due to foreign key constraints)
  await prisma.generation.deleteMany()
  console.log('🧹 Cleared existing generations')

  await prisma.preset.deleteMany()
  console.log('🧹 Cleared existing presets')

  // Seed presets
  for (const preset of presetData) {
    await prisma.preset.create({
      data: {
        title: preset.title,
        description: preset.description,
        slug: preset.slug,
        prompt: preset.prompt,
        badge: preset.badge,
        badgeColor: preset.badgeColor,
        credits: preset.credits,
        category: preset.category,
        examples: preset.beforeImage && preset.afterImage ? [{
          before: preset.beforeImage,
          after: preset.afterImage
        }] : undefined,
        thumbnailUrl: preset.beforeImage, // Use beforeImage as thumbnail for testing
      },
    })
  }

  console.log(`✅ Seeded ${presetData.length} presets`)
  console.log('🌱 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })