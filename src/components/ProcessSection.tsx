import { Upload, Wand2, Download } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Photo",
      description: "Simply drag & drop or click to upload any photo. Support for JPG, PNG, and WebP formats up to 10MB.",
      visual: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      benefit: "No signup required - start immediately"
    },
    {
      icon: Wand2,
      title: "Choose AI Style",
      description: "Pick from 50+ professional presets: Ghibli, Professional Headshots, Anime, 3D, and more artistic styles.",
      visual: "https://ext.same-assets.com/3379581085/1723444328.webp",
      benefit: "One-click transformation - no complex prompts"
    },
    {
      icon: Download,
      title: "Download & Use",
      description: "Get high-resolution results in minutes. Full commercial rights included - use anywhere without restrictions.",
      visual: "https://ext.same-assets.com/3379581085/35270883.webp",
      benefit: "4K quality output - ready for print or digital"
    }
  ]

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Transform Photos in 3 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground">
            From upload to download in under 5 minutes
          </p>
        </div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24 bg-muted/20 p-12 rounded-3xl`}>
              {/* Visual Proof */}
              <div className="flex-1 flex justify-center">
                <div className="relative max-w-lg w-full">
                  <img
                    src={step.visual}
                    alt={step.title}
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Functional Benefit */}
              <div className="flex-1 space-y-8 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xl text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                <div className="bg-muted/50 p-6 rounded-2xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-foreground">{step.benefit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section ending with CTA */}
        <div className="text-center mt-20 pt-16 border-t border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Photos?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've already discovered the power of AI photo transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Start Creating Now
            </button>
            <button className="px-8 py-3 border border-border text-foreground rounded-full font-semibold hover:bg-muted transition-colors">
              View Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}