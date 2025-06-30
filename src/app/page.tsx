'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingSpinner } from '@/components/magicui'

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Redirect authenticated users to dashboard
        router.push('/dashboard')
      } else {
        // Redirect unauthenticated users to sign-in
        router.push('/sign-in')
      }
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading spinner while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-routiq-cloud/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-routiq-blackberry/60">Loading Routiq Hub...</p>
        </div>
      </div>
    )
  }

  // This should not render as we redirect above, but just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-routiq-cloud/20 to-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-routiq-blackberry/60">Redirecting...</p>
      </div>
    </div>
  )
}
