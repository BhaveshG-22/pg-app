'use client'

import { CreditCard, Mail, MessageCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useDbUser } from '@/hooks/useDbUser'

export default function PricingPage() {
  const { user: clerkUser } = useUser()
  const { user: dbUser } = useDbUser()

  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || dbUser?.email || 'your-email@example.com'

  return (
    <div className="flex-1 bg-content-bg">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get more credits to create amazing AI-generated images with PixelGlow
          </p>
        </div>

        {/* Payment Not Setup Notice */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-[#3a3a3a] p-8 text-center shadow-2xl mb-8">
          <div className="bg-amber-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-8 w-8 text-amber-400" />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-4">
            Payment System Coming Soon
          </h2>

          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            We're currently setting up our payment infrastructure to bring you seamless credit purchases.
            In the meantime, we'd love to help you get more credits!
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 max-w-xl mx-auto">
            <h3 className="text-white font-semibold mb-3 flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              Need More Credits?
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Send us a message and we'll manually add credits to your account. Just tell us:
            </p>
            <ul className="text-gray-300 text-sm text-left space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>How many credits you need</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>What you're planning to create</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Your account email: <code className="bg-[#3a3a3a] px-2 py-1 rounded text-blue-300">{userEmail}</code></span>
              </li>
            </ul>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:support@pixelglow.app?subject=Credit Request&body=Hi! I'd like to request more credits for my PixelGlow account.%0A%0AAccount Email: ${userEmail}%0ACredits Needed: %0AWhat I'm planning to create: %0A%0AThanks!`}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-xl transition-colors font-medium"
            >
              <Mail className="h-5 w-5" />
              Email Us for Credits
            </a>

            <a
              href="https://discord.gg/pixelglow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 py-3 px-6 rounded-xl transition-colors font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              Join Discord
            </a>
          </div>
        </div>

        {/* Planned Pricing Preview */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Coming Soon: Automated Plans
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$9',
                credits: '100 credits',
                features: ['High-quality generations', 'Standard processing', 'Email support']
              },
              {
                name: 'Pro',
                price: '$19',
                credits: '250 credits',
                features: ['Priority processing', 'Higher resolution', 'Discord support'],
                popular: true
              },
              {
                name: 'Creator',
                price: '$39',
                credits: '600 credits',
                features: ['Fastest processing', 'Maximum resolution', 'Direct support']
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-[#1e1e1e] rounded-2xl border p-6 relative ${
                  plan.popular
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : 'border-[#3a3a3a]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                  <div className="text-blue-400 font-medium mb-4">{plan.credits}</div>

                  <ul className="space-y-2 text-sm text-gray-300 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled
                    className="w-full bg-[#3a3a3a] text-gray-500 py-2 px-4 rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Questions? Reach out to us at{' '}
            <a
              href="mailto:support@pixelglow.app"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              support@pixelglow.app
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}