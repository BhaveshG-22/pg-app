import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function ensureUserInDatabase() {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    // If user doesn't exist, create them
    if (!dbUser) {
      console.log(`Creating new user for ${clerkUser.emailAddresses[0]?.emailAddress}`)

      try {
        dbUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous',
            avatar: clerkUser.imageUrl || null,
            credits: 5, // Give new users 5 free credits
            totalCreditsUsed: 0,
          },
        })

        console.log(`✅ Created user in database: ${dbUser.email}`)
      } catch (createError: any) {
        // Handle race condition - another request might have created the user
        if (createError.code === 'P2002') {
          console.log(`⚠️ User already exists (race condition), fetching existing user`)
          dbUser = await prisma.user.findUnique({
            where: { clerkId: clerkUser.id }
          })
        } else {
          throw createError
        }
      }
    }

    return dbUser
  } catch (error) {
    console.error('❌ Error ensuring user in database:', error)
    throw error
  }
}