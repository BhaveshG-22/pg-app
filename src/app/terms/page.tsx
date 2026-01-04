import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/layout/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-content-bg flex flex-col">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-card-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 4, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using PixelGlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">2. Description of Service</h2>
              <p>
                PixelGlow provides AI-powered image generation services. The Service allows users to create, edit, and manage AI-generated images using various presets and tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must register for an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">4. Credits and Payment</h2>
              <p>
                The Service operates on a credit-based system. Users purchase credits to generate images. All sales are final unless otherwise stated in our Refund Policy.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credits are non-transferable between accounts</li>
                <li>Unused credits do not expire unless your account is terminated</li>
                <li>Prices are subject to change with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">5. Acceptable Use</h2>
              <p>
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generate content that is illegal, harmful, or violates the rights of others</li>
                <li>Create content that is defamatory, obscene, or pornographic</li>
                <li>Impersonate any person or entity</li>
                <li>Distribute malware or engage in any harmful technical activities</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">6. Intellectual Property</h2>
              <p>
                You retain ownership of content you create using the Service. However, you grant PixelGlow a license to use, display, and distribute your creations for promotional purposes unless you opt out.
              </p>
              <p className="mt-4">
                The Service itself, including all software, designs, and trademarks, remains the property of PixelGlow.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service or for any other reason at our discretion. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">8. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, PixelGlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:support@pixelglow.app" className="text-primary hover:text-primary/80">support@pixelglow.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
