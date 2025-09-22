import TransformationCard from "@/components/TransformationCard"
import Link from "next/link"

export default function MadeWithPixelGlowSection() {
  return (
    <div className="mb-6 mt-12 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">✨ Made with PixelGlow</h2>
          <p className="text-sm text-gray-400 mt-1">Real transformations from our community.</p>
        </div>
        <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/studio/portrait-filter" className="block">
          <TransformationCard
            beforeImage="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&saturation=-50&brightness=80"
            afterImage="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop"
            userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
            userName="Chris Orwig"
            category="Light"
            skillLevel="Beginner"
            duration="2 minutes"
            title="Creating a Bright and Beautiful Portrait"
            viewCount="304.8K"
            completionRate="94%"
          />
        </Link>
        
        <Link href="/studio/landscape-filter" className="block">
          <TransformationCard
            beforeImage="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&saturation=-50&brightness=80"
            afterImage="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop"
            userAvatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
            userName="Randy Jay Braun"
            category="Color"
            skillLevel="Intermediate"
            duration="12 minutes"
            title="Commercial Interior Architectural Processing"
            viewCount="365.2K"
            completionRate="87%"
          />
        </Link>
        
        <Link href="/studio/vintage-filter" className="block">
          <TransformationCard
            beforeImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&saturation=-50&brightness=80"
            afterImage="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"
            userAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
            userName="Mike Kelley"
            category="Light"
            skillLevel="Advanced"
            duration="8 minutes"
            title="Vintage Film Look Processing"
            viewCount="156.8K"
            completionRate="92%"
          />
        </Link>
        
        <Link href="/studio/portrait-filter" className="block">
          <TransformationCard
            beforeImage="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&saturation=-50&brightness=80"
            afterImage="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop"
            userAvatar="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face"
            userName="Sarah Williams"
            category="Portrait"
            skillLevel="Beginner"
            duration="5 minutes"
            title="Portrait Enhancement Basics"
            viewCount="203.1K"
            completionRate="89%"
          />
        </Link>
        
        <Link href="/studio/christmas-filter" className="block">
          <TransformationCard
            beforeImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&saturation=-50&brightness=80"
            afterImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
            userAvatar="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face"
            userName="David Johnson"
            category="Street"
            skillLevel="Intermediate"
            duration="6 minutes"
            title="Urban Street Photography"
            viewCount="78.4K"
            completionRate="96%"
          />
        </Link>
        
        <Link href="/studio/landscape-filter" className="block">
          <TransformationCard
            beforeImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&saturation=-50&brightness=80"
            afterImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            userAvatar="https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=32&h=32&fit=crop&crop=face"
            userName="Lisa Martinez"
            category="Nature"
            skillLevel="Beginner"
            duration="4 minutes"
            title="Bright Summer Landscapes"
            viewCount="145.7K"
            completionRate="88%"
          />
        </Link>
      </div>
    </div>
  )
}