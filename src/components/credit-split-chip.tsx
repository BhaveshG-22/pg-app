"use client"

import { Zap, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDbUser } from "@/hooks/useDbUser"

interface CreditSplitChipProps {
  initialCredits: number
  lowThreshold?: number
  className?: string
}

export function CreditSplitChip({
  initialCredits,
  lowThreshold = 25,
  className,
}: CreditSplitChipProps) {
  const router = useRouter()
  const { user } = useDbUser()
  const credits = user?.credits ?? initialCredits
  const isLow = credits <= lowThreshold

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-full border border-border",
        className
      )}
    >
      <button
        type="button"
        onClick={() => router.push("/dashboard/settings/profile")}
        aria-label={`Credit balance: ${credits.toLocaleString()} credits. View billing`}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold tabular-nums transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          isLow
            ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/20"
            : "bg-white/5 text-sidebar-foreground hover:bg-white/10"
        )}
      >
        <Zap className={cn("h-3.5 w-3.5", isLow ? "text-amber-400" : "text-yellow-400")} aria-hidden="true" />
        <span>{credits.toLocaleString()}</span>
      </button>
      <button
        type="button"
        onClick={() => router.push("/pricing")}
        aria-label="Top up credits"
        className="flex w-8 items-center justify-center bg-primary text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
