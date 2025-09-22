'use client'

import { PresetSearch } from '@/components/PresetSearch'
import { Ghost, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background py-24 relative">
      {/* Home Button - Top Right */}
      <div className="absolute top-8 right-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-all duration-300 group shadow-sm hover:shadow-md"
        >
          <Home className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          <span className="text-sm font-medium text-card-foreground group-hover:text-foreground"> Home</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <Ghost className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 leading-tight">
            404 – Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
            We couldn’t find what you were looking for. But you can explore 40+ stunning presets below!
          </p>

          <div className="mt-10">
            <PresetSearch />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Professional', emoji: '💼', count: 12 },
              { name: 'Anime', emoji: '🎌', count: 8 },
              { name: 'Fashion', emoji: '👗', count: 6 },
              { name: 'Art', emoji: '🎨', count: 14 }
            ].map((category) => (
              <div
                key={category.name}
                className="p-4 bg-card border border-border rounded-2xl hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <h3 className="font-semibold text-card-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} presets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
