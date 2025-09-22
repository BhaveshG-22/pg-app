import { Card, CardContent } from "@/components/ui/card"

export function ApplicationsSection() {
  const applications = [
    {
      title: "Design Collectible AI Action Figures",
      description: "Create premium, customizable figures in collectible packaging with the AI action figure generator, perfect for fans, creators, or merchandise.",
      image: "https://ext.same-assets.com/3379581085/422241117.webp"
    },
    {
      title: "Craft Adorable Chibi Style Emojis",
      description: "Create charming chibi style Q-version emojis with the 4o image generator, great for personalized stickers, lively avatars, or playful designs.",
      image: "https://ext.same-assets.com/3379581085/2124898767.webp"
    },
    {
      title: "Design Multi-Style Posters",
      description: "Craft eye-catching posters in diverse styles like ghibli style or Pixar style using the 4o image generator, ideal for events, decor, or marketing.",
      image: "https://ext.same-assets.com/3379581085/636013932.webp"
    },
    {
      title: "Create Printable Coloring Pages",
      description: "Transform images into black-and-white outlines with the 4o image generator, perfect for educational activities, art therapy, or creative hobbies.",
      image: "https://ext.same-assets.com/3379581085/1974024019.webp"
    },
    {
      title: "Produce Creative Social Media Art",
      description: "Elevate your social media with doodle-inspired visuals crafted by the 4o image generator, infused with quirky charm and artistic flair for standout posts.",
      image: "https://ext.same-assets.com/3379581085/1172290268.webp"
    },
    {
      title: "Try On Virtual Outfits",
      description: "Swap clothes virtually with the 4o image generator, trying on various styles from casual to couture without leaving home—perfect for pre-purchase decisions.",
      image: "https://ext.same-assets.com/3379581085/747444797.webp"
    }
  ]

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Endless Creative Applications with 4o Image Generator
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <Card key={index} className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="mb-4">
                  <img
                    src={app.image}
                    alt={app.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {app.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {app.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}