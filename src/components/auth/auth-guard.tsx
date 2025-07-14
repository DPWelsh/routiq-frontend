'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { LoadingSpinner } from '@/components/magicui'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

export function AuthGuard({ 
  children, 
  redirectTo = '/sign-in',
  fallback 
}: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo)
    }
  }, [isLoaded, isSignedIn, router, redirectTo])

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    console.log('🔄 AUTH GUARD: Showing loading spinner - Clerk not loaded yet')
    return fallback || (
      <div className="min-h-screen bg-routiq-cloud/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    console.log('🔄 AUTH GUARD: Showing loading spinner - Redirecting to sign-in')
    return fallback || (
      <div className="min-h-screen bg-routiq-cloud/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" text="Redirecting to sign-in..." />
        </div>
      </div>
    )
  }

  // Render protected content
  return <>{children}</>
} 