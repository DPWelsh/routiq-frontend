import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

// Types based on architecture document
export interface DashboardResponse {
  success: boolean
  organization_id: string
  summary: {
    total_patients: number
    active_patients: number
    patients_with_upcoming: number
    patients_with_recent: number
    total_upcoming_appointments: number
    total_recent_appointments: number
    total_all_appointments: number
    avg_upcoming_per_patient: number
    avg_recent_per_patient: number
    avg_total_per_patient: number
    last_sync_time: string
    synced_patients: number
    sync_percentage: number
    integration_status: string
    activity_status: string
    engagement_rate: number
    generated_at: string
  }
  recent_activity: Array<{
    id: string
    source_system: string
    operation_type: string
    status: string
    records_processed: number
    records_success: number
    records_failed: number
    started_at: string
    completed_at: string | null
    activity_type: string
    description: string
    minutes_ago: number
  }>
  timestamp: string
}

export interface PatientsResponse {
  organization_id: string
  patients: Array<{
    id: string
    name: string
    phone: string
    email: string
    is_active: boolean
    recent_appointment_count: number
    upcoming_appointment_count: number
    next_appointment_time?: string
    next_appointment_type?: string
  }>
  total_count: number
}

export interface SyncResponse {
  success: boolean
  sync_id: string
  status: string
  message: string
}

/**
 * Hook for unified dashboard data fetching
 * Implements the architecture's smart caching and refresh strategy
 */
export function useDashboardData(organizationId: string | null) {
  const queryClient = useQueryClient()

  // Single API call to get all dashboard data
  const getDashboardData = useCallback(async (): Promise<DashboardResponse | null> => {
    if (!organizationId) return null
    
    const response = await fetch(`/api/dashboard/${organizationId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.status}`)
    }
    
    return await response.json()
  }, [organizationId])

  // Check if there's an active sync running
  const hasActiveSyncs = useCallback((recentActivity: DashboardResponse['recent_activity']) => {
    return recentActivity.some(activity => activity.status === 'running')
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
  const currentActiveSyncs = dashboardData ? hasActiveSyncs(dashboardData.recent_activity) : false

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
    
    const response = await fetch(`/api/patients/${organizationId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch patients data: ${response.status}`)
    }
    
    return await response.json()
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
      
      const response = await fetch(`/api/sync/${organizationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error(`Sync failed: ${response.status}`)
      return await response.json()
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