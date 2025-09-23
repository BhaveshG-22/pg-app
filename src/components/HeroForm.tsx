'use client'

import { Button } from "@/components/ui/button"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

export function HeroForm() {
  const { signIn } = useSignIn()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      if (!signIn) return

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard"
      })
    } catch (error) {
      console.error('Google sign-in failed:', error)
      router.push('/sign-in')
    }
  }

  return (
    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">Free Photo Generator</span>
        </div>
        <h3 className="text-xl font-bold text-card-foreground">Get Started in 30 Seconds</h3>
      </div>

      <input
        type="email"
        required
        placeholder="Enter your email address"
        className="w-full px-4 py-3 border border-border bg-background text-foreground placeholder-muted-foreground rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      />

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        🎨 Get your first photo for free
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-card text-muted-foreground font-medium">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full h-12 px-6 bg-background border border-border rounded-2xl flex items-center justify-center transition-all duration-200 hover:bg-muted hover:shadow-md"
      >
        <FcGoogle className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="text-base font-medium text-card-foreground">Continue with Google</span>
      </button>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Already have an account? We&apos;ll log you in automatically
        </p>
      </div>
    </form>
  )
}