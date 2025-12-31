'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star, Coins, Sparkles, Gauge, Droplet, Layers, Briefcase, Mail, Headphones, Zap, Code, Lock, DollarSign, RefreshCw, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function PricingPlans() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  // Fetch user's current tier
  useEffect(() => {
    if (user) {
      fetch('/api/user/tier')
        .then(res => res.json())
        .then(data => setCurrentTier(data.tier))
        .catch(err => console.error('Failed to fetch tier:', err));
    }
  }, [user]);

  // Define tier hierarchy
  const TIER_HIERARCHY: Record<string, number> = {
    FREE: 0,
    PRO: 1,
    CREATOR: 2,
  };

  // Check if a plan is lower than current tier (should be disabled)
  const isPlanLowerTier = (planName: string) => {
    if (!currentTier) return false;
    return TIER_HIERARCHY[planName.toUpperCase()] < TIER_HIERARCHY[currentTier.toUpperCase()];
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      variantId: null,
      description: 'Perfect for getting started',
      features: [
        { icon: Coins, text: '20 credits per month' },
        { icon: Sparkles, text: 'Premium AI model quality' },
        { icon: Gauge, text: 'Standard processing speed' },
        { icon: Droplet, text: 'Limited watermark' },
        { icon: Layers, text: '1 concurrent job' }
      ],
      popular: false,
      mostValue: false
    },
    {
      name: 'Pro',
      price: 4.99,
      variantId: 'pro',
      description: 'For creators & influencers',
      features: [
        { icon: Coins, text: '100 credits per month' },
        { icon: Sparkles, text: 'Premium AI model quality' },
        { icon: Droplet, text: 'No watermark' },
        { icon: Zap, text: 'Faster processing' },
        { icon: Layers, text: '3 concurrent jobs' },
        { icon: Briefcase, text: 'Commercial usage rights' },
        { icon: Mail, text: 'Email support' }
      ],
      popular: true,
      mostValue: false
    },
    {
      name: 'Creator',
      price: 14.99,
      variantId: 'creator',
      description: 'For professional creators',
      features: [
        { icon: Coins, text: '400 credits per month' },
        { icon: Sparkles, text: 'Premium AI model quality' },
        { icon: Star, text: 'Early access to new presets' },
        { icon: Zap, text: 'Priority processing' },
        { icon: Layers, text: 'Unlimited concurrent jobs' },
        { icon: Headphones, text: 'Priority customer support' },
        { icon: Code, text: 'API access (coming soon)' }
      ],
      popular: false,
      mostValue: true
    }
  ];

  const handleSubscribe = async (variantId: string | null, planName: string) => {
    if (!isLoaded) return;

    // Free plan - just redirect to dashboard
    if (variantId === null) {
      router.push('/dashboard');
      return;
    }

    // Check if user is signed in
    if (!user) {
      router.push('/sign-in?redirect_url=/plans');
      return;
    }

    try {
      setLoadingPlan(planName);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
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
    } finally {
      setLoadingPlan(null);
    }
  };

  const testimonials = [
    {
      quote: "As a freelancer, this plan gives me everything I need to create stunning AI-generated photos for my clients efficiently.",
      author: "Alex Morgan",
      role: "Freelance Designer",
      initials: "AM"
    },
    {
      quote: "We've grown our content output by 40% since switching to the Pro plan. The generation speed and quality are game-changing.",
      author: "Sarah Chen",
      role: "Marketing Director, GrowthLabs",
      initials: "SC"
    },
    {
      quote: "The creator features have helped us maintain quality while scaling our operations across multiple departments.",
      author: "Michael Johnson",
      role: "CTO, Enterprise Solutions Inc.",
      initials: "MJ"
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, idx) => {
              const testimonial = testimonials[idx];
              return (
                <div key={idx} className="flex flex-col">
                  {/* Pricing Card */}
                  <div className={`bg-gray-900 rounded-2xl border ${plan.popular || plan.mostValue ? 'border-white ring-2 ring-white/20' : 'border-gray-700'} p-8 flex-1 relative`}>
                    {plan.popular && (
                      <div className="absolute -top-3 right-6">
                        <span className="bg-white text-gray-900 px-4 py-1 rounded-full text-xs font-bold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    {plan.mostValue && (
                      <div className="absolute -top-3 right-6">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                          Most Value
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline mb-2">
                        <span className="text-5xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </div>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.variantId, plan.name)}
                      disabled={
                        loadingPlan === plan.name ||
                        currentTier?.toUpperCase() === plan.name.toUpperCase() ||
                        isPlanLowerTier(plan.name)
                      }
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 flex items-center justify-center gap-2 ${
                        currentTier?.toUpperCase() === plan.name.toUpperCase()
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : isPlanLowerTier(plan.name)
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                            : plan.popular
                              ? 'bg-white text-gray-900 hover:bg-gray-100'
                              : plan.mostValue
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      {loadingPlan === plan.name
                        ? 'Loading...'
                        : currentTier?.toUpperCase() === plan.name.toUpperCase()
                          ? 'Your current plan'
                          : `Get ${plan.name}`
                      }
                      {loadingPlan !== plan.name && currentTier?.toUpperCase() !== plan.name.toUpperCase() && !isPlanLowerTier(plan.name) && <ArrowUpRight className="w-5 h-5" />}
                    </button>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIdx) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <li key={featureIdx} className="flex items-start gap-3">
                            <FeatureIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <span className="text-white text-sm">{feature.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Testimonial Card */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mt-6">
                    <p className="text-gray-300 italic text-sm mb-4">"{testimonial.quote}"</p>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                        <div className="text-gray-400 text-xs">{testimonial.role}</div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <RefreshCw className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
