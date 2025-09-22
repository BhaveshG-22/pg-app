'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePresets, Preset } from '@/contexts/PresetContext'

const staticFooterData = {
  "Pages": [
    "Free AI Photo Generator",
    "Photo Shoot Ideas",
    "Gallery",
    "Sign up or Log in",
    "Plans",
    "FAQ",
    "Billing",
    "Legal",
    "Report Issue"
  ]
}

export function Footer() {
  const { presets, loading } = usePresets()

  const organizePresets = (): Record<string, Preset[]> => {
    if (loading || presets.length === 0) return {}
    
    const categories: Record<string, Preset[]> = {
      "Professional": presets.filter(p => p.category === "Professional"),
      "Creative": presets.filter(p => p.category === "Creative"), 
      "Artistic": presets.filter(p => p.category === "Artistic")
    }
    
    return categories
  }

  const organizedPresets = organizePresets()

  return (
    <footer className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Dynamic Preset Categories */}
          {!loading && Object.entries(organizedPresets).map(([category, categoryPresets]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-foreground font-semibold mb-6">{category}</h3>
              <ul className="space-y-3">
                {categoryPresets.map((preset) => (
                  <li key={preset.id}>
                    <Link 
                      href={`/studio/${preset.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {preset.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Static Pages */}
          {Object.entries(staticFooterData).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-foreground font-semibold mb-6">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={
                        link === "Report Issue" ? "/report-issue" :
                        link === "Plans" ? "/plans" :
                        `/preset/${link.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
                      }
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Loading State */}
          {loading && (
            <div className="lg:col-span-3">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-3 bg-muted rounded w-3/4"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo and Description - Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/pixelGlowLogo.png"
              alt="PixelGlow Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain scale-125"
            />
            <span className="text-xl font-bold text-foreground">PixelGlow</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            PixelGlow™ is a registered trademark. Transform your photos with AI.
          </p>
        </div>

      </div>
    </footer>
  )
}