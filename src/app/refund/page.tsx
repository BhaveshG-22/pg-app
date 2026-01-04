import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Footer from '@/components/layout/Footer'

export default function RefundPolicy() {
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
            Refund Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 4, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">1. General Policy</h2>
              <p>
                At PixelGlow, we strive to provide the best AI image generation service possible. This Refund Policy outlines the circumstances under which refunds may be issued for credit purchases and subscriptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">2. Credit Purchases</h2>

              <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-4">2.1 Standard Refund Window</h3>
              <p>
                You may request a refund for credit purchases within 7 days of purchase if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have used less than 10% of the purchased credits</li>
                <li>You experienced technical issues that prevented you from using the Service</li>
                <li>The purchase was made in error</li>
              </ul>

              <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-4">2.2 Non-Refundable Situations</h3>
              <p>
                Refunds will not be issued for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credits that have been fully or substantially used (more than 10%)</li>
                <li>Purchases made more than 7 days ago</li>
                <li>Credits used to generate content, even if you're unsatisfied with the results</li>
                <li>Change of mind after successful use of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">3. Subscription Plans</h2>

              <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-4">3.1 Monthly Subscriptions</h3>
              <p>
                Monthly subscription refunds may be issued under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request made within 7 days of the initial subscription purchase</li>
                <li>Less than 10% of the subscription credits have been used</li>
                <li>Technical issues prevented access to the Service</li>
              </ul>
              <p className="mt-4">
                Please note: Recurring monthly charges are billed at the start of each billing cycle. Cancellations will prevent future charges but will not refund the current billing period unless the conditions above are met.
              </p>

              <h3 className="text-xl font-semibold text-card-foreground mb-3 mt-4">3.2 Annual Subscriptions</h3>
              <p>
                Annual subscriptions may be eligible for a prorated refund if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request made within 30 days of purchase</li>
                <li>Less than 25% of the annual credits have been used</li>
                <li>A prorated amount will be calculated based on the remaining months</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">4. Service Issues and Downtime</h2>
              <p>
                If you experience service disruptions or technical issues that prevent you from using your credits:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will extend your credit validity period to compensate for downtime</li>
                <li>In cases of extended outages (more than 24 hours), credit refunds may be issued</li>
                <li>We will provide advance notice of scheduled maintenance when possible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">5. How to Request a Refund</h2>
              <p>
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Contact Support:</strong> Email us at <a href="mailto:support@pixelglow.app" className="text-primary hover:text-primary/80">support@pixelglow.app</a> with "Refund Request" in the subject line
                </li>
                <li>
                  <strong>Provide Information:</strong> Include your account email, order ID, purchase date, and reason for the refund request
                </li>
                <li>
                  <strong>Wait for Review:</strong> We will review your request within 2-3 business days
                </li>
                <li>
                  <strong>Receive Decision:</strong> You will receive an email with our decision and, if approved, the refund timeline
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">6. Refund Processing</h2>
              <p>
                Once your refund is approved:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds will be processed within 5-7 business days</li>
                <li>The refund will be issued to the original payment method</li>
                <li>Depending on your financial institution, it may take an additional 3-5 business days for the refund to appear in your account</li>
                <li>Any remaining credits associated with the refunded purchase will be removed from your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">7. Cancellations</h2>
              <p>
                You may cancel your subscription at any time:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log in to your account and go to Settings</li>
                <li>Navigate to the Subscription section</li>
                <li>Click "Cancel Subscription"</li>
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>You will retain access to your credits until they are used or expire</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">8. Chargebacks</h2>
              <p>
                If you initiate a chargeback or payment dispute with your financial institution instead of contacting us directly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account may be suspended pending resolution</li>
                <li>All credits will be revoked</li>
                <li>If the chargeback is found to be unjustified, your account may be permanently terminated</li>
              </ul>
              <p className="mt-4">
                We strongly encourage you to contact us first to resolve any issues before initiating a chargeback.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">9. Promotional Credits and Bonuses</h2>
              <p>
                Promotional credits, bonus credits, and credits received through referrals or special offers are non-refundable and cannot be exchanged for cash or other benefits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">10. Changes to Refund Policy</h2>
              <p>
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to the website. Your continued use of the Service after changes are posted constitutes acceptance of the modified policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about our Refund Policy, please contact us:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:support@pixelglow.app" className="text-primary hover:text-primary/80">support@pixelglow.app</a>
              </p>
              <p className="mt-2">
                We are committed to ensuring your satisfaction and will work with you to resolve any concerns you may have.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
