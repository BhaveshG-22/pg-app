import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  FileText,
  Package,
  RefreshCw,
  Settings,
  Zap,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const PLAN_PRICES: Record<string, string> = {
  FREE: "$0",
  PRO: "$4.99",
  CREATOR: "$14.99",
};

const PLAN_NAMES: Record<string, string> = {
  FREE: "Free",
  PRO: "Pro",
  CREATOR: "Creator",
};

export default async function UserBilling() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      tier: true,
      credits: true,
      totalCreditsUsed: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const planName = PLAN_NAMES[user.tier] || user.tier;
  const planPrice = PLAN_PRICES[user.tier] || "$0";
  const isActive = user.subscriptionStatus === "active";
  const isCancelled = user.subscriptionStatus === "cancelled";
  const isFree = user.tier === "FREE";
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-semibold">Billing & Subscription</h1>
            <p className="text-muted-foreground text-sm">
              Manage your subscription and billing details
            </p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 size-4" />
            Billing Settings
          </Button>
        </div>

        {/* Current Plan */}
        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="text-primary size-5" />
                  <h2 className="text-lg font-semibold">{planName} Plan</h2>
                  <Badge>{isFree ? "Free" : "Current Plan"}</Badge>
                  {isCancelled && <Badge variant="destructive">Cancelled</Badge>}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {isFree ? (
                    "Free plan with 20 credits per month"
                  ) : (
                    <>
                      {planPrice}/month
                      {isActive && user.subscriptionEndsAt && (
                        <> • Renews on {new Date(user.subscriptionEndsAt).toLocaleDateString()}</>
                      )}
                      {isCancelled && user.subscriptionEndsAt && (
                        <> • Expires on {new Date(user.subscriptionEndsAt).toLocaleDateString()}</>
                      )}
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/plans">
                    {isFree ? "Upgrade Plan" : "Change Plan"}
                  </Link>
                </Button>
                {!isFree && isActive && (
                  <Button variant="destructive" disabled>
                    Cancel Plan
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="text-primary size-4" />
                    <span className="text-sm font-medium">Credits Used</span>
                  </div>
                  <span className="text-sm">{user.totalCreditsUsed} total</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="text-primary size-4" />
                    <span className="text-sm font-medium">Credits Remaining</span>
                  </div>
                  <span className="text-sm">{user.credits} credits</span>
                </div>
                <Progress value={(user.credits / 100) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method - Only show for paid plans */}
        {!isFree && (
          <Card className="mb-8 p-0">
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground text-sm">
                      Managed by Polar
                    </span>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a
                    href="https://polar.sh/customer-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Manage Subscription
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History */}
        {!isFree && (
          <Card className="p-0">
            <CardContent className="p-6">
              <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">Billing History</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    View your invoices and payment history
                  </p>
                </div>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto size-12 mb-2 opacity-50" />
                <p className="text-sm">
                  Billing and invoices will be available once payment integration is completed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}