import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { RoutiqAPI, DashboardAnalyticsResponse, DashboardChartsResponse } from '@/lib/routiq-api'

type TimeframeOption = '7d' | '30d' | '90d' | '1y'

/**
 * Hook for dashboard analytics data fetching
 * Uses the new backend analytics endpoints to replace hardcoded values
 */
export function useDashboardAnalytics(organizationId: string | null, timeframe: TimeframeOption = '30d') {
  const getDashboardAnalytics = useCallback(async (): Promise<DashboardAnalyticsResponse | null> => {
    console.log('useDashboardAnalytics: getDashboardAnalytics called with organizationId:', organizationId, 'timeframe:', timeframe)
    
    if (!organizationId) {
      console.log('useDashboardAnalytics: No organizationId provided, returning null')
      return null
    }
    
    console.log('useDashboardAnalytics: Creating RoutiqAPI instance and calling analytics endpoint...')
    const api = new RoutiqAPI(organizationId)
    const result = await api.getDashboardAnalytics(organizationId, timeframe)
    console.log('useDashboardAnalytics: Analytics API call successful:', result)
    return result
  }, [organizationId, timeframe])

  // Main analytics data query
  const { 
    data: analyticsData, 
    isLoading: isAnalyticsLoading, 
    refetch: refetchAnalytics, 
    error: analyticsError 
  } = useQuery({
    queryKey: ['dashboard-analytics', organizationId, timeframe],
    queryFn: getDashboardAnalytics,
    enabled: !!organizationId,
    refetchInterval: 30000,  // Refresh every 30 seconds
    staleTime: 15000,  // Consider data fresh for 15 seconds
    retry: 3,  // Retry failed requests 3 times
  })

  return {
    analyticsData,
    isAnalyticsLoading,
    refetchAnalytics,
    analyticsError,
    // Extracted data for convenience
    bookingMetrics: analyticsData?.booking_metrics,
    patientMetrics: analyticsData?.patient_metrics,
    financialMetrics: analyticsData?.financial_metrics,
    automationMetrics: analyticsData?.automation_metrics,
    lastUpdated: analyticsData?.last_updated,
  }
}

/**
 * Hook for dashboard charts data fetching
 */
export function useDashboardCharts(organizationId: string | null, timeframe: TimeframeOption = '30d') {
  const getDashboardCharts = useCallback(async (): Promise<DashboardChartsResponse | null> => {
    console.log('useDashboardCharts: getDashboardCharts called with organizationId:', organizationId, 'timeframe:', timeframe)
    
    if (!organizationId) {
      console.log('useDashboardCharts: No organizationId provided, returning null')
      return null
    }
    
    console.log('useDashboardCharts: Creating RoutiqAPI instance and calling charts endpoint...')
    const api = new RoutiqAPI(organizationId)
    const result = await api.getDashboardCharts(organizationId, timeframe)
    console.log('useDashboardCharts: Charts API call successful:', result)
    return result
  }, [organizationId, timeframe])

  return useQuery({
    queryKey: ['dashboard-charts', organizationId, timeframe],
    queryFn: getDashboardCharts,
    enabled: !!organizationId,
    refetchInterval: 60000,  // Charts refresh every 60 seconds (less frequent)
    staleTime: 30000,  // Consider charts data fresh for 30 seconds
    retry: 2,  // Retry failed requests 2 times
  })
}

/**
 * Hook for test clinic overview data (no auth required)
 */
export function useTestClinicOverview(organizationId: string | null) {
  const getTestClinicOverview = useCallback(async () => {
    console.log('useTestClinicOverview: called with organizationId:', organizationId)
    
    if (!organizationId) {
      console.log('useTestClinicOverview: No organizationId provided, returning null')
      return null
    }
    
    console.log('useTestClinicOverview: Creating RoutiqAPI instance and calling test clinic overview endpoint...')
    const api = new RoutiqAPI(organizationId)
    const result = await api.getTestClinicOverview(organizationId)
    console.log('useTestClinicOverview: Test clinic overview API call successful:', result)
    return result
  }, [organizationId])

  return useQuery({
    queryKey: ['test-clinic-overview', organizationId],
    queryFn: getTestClinicOverview,
    enabled: !!organizationId,
    refetchInterval: 30000,  // Refresh every 30 seconds
    staleTime: 15000,  // Consider data fresh for 15 seconds
    retry: 3,  // Retry failed requests 3 times
  })
}

/**
 * Combined hook for both analytics and charts data
 * Provides fallback to hardcoded values for graceful degradation
 * OPTIMIZED FOR DEMO: Uses immediate dummy data for fast loading
 */
export function useDashboardAnalyticsWithFallback(organizationId: string | null, timeframe: TimeframeOption = '30d') {
  // Demo branch - always use dummy data for fast loading and realistic demo experience
  const isDemoEnvironment = true

  // Demo account fallback values - realistic healthcare clinic data
  const fallbackAnalytics: DashboardAnalyticsResponse = {
    booking_metrics: {
      total_bookings: 342,
      period_comparison: 18.5,
      bookings_via_ai: 89
    },
    patient_metrics: {
      total_patients: 1247,
      active_patients: 186,
      new_patients: 34
    },
    financial_metrics: {
      total_revenue: 127500,
      avg_revenue_per_patient: 485
    },
    automation_metrics: {
      total_roi: 425,
      automation_bookings: 89,
      efficiency_score: 92
    },
    timeframe: timeframe,
    last_updated: new Date().toISOString()
  }

  // Enhanced dummy test clinic data for demo
  const demoTestClinicData = {
    status: 'success',
    org_id: organizationId || 'demo-org',
    time_range: timeframe,
    metrics: {
      total_bookings: 342,
      new_patients: 34,
      total_patients: 1247,
      active_patients: 186,
      missed_appointments: 28,
      revenue_this_month: '127500',
      bookings_change_percent: 18.5,
      new_patients_change_percent: 22.3,
      total_patients_change_percent: 8.7,
      active_patients_change_percent: 14.2,
      missed_appointments_change_percent: -12.5,
      revenue_change_percent: 24.8,
      date_range: `Last ${timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : timeframe === '90d' ? '90 days' : 'year'}`,
      last_updated: new Date().toISOString()
    },
    warning: 'Demo data - not connected to real clinic'
  }

  // For demo environment, return immediate dummy data
  if (isDemoEnvironment) {
    return {
      // Data
      analyticsData: fallbackAnalytics,
      chartsData: null, // No charts data needed for demo
      
      // Loading states - always false for demo
      isLoading: false,
      isAnalyticsLoading: false,
      isChartsLoading: false,
      
      // Error states - always false for demo
      hasError: false,
      analyticsError: null,
      chartsError: null,
      
      // Refetch functions - no-op for demo
      refetchAnalytics: () => Promise.resolve(),
      refetchCharts: () => Promise.resolve(),
      
      // Convenience extractors
      bookingMetrics: fallbackAnalytics.booking_metrics,
      patientMetrics: fallbackAnalytics.patient_metrics,
      financialMetrics: fallbackAnalytics.financial_metrics,
      automationMetrics: fallbackAnalytics.automation_metrics,
      lastUpdated: fallbackAnalytics.last_updated,
      
      // Utility
      isUsingFallback: true,
      
      // Raw test clinic data for additional metrics
      testClinicOverview: demoTestClinicData,
    }
  }

  // For non-demo environments, use original API logic
  const testClinicData = useTestClinicOverview(organizationId)
  const charts = useDashboardCharts(organizationId, timeframe)

  // Convert test clinic overview data to analytics format
  const convertTestDataToAnalytics = (testData: any): DashboardAnalyticsResponse | null => {
    if (!testData?.metrics) return null
    
    const metrics = testData.metrics
    return {
      booking_metrics: {
        total_bookings: metrics.total_bookings || 0,
        period_comparison: metrics.bookings_change_percent || 0,
        bookings_via_ai: 0 // Not available in test endpoint
      },
      patient_metrics: {
        total_patients: metrics.total_patients || 0,
        active_patients: metrics.active_patients || 0,
        new_patients: metrics.new_patients || 0
      },
      financial_metrics: {
        total_revenue: parseFloat(metrics.revenue_this_month || '0'),
        avg_revenue_per_patient: 0 // Not available in test endpoint
      },
      automation_metrics: {
        total_roi: 0, // Not available in test endpoint
        automation_bookings: 0,
        efficiency_score: 0
      },
      timeframe: timeframe,
      last_updated: metrics.last_updated || new Date().toISOString()
    }
  }

  // Convert test clinic data to analytics format
  const convertedAnalyticsData = testClinicData.data ? convertTestDataToAnalytics(testClinicData.data) : null
  
  // Use real data if available, otherwise fall back to hardcoded values
  const effectiveAnalyticsData = convertedAnalyticsData || (testClinicData.error ? fallbackAnalytics : null)
  const isLoading = testClinicData.isLoading || charts.isLoading
  const hasError = !!testClinicData.error || !!charts.error

  return {
    // Data
    analyticsData: effectiveAnalyticsData,
    chartsData: charts.data,
    
    // Loading states
    isLoading,
    isAnalyticsLoading: testClinicData.isLoading,
    isChartsLoading: charts.isLoading,
    
    // Error states
    hasError,
    analyticsError: testClinicData.error,
    chartsError: charts.error,
    
    // Refetch functions
    refetchAnalytics: testClinicData.refetch,
    refetchCharts: charts.refetch,
    
    // Convenience extractors
    bookingMetrics: effectiveAnalyticsData?.booking_metrics,
    patientMetrics: effectiveAnalyticsData?.patient_metrics,
    financialMetrics: effectiveAnalyticsData?.financial_metrics,
    automationMetrics: effectiveAnalyticsData?.automation_metrics,
    lastUpdated: effectiveAnalyticsData?.last_updated,
    
    // Utility
    isUsingFallback: !convertedAnalyticsData && !!testClinicData.error,
    
    // Raw test clinic data for additional metrics
    testClinicOverview: testClinicData.data,
  }
} 