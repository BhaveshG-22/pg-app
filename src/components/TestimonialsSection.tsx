'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "PixelGlow transformed my content game! I went from spending hours on photo shoots to getting perfect shots in minutes. My engagement increased 300%.",
      beforeImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face",
      afterImage: "https://ext.same-assets.com/3379581085/1723444328.webp"
    },
    {
      name: "Marcus Rodriguez",
      role: "Small Business Owner", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "As a restaurant owner, I needed professional food photos but couldn't afford a photographer. PixelGlow's food styling preset saved me thousands!",
      beforeImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      afterImage: "https://ext.same-assets.com/3379581085/35270883.webp"
    },
    {
      name: "Emma Thompson",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", 
      rating: 5,
      text: "Our team's productivity skyrocketed. What used to take our design team days now takes minutes. ROI was immediate and our campaigns look incredible.",
      beforeImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      afterImage: "https://ext.same-assets.com/3379581085/766337669.webp"
    }
  ]

  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Real Results from Real Users
          </h2>
          <p className="text-xl text-muted-foreground">
            See how PixelGlow transforms businesses and workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                {/* Before/After Images */}
                <div className="mb-6 flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <img
                        src={testimonial.beforeImage}
                        alt="Before"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2 bg-card/90 px-2 py-1 rounded text-xs font-medium text-card-foreground">
                        Before
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <img
                        src={testimonial.afterImage}
                        alt="After"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-primary/90 px-2 py-1 rounded text-xs font-medium text-primary-foreground">
                        After
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}