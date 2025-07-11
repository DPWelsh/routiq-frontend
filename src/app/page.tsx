'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingSpinner } from '@/components/magicui'

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    console.log('🔍 Root page - Auth state:', { isLoaded, isSignedIn })
    
    if (isLoaded) {
      if (isSignedIn && user) {
        // Check if THIS USER has completed onboarding (user-specific key)
        const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
        const hasCompletedOnboarding = localStorage.getItem(userOnboardingKey)
        
        if (hasCompletedOnboarding) {
          console.log('✅ User authenticated and onboarded, redirecting to dashboard')
          router.push('/dashboard')
        } else {
          console.log('✅ User authenticated but not onboarded, redirecting to onboarding')
          router.push('/onboarding')
        }
      } else {
        console.log('❌ User not authenticated, redirecting to sign-in')
        router.push('/sign-in')
      }
    }
  }, [isLoaded, isSignedIn, user, router])

  // Show loading spinner while Clerk is initializing
  if (!isLoaded) {
    console.log('🔄 ROOT PAGE: Showing loading spinner - Clerk not loaded yet')
    return (
      <div className="min-h-screen bg-gradient-to-br from-routiq-cloud/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Loading Routiq Hub..." />
        </div>
      </div>
    )
  }

  // This should not render as we redirect above, but just in case
  console.log('🔄 ROOT PAGE: Showing fallback loading spinner - Should not normally render')
  return (
    <div className="min-h-screen bg-gradient-to-br from-routiq-cloud/20 to-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" text="Redirecting..." />
      </div>
    </div>
  )
}
