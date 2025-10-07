import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSectionNew"
import { KeyFeaturesSection } from "@/components/KeyFeaturesSection"
import { StyleShowcaseSection } from "@/components/StyleShowcaseSection"
import { ProcessSection } from "@/components/ProcessSection"
import { ApplicationsSection } from "@/components/ApplicationsSection"
import { FAQSection } from "@/components/FAQSection"
import { CTASection } from "@/components/CTASection"
import { Footer } from "@/components/Footer"
import { CustomGoogleOneTap } from "@/components/auth/CustomGoogleOneTap"
import { auth } from "@clerk/nextjs/server"

export default async function Home() {
  const { userId } = await auth()

  return (
    <CustomGoogleOneTap>
      <main className="min-h-screen bg-background">
        <Header isAuthenticated={!!userId} />
        <HeroSection isAuthenticated={!!userId} />
        <KeyFeaturesSection />
        {/* <StyleShowcaseSection /> */}
        <ApplicationsSection />
        <ProcessSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </CustomGoogleOneTap>
  )
}