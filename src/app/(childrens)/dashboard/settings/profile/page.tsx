import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Package,
  RefreshCw,
  Zap,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function UserBilling() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      credits: true,
      totalCreditsUsed: true,
      createdAt: true,
      creditPurchases: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-semibold">Billing</h1>
            <p className="text-muted-foreground text-sm">
              Your credit balance and purchase history
            </p>
          </div>
          <Button asChild>
            <Link href="/pricing">Buy More Credits</Link>
          </Button>
        </div>

        {/* Credit Balance */}
        <Card className="mb-8 p-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-primary size-5" />
              <h2 className="text-lg font-semibold">Credit Balance</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="text-primary size-4" />
                    <span className="text-sm font-medium">Credits Remaining</span>
                  </div>
                  <span className="text-sm font-semibold">{user.credits}</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="text-primary size-4" />
                    <span className="text-sm font-medium">Credits Used</span>
                  </div>
                  <span className="text-sm">{user.totalCreditsUsed} total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase History */}
        <Card className="p-0">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Purchase History</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your one-time credit pack purchases
              </p>
            </div>

            {user.creditPurchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto size-12 mb-2 opacity-50" />
                <p className="text-sm">No purchases yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.creditPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{purchase.packName} Pack</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+{purchase.creditsGranted} credits</p>
                      <p className="text-muted-foreground text-xs">
                        ${(purchase.amountCents / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
