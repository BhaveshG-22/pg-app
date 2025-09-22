import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export function useDbUser() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!clerkUser || !isClerkLoaded) {
        setIsLoaded(true)
        return
      }

      try {
        const response = await fetch('/api/user')
        const data = await response.json()

        if (data.success) {
          setUser(data.user)
        } else {
          alert('Internal error, try again')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        alert('Internal error, try again')
      } finally {
        setIsLoaded(true)
      }
    }

    fetchUser()
  }, [clerkUser, isClerkLoaded])

  return { user, isLoaded }
}