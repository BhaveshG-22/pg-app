import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

export function useDbUser() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchUser = useCallback(async () => {
    if (!clerkUser || !isClerkLoaded) {
      setIsLoaded(true)
      return
    }

    try {
      // Add cache busting to ensure fresh data
      const response = await fetch('/api/user', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        console.log('✅ User data refreshed. Credits:', data.user.credits)
      } else {
        alert('Internal error, try again')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      alert('Internal error, try again')
    } finally {
      setIsLoaded(true)
    }
  }, [clerkUser, isClerkLoaded])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, isLoaded, refetchUser: fetchUser }
}