"use client"

import { NavbarUser } from "./navbar-user"
import { CreditsBattery } from "./credits-battery"
import { NavbarSearch } from "./NavbarSearch"
import Image from "next/image"
import Link from "next/link"

interface NavbarClientProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  credits: number
  maxCredits: number
}

export function NavbarClient({ user, credits, maxCredits }: NavbarClientProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/95 select-none">
      <div className="flex h-14 items-center justify-between pl-3 pr-3 sm:pl-5 sm:pr-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="font-semibold text-sidebar-foreground hover:text-sidebar-foreground/80 transition-colors cursor-pointer flex flex-row items-center gap-2">
            <Image
              src="/pixelGlowLogo.png"
              alt="PixelGlow Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain scale-125"
            />
            <span className="hidden sm:inline">PixelGlow</span>
          </Link>
        </div>

        {/* Center Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-8">
          <NavbarSearch />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile controls - Show only on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/studio"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Browse presets"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Link>
            <NavbarSearch isMobile={true} />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <CreditsBattery credits={credits} maxCredits={maxCredits} />
            <NavbarUser user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}