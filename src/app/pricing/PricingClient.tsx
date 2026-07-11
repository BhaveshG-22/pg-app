'use client';

import { useState } from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CreditPack = {
  key: string;
  name: string;
  credits: number;
  priceLabel: string;
  badge: string | null;
  productId: string;
};

type PricingClientProps = {
  packs: CreditPack[];
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
};

export default function PricingClient({
  packs,
  isAuthenticated,
  userId,
  userEmail,
}: PricingClientProps) {
  const router = useRouter();
  const [purchasingKey, setPurchasingKey] = useState<string | null>(null);

  const handleBuy = async (pack: CreditPack) => {
    if (!isAuthenticated || !userId || !userEmail) {
      router.push('/sign-in?redirect_url=/pricing');
      return;
    }

    if (purchasingKey) return;

    try {
      setPurchasingKey(pack.key);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: pack.productId,
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to start checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setPurchasingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-content-bg pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Buy Credits
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Pay as you go — buy a pack whenever you need more, credits never expire.
          </p>
        </div>

        {/* Pack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packs.map((pack) => {
            const isPurchasing = purchasingKey === pack.key;
            const isDisabled = purchasingKey !== null;

            return (
              <div
                key={pack.key}
                className={`bg-gray-900 rounded-2xl border ${
                  pack.badge ? 'border-white ring-2 ring-white/20' : 'border-gray-700'
                } p-8 relative`}
              >
                {/* Badge */}
                {pack.badge && (
                  <div className="absolute -top-3 right-6">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                      pack.badge === 'Most Popular'
                        ? 'bg-white text-gray-900'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}>
                      {pack.badge}
                    </span>
                  </div>
                )}

                {/* Pack Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pack.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-bold text-white">{pack.priceLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{pack.credits.toLocaleString()} credits</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleBuy(pack)}
                  disabled={isDisabled}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isPurchasing
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-70'
                      : isDisabled
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                        : pack.badge === 'Most Popular'
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : pack.badge === 'Best Value'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {isPurchasing ? 'Processing...' : `Buy ${pack.name}`}
                  {!isDisabled && <ArrowUpRight className="w-5 h-5" />}
                </button>
              </div>
            );
          })}
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
