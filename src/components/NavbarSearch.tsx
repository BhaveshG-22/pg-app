'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePresets } from '@/contexts/PresetContext'

export function NavbarSearch({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const { presets, loading, searchPresets } = usePresets()

  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchPresets(searchQuery)
  }, [searchQuery, searchPresets])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowResults(value.trim().length > 0)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowResults(false)
    setShowMobileModal(false)
  }

  const handlePresetClick = (slug: string) => {
    router.push(`/studio/${slug}`)
    clearSearch()
  }

  const handleMobileSearchClick = () => {
    if (isMobile) {
      setShowMobileModal(true)
    }
  }

  // Mobile version - just a search icon
  if (isMobile) {
    return (
      <>
        <button
          onClick={handleMobileSearchClick}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Search presets"
        >
          <Search className="h-5 w-5 text-white" />
        </button>

        {/* Mobile Search Modal */}
        {showMobileModal && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
            <div className="bg-sidebar border-b border-border">
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search presets..."
                    className="w-full pl-9 pr-10 py-3 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 text-base"
                    autoFocus
                  />
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>

              {/* Mobile Search Results */}
              {searchQuery.trim() && (
                <div className="max-h-[70vh] overflow-y-auto bg-card">
                  {loading ? (
                    <div className="p-6 text-center">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  ) : filteredPresets.length > 0 ? (
                    <div className="p-2">
                      <div className="text-sm font-medium text-muted-foreground px-4 py-3 border-b border-border">
                        {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''} found
                      </div>
                      {filteredPresets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetClick(preset.slug)}
                          className="w-full p-4 hover:bg-muted rounded-lg transition-colors duration-200 text-left group"
                        >
                          <div className="flex items-center gap-4">
                            {(() => {
                              // Prioritize thumbnailImage, then beforeImage, then fallback
                              const imageUrl = preset.thumbnailImage || preset.beforeImage || '';
                              return imageUrl && imageUrl.trim() !== '' ? (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                  <Image
                                    src={imageUrl}
                                    alt={preset.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={() => console.warn(`Failed to load image for preset: ${preset.title}`)}
                                  />
                                </div>
                              ) : null;
                            })()}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-card-foreground text-base truncate">
                                {preset.title}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {preset.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${preset.badgeColor}`}>
                                  {preset.badge}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {preset.credits} credits
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-base">No presets found</p>
                      <p className="text-sm mt-2 opacity-70">Try different keywords</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop version
  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Search className="h-4 w-4 text-white stroke-2" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search presets..."
          className="w-80 pl-9 pr-8 py-2 bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 text-sm"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>

      {/* Desktop Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg max-h-80 overflow-y-auto z-[60]">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-pulse">
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ) : filteredPresets.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border">
                {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''} found
              </div>
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.slug)}
                  className="w-full p-3 hover:bg-muted rounded-lg transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      // Prioritize thumbnailImage, then beforeImage, then fallback
                      const imageUrl = preset.thumbnailImage || preset.beforeImage || '';
                      return imageUrl && imageUrl.trim() !== '' ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={imageUrl}
                            alt={preset.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={() => console.warn(`Failed to load image for preset: ${preset.title}`)}
                          />
                        </div>
                      ) : null;
                    })()}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-card-foreground text-sm truncate">
                        {preset.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {preset.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {preset.credits} credits
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No presets found</p>
              <p className="text-xs mt-1 opacity-70">Try different keywords</p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {showResults && (
        <div 
          className="fixed inset-0 z-[55]" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}