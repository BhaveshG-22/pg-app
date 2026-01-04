'use client'

import { Button } from "@/components/ui/button"
import { useClerk, SignUpButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function Header({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const clerk = useClerk()
  const { signOut } = clerk
  const router = useRouter()

  const [isScrolled, setIsScrolled] = useState(false)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/' })
      setShowSignOutDialog(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }




  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
            {isAuthenticated ? (
              <>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base px-3 sm:px-4"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSignOutDialog(true)}
                  className={`transition-colors duration-300 text-sm sm:text-base ${isScrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span className="hidden sm:inline">Continue with Google</span>
                    <span className="sm:hidden">Sign In</span>
                  </button>
                </SignUpButton>
                {/* <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
                  <button
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${isScrolled
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-black"
                      }`}
                  >
                    Continue with Google
                  </button>
                </SignUpButton> */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  )
}