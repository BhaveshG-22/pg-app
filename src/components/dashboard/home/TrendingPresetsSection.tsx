import Link from "next/link"

export default function TrendingPresetsSection() {
  return (
    <div className="mb-6 mt-12 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">🔥 Trending Presets</h2>
          <p className="text-sm text-gray-400 mt-1">Most popular presets used by our community this week.</p>
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {/* Preset Card 1 */}
        <div className="snap-start w-48 shrink-0 bg-[#2f2f2f] rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop" 
              alt="Cinematic Preset" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              🔥 Hot
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Cinematic Glow</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>❤️ 2.4K</span>
              <span>🔁 1.2K uses</span>
            </div>
            <Link href="/studio/christmas-filter" className="block w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-lg transition-colors">
                Use Preset
              </button>
            </Link>
          </div>
        </div>

        {/* Preset Card 2 */}
        <div className="snap-start w-48 shrink-0 bg-[#2f2f2f] rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop" 
              alt="Vintage Preset" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              ✨ New
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Vintage Film</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>❤️ 1.8K</span>
              <span>🔁 980 uses</span>
            </div>
            <Link href="/studio/vintage-filter" className="block w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-lg transition-colors">
                Use Preset
              </button>
            </Link>
          </div>
        </div>

        {/* Preset Card 3 */}
        <div className="snap-start w-48 shrink-0 bg-[#2f2f2f] rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" 
              alt="Portrait Preset" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              📈 Rising
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Portrait Pro</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>❤️ 3.1K</span>
              <span>🔁 1.5K uses</span>
            </div>
            <Link href="/studio/portrait-filter" className="block w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-lg transition-colors">
                Use Preset
              </button>
            </Link>
          </div>
        </div>

        {/* Preset Card 4 */}
        <div className="snap-start w-48 shrink-0 bg-[#2f2f2f] rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop" 
              alt="Moody Preset" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              🌙 Dark
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Moody Dark</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>❤️ 1.6K</span>
              <span>🔁 890 uses</span>
            </div>
            <Link href="/studio/portrait-filter" className="block w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-lg transition-colors">
                Use Preset
              </button>
            </Link>
          </div>
        </div>

        {/* Preset Card 5 */}
        <div className="snap-start w-48 shrink-0 bg-[#2f2f2f] rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop" 
              alt="Bright Preset" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              ☀️ Bright
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Bright Summer</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>❤️ 2.2K</span>
              <span>🔁 1.1K uses</span>
            </div>
            <Link href="/studio/landscape-filter" className="block w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-lg transition-colors">
                Use Preset
              </button>
            </Link>
          </div>
        </div>

        {/* Preset Card 6 */}
        <div className="snap-start w-48 shrink-0 bg-[#2f2f2f] rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop" 
              alt="Nature Preset" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              🌿 Nature
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white text-sm font-medium mb-2">Nature Boost</h3>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span>❤️ 1.9K</span>
              <span>🔁 950 uses</span>
            </div>
            <Link href="/studio/landscape-filter" className="block w-full">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-lg transition-colors">
                Use Preset
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}