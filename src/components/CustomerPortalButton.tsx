"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"

export function CustomerPortalButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenPortal = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to open customer portal")
      }

      // Redirect to the customer portal
      window.location.href = data.portalUrl
    } catch (error: any) {
      console.error("Portal error:", error)
      alert(error.message || "Failed to open customer portal. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleOpenPortal}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening Portal...
        </>
      ) : (
        <>
          <ExternalLink className="mr-2 h-4 w-4" />
          Manage Subscription
        </>
      )}
    </Button>
  )
}
