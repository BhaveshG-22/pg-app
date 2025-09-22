import { SignIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const user = await currentUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background py-24 relative">
      {/* Home Button - Top Right */}
      <div className="absolute top-8 right-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-all duration-300 group shadow-sm hover:shadow-md"
        >
          <Home className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
          <span className="text-sm font-medium text-card-foreground group-hover:text-foreground">Home</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 leading-tight">
            Welcome to PixelGlow
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
            Sign in to start transforming your photos with AI magic!
          </p>

          <div className="max-w-md mx-auto">
            <div className="p-4 bg-card border border-border rounded-2xl hover:bg-muted transition-colors">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none bg-transparent p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-background border border-border hover:bg-muted transition-colors",
                    socialButtonsBlockButtonText: "text-foreground",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground text-sm",
                    formFieldInput: "bg-background border-border focus:border-primary",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 transition-colors",
                    footerActionLink: "text-primary hover:text-primary/80"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}