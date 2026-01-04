import { Suspense } from "react"
import WelcomeHeroSection from "@/components/dashboard/home/WelcomeHeroSection"
import MasonryLayout from "@/components/dashboard/home/MasonryLayout"
import TrendingPresetsSection from "@/components/dashboard/home/TrendingPresetsSection"
import MadeWithPixelGlowSection from "@/components/dashboard/home/MadeWithPixelGlowSection"
import SuccessMessage from "@/components/dashboard/home/SuccessMessage"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-10 min-h-full">
      <Suspense fallback={null}>
        <SuccessMessage />
      </Suspense>
      <WelcomeHeroSection />
      <MasonryLayout />
      <TrendingPresetsSection />
      <MadeWithPixelGlowSection />
    </div>
  )
}
