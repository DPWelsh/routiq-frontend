import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutiqAPI, ReengagementDashboard, PrioritizedPatientsResponse, RiskMetricsResponse, PerformanceMetricsResponse, TrendsResponse, OutreachLogRequest } from '@/lib/routiq-api';

/**
 * Hook to fetch risk metrics summary for dashboard cards
 * Priority 1: Risk Dashboard
 */
export function useRiskMetrics(organizationId: string) {
  return useQuery({
    queryKey: ['risk-metrics', organizationId],
    queryFn: async () => {
      const api = new RoutiqAPI(organizationId);
      return api.getRiskMetrics(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch reengagement performance metrics
 * Priority 2: Performance Tracking
 */
export function usePerformanceMetrics(
  organizationId: string, 
  timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days' = 'last_30_days'
) {
  return useQuery({
    queryKey: ['performance-metrics', organizationId, timeframe],
    queryFn: async () => {
      const api = new RoutiqAPI(organizationId);
      return api.getPerformanceMetrics(organizationId, timeframe);
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch prioritized patients with risk scores and recommendations
 * Priority 3: Prioritized Patient List
 */
export function usePrioritizedPatients(
  organizationId: string,
  options?: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low' | 'engaged' | 'all';
    limit?: number;
  }
) {
  return useQuery({
    queryKey: ['prioritized-patients', organizationId, options],
    queryFn: async () => {
      const api = new RoutiqAPI(organizationId);
      return api.getPrioritizedPatients(organizationId, options);
    },
    enabled: !!organizationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch reengagement trends over time
 * Priority 4: Trends & Analytics
 */
export function useReengagementTrends(
  organizationId: string,
  options?: {
    period?: '7d' | '30d' | '90d' | '6m' | '1y';
    metrics?: 'risk_levels' | 'success_rates' | 'channel_performance';
  }
) {
  return useQuery({
    queryKey: ['reengagement-trends', organizationId, options],
    queryFn: async () => {
      const api = new RoutiqAPI(organizationId);
      return api.getReengagementTrends(organizationId, options);
    },
    enabled: !!organizationId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to log outreach attempts for performance tracking
 */
export function useLogOutreach(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: OutreachLogRequest) => {
      const api = new RoutiqAPI(organizationId);
      return api.logOutreachAttempt(organizationId, request);
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['risk-metrics', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['performance-metrics', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['prioritized-patients', organizationId] });
    },
  });
}

/**
 * Hook to fetch comprehensive reengagement dashboard data
 * Complete Dashboard Integration
 */
export function useReengagementDashboard(organizationId: string) {
  return useQuery({
    queryKey: ['reengagement-dashboard', organizationId],
    queryFn: async () => {
      const api = new RoutiqAPI(organizationId);
      return api.getReengagementDashboard(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

// Convenience hooks for specific use cases

/**
 * Hook to get critical risk patients (immediate action required)
 */
export function useCriticalRiskPatients(organizationId: string) {
  return usePrioritizedPatients(organizationId, {
    risk_level: 'critical',
    limit: 10
  });
}

/**
 * Hook to get high risk patients (weekly targets)
 */
export function useHighRiskPatients(organizationId: string) {
  return usePrioritizedPatients(organizationId, {
    risk_level: 'high',
    limit: 25
  });
}

/**
 * Hook to get all at-risk patients (critical + high)
 */
export function useAtRiskPatients(organizationId: string) {
  const criticalQuery = useCriticalRiskPatients(organizationId);
  const highQuery = useHighRiskPatients(organizationId);

  return {
    data: {
      critical: criticalQuery.data?.patients || [],
      high: highQuery.data?.patients || [],
      total: (criticalQuery.data?.patients || []).length + (highQuery.data?.patients || []).length
    },
    isLoading: criticalQuery.isLoading || highQuery.isLoading,
    error: criticalQuery.error || highQuery.error,
    refetch: () => {
      criticalQuery.refetch();
      highQuery.refetch();
    }
  };
}

// Legacy hooks for backward compatibility

/**
 * @deprecated Use usePrioritizedPatients instead
 * Hook to fetch patients at risk with filtering options
 */
export function usePatientsAtRisk(
  organizationId: string,
  options?: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low' | 'all';
    limit?: number;
    action_required?: string;
  }
) {
  return useQuery({
    queryKey: ['patients-at-risk', organizationId, options],
    queryFn: async () => {
      const api = new RoutiqAPI(organizationId);
      return api.getPatientsAtRisk(organizationId, options);
    },
    enabled: !!organizationId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}