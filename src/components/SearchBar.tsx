'use client'

import { PresetSearch } from './PresetSearch'

export function SearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Or search for a specific style
        </p>
      </div>
      <PresetSearch />
    </div>
  )
}