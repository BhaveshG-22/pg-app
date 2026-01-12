'use client';

import { useState } from 'react';
import { ArrowUpRight, Coins, Sparkles, Droplet, Layers, Briefcase, Mail, Headphones, Zap, Code, Star, Gauge } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Coins,
  Sparkles,
  Droplet,
  Layers,
  Briefcase,
  Mail,
  Headphones,
  Zap,
  Code,
  Star,
  Gauge,
};

type Plan = {
  name: string;
  price: string;
  interval: string;
  description: string;
  priceId: string | null;
  productId: string;
  features: Array<{ icon: string; text: string }>;
  badge: string | null;
  buttonStyle: string;
};

type PricingClientProps = {
  plans: Plan[];
  currentTier: string | null;
  hasActiveSubscription: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
};

export default function PricingClient({
  plans,
  currentTier,
  hasActiveSubscription,
  isAuthenticated,
  userId,
  userEmail,
}: PricingClientProps) {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Define tier hierarchy
  const TIER_HIERARCHY: Record<string, number> = {
    FREE: 0,
    PRO: 1,
    CREATOR: 2,
  };

  const handleSubscribe = async (priceId: string | null, productId: string, planName: string) => {
    // Free plan - just redirect to dashboard
    if (!priceId) {
      router.push('/dashboard');
      return;
    }

    // Check if user is signed in
    if (!isAuthenticated || !userId || !userEmail) {
      router.push('/sign-in?redirect_url=/pricing');
      return;
    }

    // Disable button if already upgrading
    if (isUpgrading) return;

    try {
      setIsUpgrading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          productId,
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      // Handle upgrade response (no redirect, just success message)
      if (data.upgraded) {
        alert(`Successfully upgraded to ${planName} plan!`);
        // Refresh the page to update UI
        window.location.reload();
      } else if (data.checkoutUrl) {
        // New subscription - redirect to checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to process subscription');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process subscription. Please try again.');
      setIsUpgrading(false);
    }
  };

  const isCurrentPlan = (planName: string) => {
    return currentTier?.toUpperCase() === planName.toUpperCase();
  };

  const isLowerTier = (planName: string) => {
    if (!currentTier) return false;
    return TIER_HIERARCHY[planName.toUpperCase()] < TIER_HIERARCHY[currentTier.toUpperCase()];
  };

  const isHigherTier = (planName: string) => {
    if (!currentTier) return false;
    return TIER_HIERARCHY[planName.toUpperCase()] > TIER_HIERARCHY[currentTier.toUpperCase()];
  };

  return (
    <div className="min-h-screen bg-content-bg pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pricing
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your AI image generation needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-gray-900 rounded-2xl border ${
                plan.badge ? 'border-white ring-2 ring-white/20' : 'border-gray-700'
              } p-8 relative`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 right-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                    plan.badge === 'Most Popular'
                      ? 'bg-white text-gray-900'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.interval}</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.priceId, plan.productId, plan.name)}
                disabled={isCurrentPlan(plan.name) || isLowerTier(plan.name) || isUpgrading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 flex items-center justify-center gap-2 ${
                  isCurrentPlan(plan.name)
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : isLowerTier(plan.name)
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                      : isUpgrading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
                        : plan.buttonStyle === 'primary'
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : plan.buttonStyle === 'gradient'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCurrentPlan(plan.name)
                  ? 'Your current plan'
                  : isUpgrading
                    ? 'Processing...'
                    : hasActiveSubscription && isHigherTier(plan.name)
                      ? `Upgrade to ${plan.name}`
                      : `Get ${plan.name}`
                }
                {!isCurrentPlan(plan.name) && !isLowerTier(plan.name) && !isUpgrading && plan.priceId && <ArrowUpRight className="w-5 h-5" />}
              </button>

              {/* Features */}
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => {
                  const FeatureIcon = iconMap[feature.icon];
                  return (
                    <li key={idx} className="flex items-center gap-3">
                      <FeatureIcon className="w-5 h-5 text-gray-300 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-white text-sm leading-relaxed">{feature.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            Have any questions?{' '}
            <a
              href="mailto:pixelglow.app@gmail.com"
              className="text-white hover:text-gray-200 underline transition-colors"
            >
              Contact us at pixelglow.app@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
