'use client'

import { Button } from "@/components/ui/button"
import { useUser, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Header() {
  const { isSignedIn } = useUser();

  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)




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
      <nav className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-transparent">
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
              <span className="text-xl font-bold text-white">PixelGlow</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
                asChild
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
    <nav className={`fixed top-0 left-0 right-0 z-50 hidden lg:block transition-all duration-300 ${isScrolled
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
            <span className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-foreground' : 'text-white'
              }`}>PixelGlow</span>
          </Link>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>

                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant="ghost"
                    className={`transition-colors duration-300 ${isScrolled
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
                  className={`transition-colors duration-300 ${isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-gray-300 hover:text-white"
                    }`}
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>

              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}