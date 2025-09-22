'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface Preset {
  id: string
  title: string
  description: string
  slug: string
  badge: string
  badgeColor: string
  credits: number
  category: string
  beforeImage: string
  afterImage: string
  // prompt is intentionally excluded - it's private IP
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface PresetContextType {
  presets: Preset[]
  loading: boolean
  error: string | null
  searchPresets: (query: string) => Preset[]
  getPresetBySlug: (slug: string) => Preset | null
  getPresetsByCategory: (category: string) => Preset[]
  getPopularPresets: (limit?: number) => Preset[]
  refreshPresets: () => Promise<void>
}

const PresetContext = createContext<PresetContextType | undefined>(undefined)

export function PresetProvider({ children }: { children: React.ReactNode }) {
  const [presets, setPresets] = useState<Preset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPresets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/presets/all')
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch presets')
      }
      
      setPresets(data.presets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch presets')
      console.error('Failed to fetch presets:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchPresets = (query: string): Preset[] => {
    if (!query.trim()) return presets
    
    const searchTerm = query.toLowerCase().trim()
    return presets.filter(preset => 
      preset.title.toLowerCase().includes(searchTerm) ||
      preset.description.toLowerCase().includes(searchTerm) ||
      preset.badge.toLowerCase().includes(searchTerm) ||
      preset.category.toLowerCase().includes(searchTerm)
    )
  }

  const getPresetBySlug = (slug: string): Preset | null => {
    return presets.find(preset => preset.slug === slug) || null
  }

  const getPresetsByCategory = (category: string): Preset[] => {
    return presets.filter(preset => 
      preset.category.toLowerCase() === category.toLowerCase()
    )
  }

  const getPopularPresets = (limit = 6): Preset[] => {
    // For now, return first N presets. Later you can add popularity scoring
    return presets.slice(0, limit)
  }

  const refreshPresets = async () => {
    await fetchPresets()
  }

  useEffect(() => {
    fetchPresets()
  }, [])

  const value: PresetContextType = {
    presets,
    loading,
    error,
    searchPresets,
    getPresetBySlug,
    getPresetsByCategory,
    getPopularPresets,
    refreshPresets
  }

  return (
    <PresetContext.Provider value={value}>
      {children}
    </PresetContext.Provider>
  )
}

export function usePresets() {
  const context = useContext(PresetContext)
  if (context === undefined) {
    throw new Error('usePresets must be used within a PresetProvider')
  }
  return context
}