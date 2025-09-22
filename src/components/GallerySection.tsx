'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image"

// StyleCarousel component for the Pinterest gallery
const StyleCarousel = ({ style, cardHeight }: {
  style: { id: string; title: string; image: string; variations: string[]; color: string; height: string }
  cardHeight: string
}) => {
  return (
    <div className={`relative ${cardHeight} w-full overflow-hidden bg-gray-900`}>
      {/* Main portrait image */}
      <Image
        src={style.image}
        alt={style.title}
        width={400}
        height={500}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Style variations overlay (shows on hover) */}
      {style.variations && style.variations.length > 1 && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="grid grid-cols-2 h-full gap-1 p-1">
            {style.variations.slice(0, 4).map((variation: string, idx: number) => (
              <Image
                key={idx}
                src={variation}
                alt={`${style.title} variation ${idx + 1}`}
                width={200}
                height={250}
                className="w-full h-full object-cover rounded-sm"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

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

export function GallerySection() {
  return (
    <section className="w-full bg-gray-900 relative">
      {/* Full-width Masonry Grid - Edge to Edge */}
      <div className="w-full px-2 pt-8">
        <div className="columns-2 sm:columns-3 md:columns-5 lg:columns-6 gap-3">
          {allStyles.slice(0, 30).map((style) => {
            return (
              <div
                key={style.id}
                className="break-inside-avoid mb-4 w-full"
              >
                <div className={`group relative ${style.height} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20`}>
                  <StyleCarousel
                    style={style}
                    cardHeight={style.height}
                  />

                  {/* Base gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300" />

                  {/* Animated gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-purple-900/20 group-hover:via-transparent group-hover:to-transparent transition-all duration-500`} />

                  {/* Conditional Hover Overlay based on card size */}
                  {(style.height === 'h-64' || style.height === 'h-72') ? (
                    /* Simple overlay for small cards */
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
                      <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300 pointer-events-auto">
                        <Button className="bg-white/90 text-black hover:bg-white font-semibold shadow-lg px-3 py-1.5 text-xs rounded-full">
                          <span className="text-purple-600">🎨</span> Try
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Full overlay for larger cards */
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 pointer-events-none">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 pointer-events-auto">
                        <Button className="bg-white/95 text-black hover:bg-white font-bold shadow-2xl transform transition-all duration-300 hover:scale-105 border border-black/20 backdrop-blur-sm px-4 py-2 text-sm">
                          <span className="text-purple-600">🎨</span> Try This Style
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Style Title */}
                  <div className="absolute bottom-3 left-3 right-3 transform transition-all duration-300 group-hover:bottom-4">
                    <h3 className="text-white font-bold text-sm drop-shadow-lg transition-all duration-300 group-hover:text-lg group-hover:drop-shadow-2xl">{style.title}</h3>
                    <div className="h-0 group-hover:h-4 transition-all duration-300 overflow-hidden">
                      <p className="text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Click to transform your photo</p>
                    </div>
                  </div>

                  {/* Enhanced border with glow effect */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/40 transition-all duration-300" />

                  {/* Glowing border effect */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${style.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                    style={{
                      background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor'
                    }} />

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overlaid Header Section with Enhanced Background */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Header with Dark Background Box */}
            <div className="inline-block bg-black/80 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                ✨ AI Photo Gallery
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Let&apos;s give you a makeover
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}