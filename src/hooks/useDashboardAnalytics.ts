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
 * Combined hook for both analytics and charts data
 * Provides fallback to hardcoded values for graceful degradation
 */
export function useDashboardAnalyticsWithFallback(organizationId: string | null, timeframe: TimeframeOption = '30d') {
  const analytics = useDashboardAnalytics(organizationId, timeframe)
  const charts = useDashboardCharts(organizationId, timeframe)

  // Fallback values (original hardcoded values)
  const fallbackAnalytics: DashboardAnalyticsResponse = {
    booking_metrics: {
      total_bookings: 247,
      period_comparison: 12,
      bookings_via_ai: 0
    },
    patient_metrics: {
      total_patients: 89,
      active_patients: 25,
      new_patients: 23
    },
    financial_metrics: {
      total_revenue: 50000,
      avg_revenue_per_patient: 562
    },
    automation_metrics: {
      total_roi: 284,
      automation_bookings: 0,
      efficiency_score: 85
    },
    timeframe: timeframe,
    last_updated: new Date().toISOString()
  }

  // Use real data if available, otherwise fall back to hardcoded values
  const effectiveAnalyticsData = analytics.analyticsData || (analytics.analyticsError ? fallbackAnalytics : null)
  const isLoading = analytics.isAnalyticsLoading || charts.isLoading
  const hasError = !!analytics.analyticsError || !!charts.error

  return {
    // Data
    analyticsData: effectiveAnalyticsData,
    chartsData: charts.data,
    
    // Loading states
    isLoading,
    isAnalyticsLoading: analytics.isAnalyticsLoading,
    isChartsLoading: charts.isLoading,
    
    // Error states
    hasError,
    analyticsError: analytics.analyticsError,
    chartsError: charts.error,
    
    // Refetch functions
    refetchAnalytics: analytics.refetchAnalytics,
    refetchCharts: charts.refetch,
    
    // Convenience extractors
    bookingMetrics: effectiveAnalyticsData?.booking_metrics,
    patientMetrics: effectiveAnalyticsData?.patient_metrics,
    financialMetrics: effectiveAnalyticsData?.financial_metrics,
    automationMetrics: effectiveAnalyticsData?.automation_metrics,
    lastUpdated: effectiveAnalyticsData?.last_updated,
    
    // Utility
    isUsingFallback: !analytics.analyticsData && !!analytics.analyticsError,
  }
} 