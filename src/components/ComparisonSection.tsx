'use client'

import { Check, X, Clock, DollarSign, Users, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ComparisonSection() {
  const comparisons = [
    {
      category: "Professional Photo Shoot",
      traditional: {
        cost: "$500-2000",
        time: "2-4 weeks",
        hassle: "High",
        quality: "Variable",
        icon: Users,
        cons: ["Expensive photographer fees", "Location booking required", "Weather dependent", "Limited retakes", "Editing delays"]
      },
      twinkle: {
        cost: "$0.99",
        time: "5 minutes", 
        hassle: "None",
        quality: "Consistent",
        icon: Zap,
        pros: ["Instant results", "Unlimited styles", "No scheduling needed", "Perfect every time", "Full commercial rights"]
      },
      beforeImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
      afterImage: "https://ext.same-assets.com/3379581085/1723444328.webp"
    }
  ]

  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Why Choose PixelGlow Over Traditional Methods?
          </h2>
          <p className="text-xl text-muted-foreground">
            See the dramatic difference in cost, time, and results
          </p>
        </div>

        {comparisons.map((comparison, index) => (
          <div key={index} className="mb-16">
            {/* Visual Comparison */}
            <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
              <div className="flex-1 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-6">Traditional Method</h3>
                <div className="relative max-w-sm mx-auto">
                  <img
                    src={comparison.beforeImage}
                    alt="Traditional photo"
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-4 left-4 bg-red-500/90 px-3 py-1 rounded-full text-white text-sm font-medium">
                    ❌ Expensive & Slow
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-4xl text-muted-foreground">
                VS
              </div>

              <div className="flex-1 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-6">PixelGlow AI</h3>
                <div className="relative max-w-sm mx-auto">
                  <img
                    src={comparison.afterImage}
                    alt="PixelGlow result"
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-4 right-4 bg-green-500/90 px-3 py-1 rounded-full text-white text-sm font-medium">
                    ✅ Fast & Affordable
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Method */}
              <Card className="bg-card border-border shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <comparison.traditional.icon className="w-6 h-6 text-red-500" />
                    </div>
                    <h4 className="text-xl font-bold text-card-foreground">{comparison.category}</h4>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-semibold text-red-500">{comparison.traditional.cost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold text-red-500">{comparison.traditional.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Hassle:</span>
                      <span className="font-semibold text-red-500">{comparison.traditional.hassle}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {comparison.traditional.cons.map((con, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{con}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* PixelGlow */}
              <Card className="bg-card border-border shadow-lg ring-2 ring-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <comparison.twinkle.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-card-foreground">PixelGlow AI</h4>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-semibold text-primary">{comparison.twinkle.cost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold text-primary">{comparison.twinkle.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Hassle:</span>
                      <span className="font-semibold text-primary">{comparison.twinkle.hassle}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {comparison.twinkle.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{pro}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}