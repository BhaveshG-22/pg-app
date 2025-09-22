import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CTADialog } from "./CTADialog"

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6">
          Ready to transform your photos?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join over 50,000 creators who trust PixelGlow for their AI photo needs
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 h-16 text-xl font-semibold"
            >
              Create Your AI Photos Now
            </Button>
          </Link>

          <CTADialog />
        </div>

        <div className="mt-4 text-muted-foreground text-sm">
          No credit card required • Get started in 2 minutes
        </div>
      </div>
    </section>
  )
}