'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, X, Loader2 } from "lucide-react"

type PaymentStatus = 'waiting' | 'completed' | 'timeout'

export default function SuccessMessage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showMessage, setShowMessage] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('waiting')
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const success = searchParams.get('success')
    if (success !== 'true') return

    setShowMessage(true)
    setPaymentStatus('waiting')

    let pollCount = 0
    const maxPolls = 20 // Poll for ~1 minute (20 polls × 3 seconds)
    let timeInterval: NodeJS.Timeout
    let pollInterval: NodeJS.Timeout

    // Update elapsed time every second
    timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    // Poll the API to check if subscription is active
    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/user/tier')
        const data = await response.json()

        // Check if subscription has been activated
        if (data.hasActiveSubscription && data.subscriptionStatus === 'active') {
          setPaymentStatus('completed')
          clearInterval(pollInterval)
          clearInterval(timeInterval)

          // Auto-hide success message after 8 seconds
          setTimeout(() => {
            setShowMessage(false)
            // Clean up URL
            router.replace('/dashboard')
          }, 8000)
        }
      } catch (error) {
        console.error('Failed to check subscription status:', error)
      }

      pollCount++

      // Stop polling after max attempts
      if (pollCount >= maxPolls) {
        setPaymentStatus('timeout')
        clearInterval(pollInterval)
        clearInterval(timeInterval)

        // Auto-hide after timeout
        setTimeout(() => {
          setShowMessage(false)
          router.replace('/dashboard')
        }, 5000)
      }
    }

    // Initial check
    checkSubscriptionStatus()

    // Poll every 3 seconds
    pollInterval = setInterval(checkSubscriptionStatus, 3000)

    return () => {
      clearInterval(pollInterval)
      clearInterval(timeInterval)
    }
  }, [searchParams, router])

  if (!showMessage) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5">
      {paymentStatus === 'waiting' && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
          <Loader2 className="w-6 h-6 flex-shrink-0 mt-0.5 animate-spin" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Confirming Payment...</h3>
            <p className="text-sm text-blue-50">
              Waiting for payment confirmation. This usually takes a few seconds.
            </p>
            <p className="text-xs text-blue-100 mt-2">
              Elapsed: {elapsedTime}s
            </p>
          </div>
          <button
            onClick={() => {
              setShowMessage(false)
              router.replace('/dashboard')
            }}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {paymentStatus === 'completed' && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Payment Confirmed!</h3>
            <p className="text-sm text-green-50">
              Your subscription has been activated. You now have access to all premium features!
            </p>
          </div>
          <button
            onClick={() => {
              setShowMessage(false)
              router.replace('/dashboard')
            }}
            className="text-white hover:text-green-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {paymentStatus === 'timeout' && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Payment Processing</h3>
            <p className="text-sm text-yellow-50">
              Your payment is being processed. Your subscription will be activated shortly. Please refresh the page in a moment.
            </p>
          </div>
          <button
            onClick={() => {
              setShowMessage(false)
              router.replace('/dashboard')
            }}
            className="text-white hover:text-yellow-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
