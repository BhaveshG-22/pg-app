'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, X } from "lucide-react"

export default function SuccessMessage() {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'true') {
      setShowSuccess(true)
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!showSuccess) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Payment Successful!</h3>
          <p className="text-sm text-green-50">
            Your subscription has been activated. You now have access to all premium features!
          </p>
        </div>
        <button
          onClick={() => setShowSuccess(false)}
          className="text-white hover:text-green-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
