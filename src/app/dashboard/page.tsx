'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { UnifiedDashboard } from '@/components/dashboard/unified-dashboard'
import { useTour } from '@/components/onboarding/tour-provider'

/**
 * Main Dashboard Page
 * Uses the unified data flow architecture for real-time healthcare data
 */
export default function DashboardPage() {
  const { startTour } = useTour()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for tour parameter in URL
    const tourParam = searchParams.get('tour')
    if (tourParam) {
      // Start the specified tour after a short delay
      setTimeout(() => {
        startTour(tourParam)
      }, 1000)
    }

    // Check for special 'full' parameter for complete app tour
    const fullTour = searchParams.get('full')
    if (fullTour === 'true') {
      setTimeout(() => {
        startTour('app-wide')
      }, 1000)
    }
  }, [searchParams, startTour])

  return <UnifiedDashboard />
} 