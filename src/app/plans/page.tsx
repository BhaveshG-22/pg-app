'use client';

import { useState, useEffect } from 'react';
import { Coins, Sparkles, Droplet, Layers, Briefcase, Mail, Headphones, Zap, Code, Star, ArrowUpRight, Gauge } from 'lucide-react';
import { Header } from '@/components/Header';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function PricingPlans() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  const isSandbox = process.env.NEXT_PUBLIC_POLAR_SERVER === 'sandbox';

  // Fetch user's current tier
  useEffect(() => {
    if (user) {
      fetch('/api/user/tier')
        .then(res => res.json())
        .then(data => setCurrentTier(data.tier))
        .catch(err => console.error('Failed to fetch tier:', err));
    }
  }, [user]);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      interval: 'month',
      description: 'Perfect for getting started',
      priceId: null,
      productId: 'free',
      features: [
        { icon: Coins, text: '5 credits per month' },
        { icon: Sparkles, text: 'Premium AI model quality' },
        { icon: Gauge, text: 'Standard processing speed' },
        { icon: Droplet, text: 'Limited watermark' },
        { icon: Layers, text: '1 concurrent job' }
      ],
      badge: null,
      buttonStyle: 'outline'
    },
    {
      name: 'Pro',
      price: '$4.99',
      interval: 'month',
      description: 'For creators & influencers',
      priceId: (isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRICE_ID_PRO_SANDBOX : process.env.NEXT_PUBLIC_POLAR_PRICE_ID_PRO) || 'pro',
      productId: (isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PRO_SANDBOX : process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_PRO) || 'pro',
      features: [
        { icon: Coins, text: '100 credits per month' },
        { icon: Sparkles, text: 'Premium AI model quality' },
        { icon: Droplet, text: 'No watermark' },
        { icon: Zap, text: 'Faster processing' },
        { icon: Layers, text: '3 concurrent jobs' },
        { icon: Briefcase, text: 'Commercial usage rights' },
        { icon: Mail, text: 'Email support' }
      ],
      badge: 'Most Popular',
      buttonStyle: 'primary'
    },
    {
      name: 'Creator',
      price: '$14.99',
      interval: 'month',
      description: 'For professional creators',
      priceId: (isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRICE_ID_CREATOR_SANDBOX : process.env.NEXT_PUBLIC_POLAR_PRICE_ID_CREATOR) || 'creator',
      productId: (isSandbox ? process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_CREATOR_SANDBOX : process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_CREATOR) || 'creator',
      features: [
        { icon: Coins, text: '400 credits per month' },
        { icon: Sparkles, text: 'Premium AI model quality' },
        { icon: Star, text: 'Early access to new presets' },
        { icon: Zap, text: 'Priority processing' },
        { icon: Layers, text: 'Unlimited concurrent jobs' },
        { icon: Headphones, text: 'Priority customer support' },
        { icon: Code, text: 'API access (coming soon)' }
      ],
      badge: 'Most Value',
      buttonStyle: 'gradient'
    }
  ];

  // Define tier hierarchy
  const TIER_HIERARCHY: Record<string, number> = {
    FREE: 0,
    PRO: 1,
    CREATOR: 2,
  };

  const handleSubscribe = async (priceId: string | null, productId: string) => {
    if (!isLoaded) return;

    // Free plan - just redirect to dashboard
    if (!priceId) {
      router.push('/dashboard');
      return;
    }

    // Check if user is signed in
    if (!user) {
      router.push('/sign-in?redirect_url=/plans');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          productId,
          userId: user.id,
          userEmail: user.emailAddresses[0]?.emailAddress,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  const isCurrentPlan = (planName: string) => {
    return currentTier?.toUpperCase() === planName.toUpperCase();
  };

  const isLowerTier = (planName: string) => {
    if (!currentTier) return false;
    return TIER_HIERARCHY[planName.toUpperCase()] < TIER_HIERARCHY[currentTier.toUpperCase()];
  };

  return (
    <>
      <Header isAuthenticated={isLoaded && !!user} />
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
                  onClick={() => handleSubscribe(plan.priceId, plan.productId)}
                  disabled={isCurrentPlan(plan.name) || isLowerTier(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 flex items-center justify-center gap-2 ${
                    isCurrentPlan(plan.name)
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : isLowerTier(plan.name)
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                        : plan.buttonStyle === 'primary'
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : plan.buttonStyle === 'gradient'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isCurrentPlan(plan.name)
                    ? 'Your current plan'
                    : `Get ${plan.name}`
                  }
                  {!isCurrentPlan(plan.name) && !isLowerTier(plan.name) && plan.priceId && <ArrowUpRight className="w-5 h-5" />}
                </button>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
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
        </div>
      </div>
    </>
  );
}
