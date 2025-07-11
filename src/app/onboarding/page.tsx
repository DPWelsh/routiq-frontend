'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { WelcomeOnboarding } from '@/components/onboarding/welcome-onboarding'
import { LoadingSpinner } from '@/components/magicui'

export default function OnboardingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in')
        return
      }
      
      // Check if user has completed onboarding before
      const hasCompletedOnboarding = localStorage.getItem('routiq-onboarding-completed')
      
      if (hasCompletedOnboarding) {
        router.push('/dashboard')
        return
      }
      
      setShowOnboarding(true)
    }
  }, [isLoaded, isSignedIn, router])

  const handleOnboardingComplete = () => {
    // Mark onboarding as completed
    localStorage.setItem('routiq-onboarding-completed', 'true')
    router.push('/dashboard')
  }

  const handleSkip = () => {
    // Mark onboarding as completed even if skipped
    localStorage.setItem('routiq-onboarding-completed', 'true')
    router.push('/dashboard')
  }

  // Show loading while checking auth state
  if (!isLoaded || !showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-routiq-cloud/20 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Preparing your experience..." />
        </div>
      </div>
    )
  }

  return (
    <WelcomeOnboarding 
      onComplete={handleOnboardingComplete}
      onSkip={handleSkip}
    />
  )
}