import { auth, currentUser } from "@clerk/nextjs/server"
import { NavbarClient } from "./navbar"
import { prisma } from "@/lib/prisma"

export async function Navbar() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  // Don't redirect here - let middleware handle auth
  // If no user, return null and let the page handle it
  if (!userId || !clerkUser) {
    return null
  }

  // Fetch user from database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      credits: true,
    }
  })

  // If user doesn't exist in database, create or update them (fallback for webhook failures)
  if (!dbUser) {
    console.log('[Navbar] User not found in database, creating/updating fallback user...')
    try {
      const email = clerkUser.emailAddresses[0]?.emailAddress || ''

      dbUser = await prisma.user.upsert({
        where: { email },
        update: {
          clerkId: userId,
          name: clerkUser.fullName || clerkUser.username || 'Anonymous',
          avatar: clerkUser.imageUrl || null,
        },
        create: {
          clerkId: userId,
          email,
          name: clerkUser.fullName || clerkUser.username || 'Anonymous',
          avatar: clerkUser.imageUrl || null,
          credits: 5,
          totalCreditsUsed: 0,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          credits: true,
        }
      })
      console.log('[Navbar] Successfully created/updated fallback user:', dbUser.email)
    } catch (error) {
      console.error('[Navbar] Failed to create/update fallback user:', error)
      return null
    }
  }

  const userData = {
    name: clerkUser.fullName || clerkUser.username || dbUser.name || "Anonymous",
    email: clerkUser.emailAddresses[0]?.emailAddress || dbUser.email || "No email",
    avatar: clerkUser.imageUrl || dbUser.avatar || "",
  }

  return (
    <NavbarClient
      user={userData}
      credits={dbUser.credits}
      maxCredits={30}
    />
  )
}
