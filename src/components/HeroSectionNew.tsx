import { HeroAnimations, FloatingElements, AnimatedGradient } from "./HeroAnimations"
import { HeroForm } from "./HeroForm"

// Generate portrait styles for masonry background (server-side)
const generateAllStyles = () => {
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

  const gridImages = []
  for (let i = 0; i < 200; i++) {
    gridImages.push({
      id: `img-${i}`,
      src: imageUrls[i % imageUrls.length],
      alt: `Portrait ${i}`
    })
  }
  return gridImages
}

const gridImages = generateAllStyles()

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black flex items-center">
      {/* Background with animations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0">
          <AnimatedGradient />
        </div>

        {/* Floating Elements */}
        <FloatingElements />

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Main Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Animated Background Images */}
      <HeroAnimations gridImages={gridImages} />

      {/* Enhanced overlays for better background visibility */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Hero Text */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                AI Photo
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Generator
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Transform your photos into stunning AI-generated masterpieces. 
                Choose from professional styles or unleash your creativity.
              </p>
            </div>

            {/* Feature highlights */}
            <ul className="text-left space-y-3 text-lg text-gray-200 max-w-2xl">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl font-bold">✓</span>
                <span><strong className="text-white">Instant results:</strong> AI-powered transformations in seconds</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl font-bold">✓</span>
                <span><strong className="text-white">50+ styles:</strong> professional, artistic, and creative options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl font-bold">✓</span>
                <span><strong className="text-white">Full rights:</strong> use photos for professional, business, or personal use</span>
              </li>
            </ul>
          </div>

          {/* Right: Signup Form Card */}
          <div className="flex-shrink-0 w-full max-w-md">
            <div className="relative p-1 rounded-3xl overflow-hidden">
              {/* Animated border glow */}
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 270deg, #ff0080 280deg, #7928ca 290deg, #0070f3 300deg, #00d4ff 310deg, transparent 320deg)',
                  animation: 'spin 2s linear infinite'
                }}
              />
              {/* Static border base */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
              <div className="relative bg-card p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <HeroForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}