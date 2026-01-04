'use client'

import { useState, useEffect } from 'react'
import { RollingText } from '@/components/ui/rolling-text'

const welcomeMessages = [
  "Welcome to PixelGlow",
  "Good to see you",
  "What would you like to create today",
  "Ready when you are",
  "All set, let's begin",
  "Your creative space is ready",
  "Let's get started",
  "What's on your creative agenda today",
  "Welcome back",
  "Nice to have you here",
  "Glad you're here",
  "Good to have you back, let's create",
  "Create something beautiful today",
  "Let's bring your photos to life",
  "Your next creation starts here",
  "Transform a photo into something special",
  "Let's create",
  "Start creating",
  "Choose a style to begin",
  "Pick a style and go",
  "Designed to make creation effortless",
  "Powered by AI, guided by you"
]

export default function RotatingWelcomeMessage({ firstName }: { firstName: string }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Change message every 15 minutes
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % welcomeMessages.length)
      setKey((prev) => prev + 1) // Force re-render for animation
    }, 900000) // 15 minutes = 15 * 60 * 1000 milliseconds

    return () => clearInterval(interval)
  }, [])

  return (
    <h1 className="text-2xl font-semibold mb-4 text-gray-300">
      <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-4">{firstName}</span>, <RollingText
        key={key}
        text={welcomeMessages[messageIndex]}
        className="inline-block"
        transition={{ duration: 0.5, delay: 0.02, ease: 'easeOut' }}
        inView={true}
        inViewOnce={false}
      />
    </h1>
  )
}
