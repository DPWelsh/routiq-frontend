import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { RoutiqAPI, SyncTriggerResponse } from '@/lib/routiq-api'

// Use actual RoutiqAPI response types
type DashboardResponse = Awaited<ReturnType<RoutiqAPI['getDashboard']>>
type PatientsResponse = Awaited<ReturnType<RoutiqAPI['getPatients']>>
type SyncResponse = SyncTriggerResponse

/**
 * Hook for unified dashboard data fetching
 * Implements the architecture's smart caching and refresh strategy
 */
export function useDashboardData(organizationId: string | null) {
  const queryClient = useQueryClient()

  // Single API call to get all dashboard data - direct to backend via RoutiqAPI
  const getDashboardData = useCallback(async (): Promise<DashboardResponse | null> => {
    console.log('useDashboardData: getDashboardData called with organizationId:', organizationId)
    
    if (!organizationId) {
      console.log('useDashboardData: No organizationId provided, returning null')
      return null
    }
    
    console.log('useDashboardData: Creating RoutiqAPI instance and calling dashboard endpoint...')
    const api = new RoutiqAPI(organizationId)
    const result = await api.getDashboard(organizationId)
    console.log('useDashboardData: Dashboard API call successful:', result)
    return result
  }, [organizationId])

  // Check if there's an active sync running
  const hasActiveSyncs = useCallback((dashboardData: DashboardResponse | null | undefined) => {
    if (!dashboardData?.recent_activity) return false
    return dashboardData.recent_activity.some(activity => activity.status === 'running')
  }, [])

  // Main dashboard data query with intelligent caching
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    refetch: refetchDashboard, 
    error: dashboardError 
  } = useQuery({
    queryKey: ['dashboard-unified', organizationId],
    queryFn: getDashboardData,
    enabled: !!organizationId,
    refetchInterval: 30000,  // Default 30s, will be dynamically adjusted
    staleTime: 10000,  // Consider data fresh for 10 seconds
  })

  // Dynamically adjust refetch interval based on active syncs
  const currentActiveSyncs = hasActiveSyncs(dashboardData)

  return {
    dashboardData,
    isDashboardLoading,
    refetchDashboard,
    dashboardError,
    // Extracted data for convenience
    summary: dashboardData?.summary,
    recentActivity: dashboardData?.recent_activity || [],
    hasActiveSyncs: currentActiveSyncs,
  }
}

/**
 * Hook for patients data fetching
 */
export function usePatientsData(organizationId: string | null) {
  const getPatientsData = useCallback(async (): Promise<PatientsResponse | null> => {
    if (!organizationId) return null
    
    const api = new RoutiqAPI(organizationId)
    return await api.getPatients(organizationId)
  }, [organizationId])

  return useQuery({
    queryKey: ['patients', organizationId],
    queryFn: getPatientsData,
    enabled: !!organizationId,
    staleTime: 30000,  // Patients data doesn't change as frequently
  })
}

/**
 * Hook for sync operations
 */
export function useSyncMutation(organizationId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<SyncResponse> => {
      if (!organizationId) throw new Error('Organization ID required')
      
      const api = new RoutiqAPI(organizationId)
      return await api.triggerSync(organizationId)
    },
    onSuccess: () => {
      // Trigger multiple refreshes to catch sync appearing
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-unified', organizationId] })
      }, 1000)
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-unified', organizationId] })
      }, 3000)
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-unified', organizationId] })
      }, 5000)
    },
    onError: (error: Error) => {
      console.error('Sync failed:', error.message)
    },
  })
} 