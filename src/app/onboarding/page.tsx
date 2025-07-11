'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { WelcomeOnboarding } from '@/components/onboarding/welcome-onboarding'
import { LoadingSpinner } from '@/components/magicui'
import { useTour } from '@/components/onboarding/tour-provider'

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const { startTour } = useTour()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn || !user) {
        router.push('/sign-in')
        return
      }
      
      // Check if THIS USER has completed onboarding before
      const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
      const hasCompletedOnboarding = localStorage.getItem(userOnboardingKey)
      
      if (hasCompletedOnboarding) {
        router.push('/dashboard')
        return
      }
      
      setShowOnboarding(true)
    }
  }, [isLoaded, isSignedIn, user, router])

  const handleOnboardingComplete = () => {
    if (user) {
      // Mark onboarding as completed for this specific user
      const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
      localStorage.setItem(userOnboardingKey, 'true')
      router.push('/dashboard')
    }
  }

  const handleSkip = () => {
    if (user) {
      // Mark onboarding as completed even if skipped for this specific user
      const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
      localStorage.setItem(userOnboardingKey, 'true')
      router.push('/dashboard')
    }
  }

  const handleStartInteractiveTour = () => {
    if (user) {
      // Mark onboarding as completed and start interactive tour for this specific user
      const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
      localStorage.setItem(userOnboardingKey, 'true')
      router.push('/dashboard')
      // Start the dashboard tour after a short delay to allow navigation
      setTimeout(() => {
        startTour('dashboard')
      }, 1000)
    }
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
      onStartInteractiveTour={handleStartInteractiveTour}
    />
  )
}