import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import RotatingWelcomeMessage from './RotatingWelcomeMessage'

export default async function WelcomeHeroSection() {
  const user = await currentUser()

  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return 'there'
    return fullName.split(' ')[0]
  }

  const firstName = getFirstName(user?.fullName)

  return (
    <div className="bg-muted/30 min-h-[25vh] rounded-lg flex items-center justify-center shadow-sm p-6 mb-2">
      <div className="text-center select-none">
        <RotatingWelcomeMessage firstName={firstName} />
        <p className="text-base text-gray-400 mb-6">Transform your photos with AI-powered style presets. No complex prompts needed.</p>
        <div className="flex justify-center gap-2">
          <Link href="/studio" className="px-4 py-1.5 border border-gray-300 rounded-full text-xs text-gray-300 hover:bg-gray-300 hover:text-black transition-colors inline-block">
            Upload Photo
          </Link>
          <Link href="/studio" className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs hover:bg-primary/90 transition-colors inline-block">
            Browse Styles
          </Link>
        </div>
      </div>
    </div>
  )
}