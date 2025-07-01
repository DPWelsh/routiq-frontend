import { useQuery } from '@tanstack/react-query';
import { RoutiqAPI, ReengagementDashboard, PatientsAtRiskResponse, RiskMetricsResponse } from '@/lib/routiq-api';

/**
 * Hook to fetch reengagement dashboard data with risk metrics
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

/**
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

/**
 * Hook to get critical risk patients (immediate action required)
 */
export function useCriticalRiskPatients(organizationId: string) {
  return usePatientsAtRisk(organizationId, {
    risk_level: 'critical',
    limit: 10
  });
}

/**
 * Hook to get high risk patients (weekly targets)
 */
export function useHighRiskPatients(organizationId: string) {
  return usePatientsAtRisk(organizationId, {
    risk_level: 'high',
    limit: 25
  });
}

/**
 * Hook to fetch risk assessment metrics with alerts and risk stratification
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