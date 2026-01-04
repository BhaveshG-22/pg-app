'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useDbUser } from '@/hooks/useDbUser'

interface Preset {
  id: string
  slug: string
  title: string
  description: string
  beforeImage: string
  afterImage: string
  thumbnailImage: string
  badge: string
  badgeColor: string
  credits: number
  category: string
  featured?: boolean
}

export default function StudioPage() {
  const { user: clerkUser, isLoaded } = useUser()
  const { user: dbUser, isLoaded: isDbUserLoaded } = useDbUser()
  const [presets, setPresets] = useState<Preset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch('/api/presets')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.success) {
          setPresets(data.presets || [])
        } else {
          console.error('API returned error:', data.error)
          setPresets([])
        }
      } catch (error) {
        console.error('Failed to fetch presets:', error)
        setPresets([])
      } finally {
        setLoading(false)
      }
    }

    fetchPresets()
  }, [])

  // Get unique categories from presets
  const categories = ['All', ...Array.from(new Set(presets.map(preset => preset.category || 'Style').filter(Boolean)))]

  // Filter presets by selected category
  const filteredPresets = selectedCategory === 'All'
    ? presets
    : presets.filter(preset => (preset.category || 'Style') === selectedCategory)

  if (!isLoaded || !isDbUserLoaded) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading studio...</p>
        </div>
      </div>
    )
  }

  if (!clerkUser || !dbUser) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Please sign in</h2>
          <p className="text-muted-foreground">You need to be signed in to access the studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-content-bg">
      <div className="w-full p-4 md:p-6 pb-8">
        {/* Category Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-8 gap-1.5 px-3 rounded-full ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
                  : 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPresets.map((preset) => (
              <PresetCard key={preset.id} preset={preset} />
            ))}
          </div>
        )}

        {!loading && filteredPresets.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-card-foreground mb-2">No presets found</h3>
            <p className="text-muted-foreground">
              {selectedCategory === 'All' ? 'No presets available' : `No presets in ${selectedCategory} category`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function PresetCard({ preset }: { preset: Preset }) {
  // Prioritize thumbnailImage, then beforeImage, then fallback
  const imageUrl = preset.thumbnailImage || preset.beforeImage || '';

  return (
    <Link href={`/studio/${preset.slug}`} className="group relative aspect-square overflow-hidden rounded-lg">
      {/* Main Image */}
      {imageUrl && imageUrl.trim() !== '' ? (
        <Image
          src={imageUrl}
          alt={preset.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-4xl">🎨</div>
        </div>
      )}

      {/* Hover Overlay with Description */}
      <div className="absolute inset-0 flex items-end bg-black/30 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-medium text-white">{preset.description}</p>
      </div>

      {/* Top Right Badges */}
      <div className="absolute top-2 right-2 flex max-w-[calc(100%-16px)] flex-wrap justify-end gap-1">
        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap border-transparent bg-secondary text-secondary-foreground">
          {preset.category || 'Style'}
        </span>
        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap border-transparent bg-primary text-primary-foreground">
          {preset.credits} credits
        </span>
      </div>

      {/* Bottom Left Title Badge */}
      <div className="absolute bottom-2 left-2">
        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap border-transparent bg-black/70 text-white backdrop-blur-sm">
          {preset.title}
        </span>
      </div>
    </Link>
  )
}