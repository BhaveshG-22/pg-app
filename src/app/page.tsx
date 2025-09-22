import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSectionNew"
import { KeyFeaturesSection } from "@/components/KeyFeaturesSection"
import { StyleShowcaseSection } from "@/components/StyleShowcaseSection"
import { ProcessSection } from "@/components/ProcessSection"
import { ApplicationsSection } from "@/components/ApplicationsSection"
import { FAQSection } from "@/components/FAQSection"
import { CTASection } from "@/components/CTASection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <KeyFeaturesSection />
      {/* <StyleShowcaseSection /> */}
      <ApplicationsSection />
      <ProcessSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}