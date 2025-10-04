'use client'

import { Button } from "@/components/ui/button"
import { useUser, SignOutButton, useSignIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

export function Header() {
  const { isSignedIn } = useUser();
  const { signIn } = useSignIn()
  const router = useRouter()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

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




  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/pixelGlowLogo.png"
                alt="PixelGlow Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain scale-125"
              />
              <span className="text-lg sm:text-xl font-bold text-white">PixelGlow</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white text-sm sm:text-base"
                asChild
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base px-3 sm:px-4"
                asChild
              >
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-background/80 backdrop-blur-md border-b border-border/50'
      : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/pixelGlowLogo.png"
              alt="PixelGlow Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain scale-125"
            />
            <span className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-foreground' : 'text-white'
              }`}>PixelGlow</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn ? (
              <>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base px-3 sm:px-4"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant="ghost"
                    className={`transition-colors duration-300 text-sm sm:text-base ${isScrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-gray-300 hover:text-white"
                      }`}
                  >
                    Sign Out
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={`transition-colors duration-300 text-sm sm:text-base ${isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-gray-300 hover:text-white"
                    }`}
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <button
                  onClick={handleGoogleSignIn}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${isScrolled
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-black"
                    }`}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}