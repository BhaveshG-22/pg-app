import { currentUser } from '@clerk/nextjs/server'

export default async function WelcomeHeroSection() {
  const user = await currentUser()
  
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return 'there'
    return fullName.split(' ')[0]
  }

  return (
    <div className="bg-muted/30 min-h-[25vh] rounded-lg flex items-center justify-center shadow-sm p-6 mb-2">
      <div className="text-center select-none">
        <h1 className="text-2xl font-semibold mb-4 text-gray-300">
          Welcome to PixelGlow, {getFirstName(user?.fullName)}
        </h1>
        <p className="text-base text-gray-400 mb-6">Transform your photos with AI-powered style presets. No complex prompts needed.</p>
        <div className="flex justify-center gap-2">
          <button className="px-4 py-1.5 border border-gray-300 rounded-full text-xs text-gray-300 hover:bg-gray-300 hover:text-black transition-colors">
            Upload Photo
          </button>
          <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs hover:bg-primary/90 transition-colors">
            Browse Styles
          </button>
        </div>
      </div>
    </div>
  )
}