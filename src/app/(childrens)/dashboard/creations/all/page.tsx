'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Download, Calendar, Eye, Grid, List, ExternalLink, Filter } from 'lucide-react'
import Image from 'next/image'

interface Generation {
  id: string
  outputUrl: string
  outputSize: string
  createdAt: string
  presetId: string
}

interface Preset {
  id: string
  title: string
  badge: string
  badgeColor: string
  slug: string
}

export default function AllCreationsPage() {
  const { user, isLoaded } = useUser()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [presets, setPresets] = useState<Record<string, Preset>>({})
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedPresetFilter, setSelectedPresetFilter] = useState<string>('all')

  // ESC key handler for modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  // Fetch all user generations
  useEffect(() => {
    const fetchGenerations = async () => {
      if (!isLoaded || !user) return

      try {
        setLoading(true)

        // Fetch all generations (no presetId filter)
        const generationsResponse = await fetch('/api/generations')
        if (generationsResponse.ok) {
          const data = await generationsResponse.json()
          setGenerations(data.generations || [])

          // Get unique preset IDs
          const presetIds = [...new Set(data.generations?.map((g: Generation) => g.presetId) || [])]

          // Fetch preset details for each unique preset
          const presetPromises = presetIds.map(async (presetId) => {
            try {
              const response = await fetch(`/api/presets/by-id/${presetId}`)
              if (response.ok) {
                const presetData = await response.json()
                return { id: presetId, ...presetData.preset }
              }
            } catch (error) {
              console.error(`Failed to fetch preset ${presetId}:`, error)
            }
            return null
          })

          const presetResults = await Promise.all(presetPromises)
          const presetsMap: Record<string, Preset> = {}

          presetResults.forEach((preset) => {
            if (preset) {
              presetsMap[preset.id] = preset
            }
          })

          setPresets(presetsMap)
        }
      } catch (error) {
        console.error('Error fetching generations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenerations()
  }, [isLoaded, user])

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `pixelglow-creation-${index + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter generations by selected preset
  const filteredGenerations = selectedPresetFilter === 'all'
    ? generations
    : generations.filter(gen => gen.presetId === selectedPresetFilter)

  // Get unique presets from generations for filter dropdown
  const uniquePresets = Object.values(presets).filter(preset =>
    generations.some(gen => gen.presetId === preset.id)
  )

  if (!isLoaded) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 bg-content-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Please sign in</h2>
          <p className="text-muted-foreground">You need to be signed in to view your creations.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-content-bg">
      <div className="mx-auto max-w-7xl px-6 py-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">All Creations</h1>
              <p className="text-muted-foreground mt-2">
                {loading ? 'Loading...' : `${filteredGenerations.length} creation${filteredGenerations.length !== 1 ? 's' : ''} ${selectedPresetFilter === 'all' ? 'total' : 'filtered'}`}
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select
              value={selectedPresetFilter}
              onChange={(e) => setSelectedPresetFilter(e.target.value)}
              className="bg-card border border-border text-card-foreground rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="all">All Presets ({generations.length})</option>
              {uniquePresets.map(preset => {
                const count = generations.filter(gen => gen.presetId === preset.id).length
                return (
                  <option key={preset.id} value={preset.id}>
                    {preset.badge} {preset.title} ({count})
                  </option>
                )
              })}
            </select>
            {selectedPresetFilter !== 'all' && (
              <button
                onClick={() => setSelectedPresetFilter('all')}
                className="text-sm text-primary hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your creations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && generations.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Eye className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No creations yet</h3>
            <p className="text-muted-foreground mb-6">Start creating amazing images with our AI tools!</p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explore Presets
            </a>
          </div>
        )}

        {/* No Results After Filter */}
        {!loading && generations.length > 0 && filteredGenerations.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No creations found</h3>
            <p className="text-muted-foreground mb-6">Try selecting a different preset filter.</p>
            <button
              onClick={() => setSelectedPresetFilter('all')}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Show All Creations
            </button>
          </div>
        )}

        {/* Grid View */}
        {!loading && filteredGenerations.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGenerations.map((generation, index) => {
              const preset = presets[generation.presetId]
              return (
                <div
                  key={generation.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={generation.outputUrl}
                      alt={`Creation ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedImage(generation.outputUrl)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="View full size"
                      >
                        <Eye className="h-5 w-5 text-white" />
                      </button>
                      <button
                        onClick={() => handleDownload(generation.outputUrl, index)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="Download"
                      >
                        <Download className="h-5 w-5 text-white" />
                      </button>
                      {preset && (
                        <a
                          href={`/studio/${preset.slug}`}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                          title={`Create with ${preset.title}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-5 w-5 text-white" />
                        </a>
                      )}
                    </div>

                    {/* Preset Badge - Clickable */}
                    {preset && (
                      <div className="absolute top-3 left-3">
                        <a
                          href={`/studio/${preset.slug}`}
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 ${preset.badgeColor} hover:shadow-md`}
                          title={`Create with ${preset.title}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {preset.badge}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {preset ? (
                      <a
                        href={`/studio/${preset.slug}`}
                        className="font-semibold text-card-foreground mb-1 hover:text-primary transition-colors block"
                        title={`Create with ${preset.title}`}
                      >
                        {preset.title}
                      </a>
                    ) : (
                      <h3 className="font-semibold text-card-foreground mb-1">
                        Unknown Style
                      </h3>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(generation.createdAt)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List View */}
        {!loading && filteredGenerations.length > 0 && viewMode === 'list' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {filteredGenerations.map((generation, index) => {
                const preset = presets[generation.presetId]
                return (
                  <div key={generation.id} className="p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={generation.outputUrl}
                          alt={`Creation ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {preset ? (
                            <a
                              href={`/studio/${preset.slug}`}
                              className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors"
                              title={`Create with ${preset.title}`}
                            >
                              {preset.title}
                            </a>
                          ) : (
                            <h3 className="text-lg font-semibold text-card-foreground">
                              Unknown Style
                            </h3>
                          )}
                          {preset && (
                            <a
                              href={`/studio/${preset.slug}`}
                              className={`px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105 ${preset.badgeColor} hover:shadow-md`}
                              title={`Create with ${preset.title}`}
                            >
                              {preset.badge}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(generation.createdAt)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedImage(generation.outputUrl)}
                          className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors"
                          title="View full size"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(generation.outputUrl, index)}
                          className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        {preset && (
                          <a
                            href={`/studio/${preset.slug}`}
                            className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors"
                            title={`Create with ${preset.title}`}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(e) => {
            // Close modal when pressing ESC
            if (e.key === 'Escape') {
              setSelectedImage(null)
            }
          }}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Enhanced Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm border border-white/20 hover:scale-110"
              title="Close (ESC)"
              aria-label="Close image preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"/>
                <path d="M6 6l12 12"/>
              </svg>
            </button>

            {/* Image Container - Fit to screen properly */}
            <div
              className="max-w-[90vw] max-h-[90vh] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full size creation"
                className="max-w-full max-h-full object-contain rounded-xl"
                style={{ maxWidth: '85vw', maxHeight: '85vh' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Instructions */}
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              Press <kbd className="bg-white/20 px-2 py-1 rounded text-xs">ESC</kbd> or click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}