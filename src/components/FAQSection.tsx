import { HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQ_DATA = [
  {
    question: "How does PixelGlow AI work?",
    answer: "PixelGlow uses advanced machine learning algorithms to analyze your photos and transform them into various artistic styles. Simply upload your photo, choose a style, and our AI does the rest in minutes."
  },
  {
    question: "What photo formats are supported?",
    answer: "We support JPG, PNG, and WebP formats. For best results, use high-resolution photos with clear facial features and good lighting."
  },
  {
    question: "How long does it take to generate photos?",
    answer: "Most transformations complete within 2-5 minutes. Complex styles like 3D avatars may take up to 10 minutes for optimal quality."
  },
  {
    question: "Can I use the generated images commercially?",
    answer: "Yes! All generated images are yours to use for personal and commercial purposes. We don't retain any rights to your transformed photos."
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "We offer a 30-day money-back guarantee. If you're not happy with your results, contact our support team for a full refund."
  }
]

export function FAQSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about PixelGlow AI
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-foreground hover:text-foreground hover:no-underline text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  {faq.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 pl-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}