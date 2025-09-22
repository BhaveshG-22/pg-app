'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"

// Generate portrait styles for masonry background
const generateAllStyles = () => {
  const styles = []
  const heights = ['h-64', 'h-72', 'h-80', 'h-96', 'h-[400px]', 'h-[450px]', 'h-[500px]', 'h-[350px]']
  const colors = [
    'from-blue-500 to-purple-500',
    'from-pink-500 to-red-500',
    'from-green-500 to-teal-500',
    'from-purple-500 to-indigo-500',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-red-500 to-pink-500',
    'from-rose-500 to-pink-500',
    'from-yellow-500 to-red-500',
    'from-gray-500 to-slate-600',
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-green-600'
  ]

  const styleNames = [
    'Professional Headshot', 'Anime Portrait', '3D Avatar', 'Artistic Sketch',
    'Vintage Style', 'Cyberpunk', 'Fantasy Warrior', 'Glamour Shot',
    'Superhero', 'Medieval Knight', 'Noir Detective', 'Renaissance',
    'Corporate Executive', 'Fashion Editorial', 'Watercolor', 'Pop Art',
    'Oil Painting', 'Comic Book', 'Steampunk', 'Gothic Portrait',
    'Pin-up Style', 'Film Noir', 'Retro Future', 'Abstract Art',
    'Impressionist', 'Baroque', 'Art Deco', 'Minimalist',
    'Grunge Style', 'Psychedelic', 'Vintage Hollywood', 'Modern Art',
    'Street Art', 'Digital Art', 'Concept Art', 'Fantasy Art'
  ]

  const imageUrls = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=450&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=650&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=480&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=520&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=580&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=470&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=550&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=650&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=480&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=580&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=450&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=550&fit=crop&crop=face'
  ]

  // Generate variations for each style (4 images per style for carousel)
  const generateVariations = (baseIndex: number, count: number = 4) => {
    const variations = []
    for (let i = 0; i < count; i++) {
      const imageIndex = (baseIndex + i) % imageUrls.length
      variations.push(imageUrls[imageIndex])
    }
    return variations
  }

  // Generate 60 cards for infinite scroll feeling
  for (let i = 0; i < 60; i++) {
    styles.push({
      id: `S${i + 1}`,
      title: styleNames[i % styleNames.length],
      image: imageUrls[i % imageUrls.length],
      variations: generateVariations(i, 4),
      color: colors[i % colors.length],
      height: heights[i % heights.length],
    })
  }

  return styles
}

const allStyles = generateAllStyles()

// PhotoAI-style Grid Background Component with Continuous Scroll
const HeroInfiniteSliderBg = () => {
  // Create grid of small portrait images similar to PhotoAI
  const createGridImages = () => {
    const gridImages = []
    for (let i = 0; i < 200; i++) { // More images for seamless scroll
      gridImages.push({
        id: i,
        src: allStyles[i % allStyles.length].image,
        alt: `Portrait ${i}`
      })
    }
    return gridImages
  }

  const gridImages = createGridImages()

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Desktop Grid Background - Large screens and up */}
      <div className="absolute inset-0 scale-150 -translate-y-32 hidden lg:block" style={{
        transformStyle: 'preserve-3d',
        transform: 'rotateX(20deg) rotateY(0deg) skewX(335deg)',
        width: '150%',
        height: '150%',
        top: '-25%',
        left: '-25%'
      }}>
        <div className="relative w-full h-full overflow-hidden">
          <motion.div
            className="flex gap-2 h-full"
            animate={{
              x: [0, -1000],
              y: [100, -100]
            }}
            transition={{
              duration: 120,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            {Array.from({ length: 10 }).map((_, sectionIdx) => (
              <div key={sectionIdx} className="flex-shrink-0 w-[2400px] h-full">
                <div className="grid w-full h-full overflow-hidden" style={{
                  gridTemplateColumns: 'repeat(18, 1fr)',
                  gridTemplateRows: 'repeat(8, 1fr)',
                  gap: '4px'
                }}>
                  {gridImages.slice(sectionIdx * 36, (sectionIdx * 36) + 144).map((image) => (
                    <div
                      key={`${sectionIdx}-${image.id}`}
                      className="w-full h-full overflow-hidden"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={100}
                        height={120}
                        className="w-full h-full object-cover rounded-sm opacity-90"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile and Tablet Background - Up to large screens */}
      <div className="absolute inset-0 lg:hidden overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            transform: 'scale(1.1) rotate(6deg)',
            top: '-20%',
            left: '-20%',
            right: '-20%',
            bottom: '-20%'
          }}
        >
          {/* Multiple rows with different speeds for depth */}
          {Array.from({ length: 6 }).map((_, rowIdx) => (
            <motion.div
              key={rowIdx}
              className="flex gap-2 w-max"
              animate={{
                x: rowIdx % 2 === 0 ? [0, -1200] : [-1200, 0]
              }}
              transition={{
                duration: 80 + rowIdx * 15,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
              style={{
                position: 'absolute',
                top: `${rowIdx * 10}%`,
                left: rowIdx % 2 === 0 ? '0%' : '-50%'
              }}
            >
              {gridImages.slice(rowIdx * 6, (rowIdx * 6) + 12).map((image, imgIdx) => (
                <div
                  key={`mobile-row-${rowIdx}-img-${imgIdx}`}
                  className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 overflow-hidden rounded-xl shadow-sm"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover opacity-50"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {gridImages.slice(rowIdx * 6, (rowIdx * 6) + 12).map((image, imgIdx) => (
                <div
                  key={`mobile-row-${rowIdx}-img-dup-${imgIdx}`}
                  className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 overflow-hidden rounded-xl shadow-sm"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover opacity-50"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lighter overlay for better background visibility */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-32 bg-background">
      {/* Diagonal Grid Background */}
      <HeroInfiniteSliderBg />

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Price Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-primary/20 shadow-lg">
              <span className="text-2xl">💰</span>
              <span className="font-semibold text-primary">
                <span className="block sm:hidden">$0.99 → End Overpriced Photos</span>
                <span className="hidden sm:block">$0.99 → The End of Overpriced Photos</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="text-primary">🔥</span> Your Face Deserves AI Glow
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              <span className="font-bold">Skip the shoot.</span> <span className="underline">Upload your pic.</span> Get <em className="text-primary">instant glow-ups</em> in <strong>every style</strong>.
            </p>

            {/* Feature Bullets */}
            <ul className="space-y-4 text-lg text-muted-foreground mb-8">
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">✓</span>
                <span>Keep <strong>100%</strong> of photos with yourself & get AI photos in <em>minutes</em></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">✓</span>
                <span><strong>40+ AI styles:</strong> choose professional, anime, artistic, or creative presets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg">✓</span>
                <span><strong>Full rights:</strong> use photos for professional, business, or personal use</span>
              </li>
            </ul>
          </div>

          {/* Right: Signup Form Card */}
          <div className="flex-shrink-0 w-full max-w-md">
            <div className="bg-card border border-border p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-muted-foreground">Free Photo Generator</span>
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground">Get Started in 30 Seconds</h3>
                </div>

                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-border bg-background text-foreground placeholder-muted-foreground rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  🎨 Get your first photo for free
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-card text-muted-foreground font-medium">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full h-12 px-6 bg-background border border-border rounded-2xl flex items-center justify-center transition-all duration-200 hover:bg-muted"
                >
                  <FcGoogle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-base font-medium text-card-foreground">Continue with Google</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    Already have an account? We&apos;ll log you in automatically
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}