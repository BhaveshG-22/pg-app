import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/layout/Footer'

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 4, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">1. Introduction</h2>
              <p>
                PixelGlow ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-4">2.1 Personal Information</h3>
              <p>
                We may collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-4">2.2 Usage Information</h3>
              <p>
                We automatically collect certain information about your device and how you interact with our Service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Images and content you create using our Service</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                <li>Personalize and improve your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">4. Information Sharing and Disclosure</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment processing, data analysis, email delivery)</li>
                <li><strong>Legal Requirements:</strong> If required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                <li><strong>With Your Consent:</strong> With your explicit permission for any other purpose</li>
              </ul>
              <p className="mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">7. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@pixelglow.app" className="text-primary hover:text-primary/80">privacy@pixelglow.app</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect and track information about your use of our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of the Service may not function properly without cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">9. Third-Party Services</h2>
              <p>
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">10. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">11. International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on computers located outside of your jurisdiction where privacy laws may differ. By using our Service, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@pixelglow.app" className="text-primary hover:text-primary/80">privacy@pixelglow.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
