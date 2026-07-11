import { Header } from '@/components/Header';
import { auth, currentUser } from '@clerk/nextjs/server';
import { CREDIT_PACKS } from '@/lib/polar';
import PricingClient from './PricingClient';

export default async function PricingPlans() {
  const { userId } = await auth();
  const user = await currentUser();

  const isAuthenticated = !!user;

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <PricingClient
        packs={CREDIT_PACKS}
        isAuthenticated={isAuthenticated}
        userId={userId}
        userEmail={user?.emailAddresses[0]?.emailAddress || null}
      />
    </>
  );
}
