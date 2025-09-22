export function KeyFeaturesSection() {
  const features = [
    {
      title: "Broad Artistic Styles with Ghibli Style",
      description: "4o image generator offers a rich variety of styles, including Chibi style, Pixar style, 3D style, and more. From whimsical character designs to cinematic scenes, exploring a world of artistic expression.",
      image: "https://ext.same-assets.com/3379581085/1723444328.webp",
      indicator: "Before/After"
    },
    {
      title: "Text to Image and Image to Image",
      description: "Turn text prompts into vivid images or refine existing images with chatgpt 4o image generation. Input your concept, and FluxAI.art delivers striking artwork in minutes.",
      image: "https://ext.same-assets.com/3379581085/35270883.webp",
      indicator: "3D Q version mini style"
    },
    {
      title: "Customizable Text for Seamless Designs",
      description: "Embed stylized, readable text into your artwork using the 4o image generator. Whether for branding, comic speech bubbles, or posters, text integrates flawlessly with your style.",
      image: "https://ext.same-assets.com/3379581085/766337669.webp",
      indicator: "Comic Style"
    },
    {
      title: "Precision Editing & Photo Blending",
      description: "Refine specific image elements, blend multiple photos, or reimagine backgrounds with the 4o image generator, creating polished, professional-grade compositions.",
      image: "https://ext.same-assets.com/3379581085/3879591529.webp",
      indicator: "Photo Editing"
    }
  ]

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Key Features of the 4o Image Generator
          </h2>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
              <div className="flex-1 flex justify-center">
                <div className="relative max-w-lg w-full">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                  {feature.indicator && (
                    <div className="absolute top-6 left-6 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-card-foreground shadow-lg border border-border">
                      {feature.indicator}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-6 max-w-xl">
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}