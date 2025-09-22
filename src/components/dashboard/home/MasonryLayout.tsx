'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const cardData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=40&h=40&fit=crop&crop=face",
    name: "James Wilson",
    reposts: 7,
    likes: 45
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=350&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=40&h=40&fit=crop&crop=face",
    name: "David Kim",
    reposts: 5,
    likes: 38
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=450&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    name: "Basil Hashmi",
    reposts: 1,
    likes: 24
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face",
    name: "Zoe Adams",
    reposts: 28,
    likes: 267
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=420&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    name: "Alex Rivera",
    reposts: 31,
    likes: 245
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=380&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    name: "Keit Fisher",
    reposts: 15,
    likes: 128
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=320&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    name: "Jad Limcaco",
    reposts: 8,
    likes: 67
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=480&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face",
    name: "Marcus Lee",
    reposts: 14,
    likes: 178
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=280&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face",
    name: "Grace Lin",
    reposts: 22,
    likes: 189
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=400&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    name: "Les Twitchen",
    reposts: 6,
    likes: 42
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=360&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=40&h=40&fit=crop&crop=face",
    name: "Maya Johnson",
    reposts: 16,
    likes: 134
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=440&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face",
    name: "Emma Clark",
    reposts: 12,
    likes: 89
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=340&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    name: "Sophia Martinez",
    reposts: 9,
    likes: 156
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=460&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    name: "Ryan Cooper",
    reposts: 18,
    likes: 203
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=310&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&h=40&fit=crop&crop=face",
    name: "Isabella Brown",
    reposts: 25,
    likes: 298
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=500&fit=crop",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    name: "Noah Wilson",
    reposts: 4,
    likes: 73
  }
]



// Generate a large array of portrait styles with varying dimensions for infinite masonry
const generatePortraitStyles = (): StyleType[] => {
  const styles: StyleType[] = []
  const heights = ['h-64', 'h-72', 'h-80', 'h-88', 'h-96', 'h-[400px]', 'h-[450px]', 'h-[500px]']
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
    'Street Art', 'Digital Art', 'Concept Art', 'Fantasy Art',
    'Sci-Fi Portrait', 'Horror Style', 'Romantic Era', 'Victorian',
    'Edwardian', 'Art Nouveau', 'Cubist', 'Surreal',
    'Photorealistic', 'Hyperrealistic', 'Caricature', 'Silhouette',
    'High Fashion', 'Avant Garde', 'Experimental', 'Futuristic'
  ]

  // Portrait images from Unsplash with different crops and filters
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
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=450&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=550&fit=crop&crop=face'
  ]

  // Generate variations for each style (3-4 images per style for carousel)
  const generateVariations = (baseIndex: number, count: number = 3): string[] => {
    const variations: string[] = []
    for (let i = 0; i < count; i++) {
      const imageIndex = (baseIndex + i) % imageUrls.length
      variations.push(imageUrls[imageIndex])
    }
    return variations
  }

  // Generate 50+ cards for infinite scroll feeling
  for (let i = 0; i < 60; i++) {
    styles.push({
      id: `S${i + 1}`,
      title: styleNames[i % styleNames.length],
      image: imageUrls[i % imageUrls.length],
      variations: generateVariations(i, 4), // 4 variations per style
      color: colors[i % colors.length],
      height: heights[i % heights.length],
    })
  }

  return styles
}

const allStyles = generatePortraitStyles()


interface StyleType {
  id: string
  title: string
  image: string
  variations: string[]
  color: string
  height: string
}


interface StyleCarouselProps {
  style: StyleType
  isHovered: boolean
  index: number
  cardHeight: string
}

// Carousel component for style variations
const StyleCarousel = ({ style, isHovered, index: cardIndex, cardHeight }: StyleCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Determine if it's a small card (height-64, height-72)
  const isSmallCard = cardHeight === 'h-64' || cardHeight === 'h-72'

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % style.variations.length)
    }, 1000) // Change image every 1 second

    return () => clearInterval(interval)
  }, [style.variations.length])

  return (
    <div className="relative w-full h-full">
      <Image
        src={isHovered ? style.variations[currentIndex] : style.image}
        alt={style.title}
        width={400}
        height={600}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-125 group-hover:brightness-110"
        loading={cardIndex < 20 ? "eager" : "lazy"}
      />

      {/* Carousel dots - show only on hover and for larger cards */}
      {isHovered && !isSmallCard && (
        <div className="absolute top-3 right-3 flex gap-1 z-10">
          {style.variations.map((_: string, idx: number) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white shadow-lg' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      )}

      {/* For small cards, show minimal progress indicator */}
      {isHovered && isSmallCard && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-4 h-1 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / style.variations.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function MasonryLayout() {
  const containerRef = useRef<HTMLDivElement>(null)


  return (
    <>
      <div className="mb-6 mt-4 select-none">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Which one do you want to explore today?
          </h2>
          <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            View All
          </button>
        </div>
        <p className="text-sm text-gray-300 max-w-3xl">
          Explore handpicked styles below and start transforming your image with just one click.
        </p>
      </div>

      <div className="relative pb-4 overflow-hidden min-h-[800px] w-full gap-6 px-8 transition-all duration-300 pt-4 select-none">
        {/* <div 
          ref={containerRef} 
          className="select-none columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-5 gap-4 space-y-4 mx-auto max-w-full"
        >
          {cardData.map((card, index) => (
            <div
              key={index}
              className="masonry-item break-inside-avoid mb-4"
            >
              <div className="bg-transparent rounded-xl overflow-hidden border border-gray-700 relative group">
                <img
                  className="h-auto w-full rounded-lg object-cover cursor-pointer"
                  src={card.imageUrl}
                  alt="Gallery image"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-75 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div> */}

 

        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4 w-full">
          {allStyles.map((style, index) => (
            <div
              key={style.id}
              className="break-inside-avoid mb-4 w-full"
            >
              <div className={`group relative ${style.height} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20`}>
                <StyleCarousel
                  style={style}
                  isHovered={false}
                  index={index}
                  cardHeight={style.height}
                />

                {/* Base gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300" />

                {/* Animated gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-purple-900/20 group-hover:via-transparent group-hover:to-transparent transition-all duration-500`} />

                {/* Style ID Badge */}
                <div className="absolute top-3 left-3 transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <Badge className={`bg-gradient-to-r ${style.color} text-white font-bold px-3 py-1 text-xs shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:px-4`}>
                    {style.id}
                  </Badge>
                </div>

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
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 via-gray-800/80 to-transparent pointer-events-none z-10" />
      </div>

      <div className="flex justify-center mt-8 mb-8 select-none">
        <button className="px-6 py-3 border border-gray-600 text-sm text-gray-300 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
          🌐 More inspiration
        </button>
      </div>
    </>
  )
}