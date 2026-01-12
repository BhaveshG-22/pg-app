import { Header } from '@/components/Header';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import PricingClient from './PricingClient';

export default async function PricingPlans() {
  const { userId } = await auth();
  const user = await currentUser();

  let currentTier: string | null = null;
  let hasActiveSubscription = false;

  // Fetch user's current tier and subscription status on server
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        tier: true,
        polarSubscriptionId: true,
        subscriptionStatus: true,
      },
    });

    if (dbUser) {
      currentTier = dbUser.tier;
      // Check if user has an active subscription (exclude canceled/unpaid/expired)
      hasActiveSubscription = !!(
        dbUser.polarSubscriptionId &&
        dbUser.subscriptionStatus &&
        dbUser.subscriptionStatus !== 'canceled' &&
        dbUser.subscriptionStatus !== 'cancelled' &&
        dbUser.subscriptionStatus !== 'revoked' &&
        dbUser.subscriptionStatus !== 'unpaid' &&
        dbUser.subscriptionStatus !== 'incomplete_expired' &&
        (dbUser.subscriptionStatus === 'active' ||
         dbUser.subscriptionStatus === 'created' ||
         dbUser.subscriptionStatus === 'incomplete' ||
         dbUser.subscriptionStatus === 'trialing')
      );
    }
  }

  const isSandbox = process.env.POLAR_SERVER === 'sandbox';

  const isAuthenticated = !!user;

  const plans = [
    {
      name: 'Free',
      price: '$0',
      interval: 'month',
      description: 'Perfect for getting started',
      priceId: null,
      productId: 'free',
      features: [
        { icon: 'Coins', text: '5 credits per month' },
        { icon: 'Sparkles', text: 'Premium AI model quality' },
        { icon: 'Gauge', text: 'Standard processing speed' },
        { icon: 'Droplet', text: 'Limited watermark' },
        { icon: 'Layers', text: '1 concurrent job' }
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
        { icon: 'Coins', text: '100 credits per month' },
        { icon: 'Sparkles', text: 'Premium AI model quality' },
        { icon: 'Droplet', text: 'No watermark' },
        { icon: 'Zap', text: 'Faster processing' },
        { icon: 'Layers', text: '3 concurrent jobs' },
        { icon: 'Briefcase', text: 'Commercial usage rights' },
        { icon: 'Mail', text: 'Email support' }
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
        { icon: 'Coins', text: '400 credits per month' },
        { icon: 'Sparkles', text: 'Premium AI model quality' },
        { icon: 'Star', text: 'Early access to new presets' },
        { icon: 'Zap', text: 'Priority processing' },
        { icon: 'Layers', text: 'Unlimited concurrent jobs' },
        { icon: 'Headphones', text: 'Priority customer support' },
        { icon: 'Code', text: 'API access (coming soon)' }
      ],
      badge: 'Most Value',
      buttonStyle: 'gradient'
    }
  ];

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <PricingClient
        plans={plans}
        currentTier={currentTier}
        hasActiveSubscription={hasActiveSubscription}
        isAuthenticated={isAuthenticated}
        userId={userId}
        userEmail={user?.emailAddresses[0]?.emailAddress || null}
      />
    </>
  );
}
