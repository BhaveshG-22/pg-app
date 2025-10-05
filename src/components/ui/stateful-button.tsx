"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const RUNNING_MESSAGES = [
  "Bringing your vision to life...",
  "Crafting your image...",
  "Working on your creation...",
  "AI is painting your masterpiece...",
  "Transforming your idea...",
  "Magic in progress...",
  "Almost there...",
];

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: "idle" | "queued" | "running" | "completed" | "failed" | "loading";
  onClickAsync?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export function StatefulButton({
  children,
  className,
  onClick,
  onClickAsync,
  disabled,
  type = "button",
  status = "idle",
  ...props
}: StatefulButtonProps) {
  const [internalStatus, setInternalStatus] = useState<"idle" | "loading" | "success">("idle");

  // Randomly select a message when component mounts or status changes to running
  const runningMessage = useMemo(
    () => RUNNING_MESSAGES[Math.floor(Math.random() * RUNNING_MESSAGES.length)],
    [status]
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (internalStatus === "loading" || disabled) return;

    if (onClickAsync) {
      setInternalStatus("loading");
      try {
        await onClickAsync(event);
        setInternalStatus("success");
        setTimeout(() => setInternalStatus("idle"), 2000);
      } catch (error) {
        setInternalStatus("idle");
        console.error(error);
      }
    } else if (onClick) {
      onClick(event);
    }
  };

  // Use external status if provided, otherwise use internal
  const displayStatus = status !== "idle" ? status : internalStatus;

  const getStatusContent = () => {
    switch (displayStatus) {
      case "queued":
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Queued...</span>
          </>
        );
      case "running":
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{runningMessage}</span>
          </>
        );
      case "loading":
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading...</span>
          </>
        );
      case "completed":
      case "success":
        return (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
            <span>Completed!</span>
          </>
        );
      case "failed":
        return (
          <>
            <span className="text-lg">✕</span>
            <span>Failed</span>
          </>
        );
      default:
        return children;
    }
  };

  const isDisabled = disabled || displayStatus === "loading" || displayStatus === "queued" || displayStatus === "running";

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "relative w-full py-3 sm:py-4 font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base overflow-hidden",
        displayStatus === "completed" || displayStatus === "success"
          ? "bg-green-500 hover:bg-green-600 text-white"
          : displayStatus === "failed"
          ? "bg-red-500 hover:bg-red-600 text-white"
          : displayStatus === "queued"
          ? "bg-yellow-500 hover:bg-yellow-600 text-white cursor-not-allowed"
          : displayStatus === "running"
          ? "bg-blue-500 hover:bg-blue-600 text-white cursor-not-allowed"
          : displayStatus === "loading"
          ? "bg-purple-500 hover:bg-purple-600 text-white cursor-not-allowed"
          : isDisabled
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-primary hover:bg-primary/90 text-primary-foreground",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={displayStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-2"
        >
          {getStatusContent()}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
