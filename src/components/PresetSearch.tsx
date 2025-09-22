'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePresets } from '@/contexts/PresetContext'

export function PresetSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
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
  }

  const handlePresetClick = (slug: string) => {
    // Navigate to studio page
    router.push(`/studio/${slug}`)
    clearSearch()
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search AI presets..."
          className="w-full pl-10 pr-10 py-3 border border-border bg-background text-foreground placeholder-muted-foreground rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-lg max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ) : filteredPresets.length > 0 ? (
            <div className="p-2">
              {filteredPresets.slice(0, 8).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.slug)}
                  className="w-full p-3 hover:bg-muted rounded-xl transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={preset.beforeImage}
                        alt={preset.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground truncate">
                        {preset.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {preset.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
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
              {filteredPresets.length > 8 && (
                <div className="p-3 text-center text-sm text-muted-foreground border-t border-border mt-2">
                  {filteredPresets.length - 8} more results available
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No presets found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try different keywords or browse all presets</p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}