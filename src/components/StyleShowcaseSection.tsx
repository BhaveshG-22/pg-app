'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Palette, Camera } from "lucide-react"

export function StyleShowcaseSection() {
  const styles = [
    {
      id: "ghibli",
      name: "Ghibli Style",
      description: "Whimsical anime-inspired art with dreamy, hand-drawn aesthetics",
      image: "https://ext.same-assets.com/3379581085/1723444328.webp",
      color: "from-green-400 to-blue-500",
      icon: "🌟",
      popular: true
    },
    {
      id: "pixar",
      name: "3D Pixar",
      description: "Professional 3D character design with Pixar-quality rendering",
      image: "https://ext.same-assets.com/3379581085/35270883.webp",
      color: "from-blue-400 to-purple-500",
      icon: "🎬",
      popular: false
    },
    {
      id: "comic",
      name: "Comic Style",
      description: "Bold comic book aesthetics with vibrant colors and sharp lines",
      image: "https://ext.same-assets.com/3379581085/766337669.webp",
      color: "from-red-400 to-pink-500",
      icon: "💥",
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      description: "High-end corporate headshots with studio lighting and polish",
      image: "https://ext.same-assets.com/3379581085/3879591529.webp",
      color: "from-gray-400 to-slate-500",
      icon: "💼",
      popular: true
    },
    {
      id: "artistic",
      name: "Oil Painting",
      description: "Classical oil painting style with rich textures and brushstrokes",
      image: "https://ext.same-assets.com/3379581085/422241117.webp",
      color: "from-amber-400 to-orange-500",
      icon: "🎨",
      popular: false
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      description: "Futuristic neon-lit aesthetic with digital enhancement effects",
      image: "https://ext.same-assets.com/3379581085/2124898767.webp",
      color: "from-cyan-400 to-blue-600",
      icon: "⚡",
      popular: false
    }
  ]

  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleStyleSelect = (style: typeof styles[0]) => {
    if (style.id === selectedStyle.id) return
    
    setIsLoading(true)
    setTimeout(() => {
      setSelectedStyle(style)
      setIsLoading(false)
    }, 300)
  }

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Preview</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Try Different AI Styles Instantly
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Click any style below to see how your photos would transform. No upload required - just pure AI magic in real-time.
          </p>
        </div>

        {/* Style Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {styles.map((style) => (
              <Button
                key={style.id}
                variant={selectedStyle.id === style.id ? "default" : "outline"}
                className={`h-auto px-6 py-4 transition-all duration-300 ${
                  selectedStyle.id === style.id 
                    ? "bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary/20" 
                    : "hover:bg-muted hover:scale-105"
                }`}
                onClick={() => handleStyleSelect(style)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{style.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{style.name}</span>
                      {style.popular && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Preview Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-card-foreground">Live Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Real-time</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image Preview */}
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-xl">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center bg-muted"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-lg font-medium text-muted-foreground">Transforming...</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.img
                        key={selectedStyle.id}
                        src={selectedStyle.image}
                        alt={selectedStyle.name}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </AnimatePresence>

                  {/* Style overlay badge */}
                  {!isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <div className="bg-card/95 backdrop-blur-sm px-4 py-3 rounded-2xl border border-border flex items-center gap-3 shadow-lg">
                        <span className="text-xl">{selectedStyle.icon}</span>
                        <span className="font-bold text-card-foreground">{selectedStyle.name}</span>
                        <div className={`ml-auto w-4 h-4 rounded-full bg-gradient-to-r ${selectedStyle.color}`}></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Style Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedStyle.color}`}></div>
                    <h4 className="text-2xl font-bold text-card-foreground">{selectedStyle.name}</h4>
                    {selectedStyle.popular && (
                      <Badge variant="outline" className="text-sm">
                        ⭐ Most Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {selectedStyle.description}
                  </p>
                </div>

                <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                  <h5 className="font-semibold text-card-foreground mb-3">What you get:</h5>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      High-resolution 4K output
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Commercial usage rights
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Instant 5-minute processing
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 h-14 text-lg font-semibold">
                    Try This Style
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 h-14">
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}