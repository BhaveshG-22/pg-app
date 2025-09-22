"use client"

import { NavbarUser } from "./navbar-user"
import { CreditsBattery } from "./credits-battery"
import { NavbarSearch } from "./NavbarSearch"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useDbUser } from "@/hooks/useDbUser"

export function Navbar() {
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const { user: dbUser, isLoaded: isDbUserLoaded } = useDbUser();

  if (!isLoaded || !isSignedIn || !isDbUserLoaded || !dbUser) return null

  const data = {
    user: {
      name: clerkUser?.fullName || clerkUser?.username || dbUser.name || "Anonymous",
      email: clerkUser?.primaryEmailAddress?.emailAddress || dbUser.email || "No email",
      avatar: clerkUser?.imageUrl || dbUser.avatar, 
    },
  }




  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/95 select-none">
      <div className="flex h-14 items-center justify-between pl-5 pr-6">
        <div className="flex items-center space-x-2">

          <Link href="/" className="font-semibold text-sidebar-foreground hover:text-sidebar-foreground/80 transition-colors cursor-pointer flex flex-row items-center gap-2">
            <Image
              src="/pixelGlowLogo.png"
              alt="PixelGlow Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain scale-125"
            />

            PixelGlow
          </Link>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 flex justify-center max-w-md mx-8">
          <NavbarSearch />
        </div>

        <div className="flex items-center space-x-4">
          <NavbarUser user={data.user} />
          <CreditsBattery credits={dbUser.credits} maxCredits={30} />
        </div>
      </div>
    </div>
  )
}