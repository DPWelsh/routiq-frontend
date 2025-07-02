'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Activity, RefreshCw, Zap, AlertTriangle, AlertCircle, TrendingUp, Phone, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { useDashboardData, usePatientsData, useSyncMutation } from '@/hooks/useDashboardData'
import { useRiskMetrics, usePerformanceMetrics, useCriticalRiskPatients } from '@/hooks/useReengagementData'
import LoadingSpinner from '@/components/magicui/loading-spinner'

/**
 * Unified Dashboard Component
 * Implements the complete data flow architecture:
 * 1. Organization Context
 * 2. React Query for data fetching
 * 3. Smart caching and refresh strategies
 * 4. Real-time sync monitoring
 * 5. Error handling and recovery
 */
export function UnifiedDashboard() {
  const { organizationId, organizationName } = useOrganizationContext()
  
  // Main dashboard data using the architecture's unified approach
  const {
    dashboardData,
    isDashboardLoading,
    refetchDashboard,
    dashboardError,
    summary,
    recentActivity,
    hasActiveSyncs,
  } = useDashboardData(organizationId)

  // Patients data
  const {
    data: patientsData,
    isLoading: isPatientsLoading,
    error: patientsError,
  } = usePatientsData(organizationId)

  // NEW: Risk-based reengagement data
  const {
    data: riskMetrics,
    isLoading: isRiskLoading,
    error: riskError,
    refetch: refetchRiskMetrics
  } = useRiskMetrics(organizationId || '')

  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
  } = usePerformanceMetrics(organizationId || '', 'last_30_days')

  const {
    data: criticalPatients,
    isLoading: isCriticalLoading,
  } = useCriticalRiskPatients(organizationId || '')

  // Sync mutation
  const syncMutation = useSyncMutation(organizationId)

  // Enhanced refresh during active syncs
  useEffect(() => {
    if (hasActiveSyncs) {
      const interval = setInterval(() => {
        refetchDashboard()
      }, 5000) // Fast refresh during sync

      return () => clearInterval(interval)
    }
    
    return undefined
  }, [hasActiveSyncs, refetchDashboard])

  const handleManualRefresh = async () => {
    await refetchDashboard()
    await refetchRiskMetrics()
  }

  const handleStartSync = () => {
    syncMutation.mutate()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'running': return 'bg-blue-500 animate-pulse'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Loading State
  if (isDashboardLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Error State - Check if it's a 404 (backend not ready)
  if (dashboardError) {
    const isBackendNotReady = dashboardError.message.includes('404') || 
                             dashboardError.message.includes('Not Found') ||
                             dashboardError.message.includes('Cannot resolve')

    if (isBackendNotReady) {
      return (
        <div className="p-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-2">
                <p className="font-semibold">Backend Endpoints Not Ready</p>
                <p>The dashboard requires backend API endpoints that are being implemented.</p>
                <p className="text-sm">
                  ✅ Organization: <span className="font-medium">{organizationName}</span><br/>
                  ⏳ Waiting for: Dashboard data endpoints<br/>
                  📋 See: <code>FRONTEND_API_REQUIREMENTS.md</code> for implementation details
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error loading dashboard: {dashboardError.message}
            <Button 
              onClick={handleManualRefresh} 
              variant="outline" 
              size="sm" 
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!organizationId) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            Please select an organization to view dashboard data.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Organization and Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            {organizationName} • {summary?.integration_status || 'Loading...'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasActiveSyncs && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Sync Running
            </Badge>
          )}
          
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
            disabled={isDashboardLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isDashboardLoading && "animate-spin")} />
            Refresh
          </Button>
          
          <Button
            onClick={handleStartSync}
            disabled={syncMutation.isPending || hasActiveSyncs}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            {syncMutation.isPending ? 'Starting...' : 'Start Sync'}
          </Button>
        </div>
      </div>

      {/* Risk-Based Alert Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Critical Risk Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">
                  🔴 Critical Risk
                </p>
                <p className="text-2xl font-bold text-red-800">
                  {riskMetrics?.risk_summary?.critical || 0}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Immediate contact required
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        {/* High Risk Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  🟠 High Risk
                </p>
                <p className="text-2xl font-bold text-orange-800">
                  {riskMetrics?.risk_summary?.high || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Contact within 24h
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Contact Success Rate */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  📞 Contact Success Rate
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {performanceData?.reengagement_metrics?.contact_success_rate?.toFixed(1) || '0.0'}%
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {performanceData?.benchmark_comparison?.our_performance === 'above_average' ? '↗️ Above industry avg' : 
                   performanceData?.benchmark_comparison?.our_performance === 'below_average' ? '↘️ Below industry avg' : 
                   '→ At industry avg'}
                </p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Immediate Actions Required */}
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  ⚡ Immediate Actions
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {riskMetrics?.immediate_actions_required || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Urgent priority tasks
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Breakdown */}
      {riskMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {riskMetrics.risk_summary.critical}
                </div>
                <div className="text-sm text-red-700">Critical</div>
                <div className="text-xs text-gray-500">45+ days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {riskMetrics.risk_summary.high}
                </div>
                <div className="text-sm text-orange-700">High</div>
                <div className="text-xs text-gray-500">30-44 days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {riskMetrics.risk_summary.medium}
                </div>
                <div className="text-sm text-yellow-700">Medium</div>
                <div className="text-xs text-gray-500">14-29 days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {riskMetrics.risk_summary.low}
                </div>
                <div className="text-sm text-blue-700">Low</div>
                <div className="text-xs text-gray-500">7-13 days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {riskMetrics.risk_summary.engaged}
                </div>
                <div className="text-sm text-green-700">Engaged</div>
                <div className="text-xs text-gray-500">Recent contact</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Priority Patients */}
      {criticalPatients?.patients && criticalPatients.patients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Critical Risk Patients - Immediate Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalPatients.patients.slice(0, 5).map((patient) => (
                <div 
                  key={patient.id} 
                  className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50"
                >
                  <div>
                    <p className="font-medium text-red-900">{patient.name}</p>
                    <p className="text-sm text-red-700">{patient.phone}</p>
                    <p className="text-xs text-red-600">
                      {patient.days_since_last_contact} days since last contact
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                      Risk: {patient.risk_score}/100
                    </Badge>
                    <p className="text-xs text-red-600 mt-1">
                      {patient.recommended_action}
                    </p>
                  </div>
                </div>
              ))}
              {criticalPatients.patients.length > 5 && (
                <p className="text-sm text-center text-gray-600 pt-2">
                  And {criticalPatients.patients.length - 5} more critical patients...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity) => (
                <div 
                  key={activity.id} 
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg",
                    activity.status === 'running' && "border-blue-200 bg-blue-50"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(activity.status)
                  )} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.operation_type}</p>
                    <p className="text-sm text-gray-600">
                      Started: {formatDistanceToNow(new Date(activity.started_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : 'secondary'}
                      className={cn(
                        activity.status === 'running' && "bg-blue-100 text-blue-800",
                        activity.status === 'failed' && "bg-red-100 text-red-800"
                      )}
                    >
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.completed_at ? formatDistanceToNow(new Date(activity.completed_at), { addSuffix: true }) : 'In progress'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patients Summary */}
      {patientsData && (
        <Card>
          <CardHeader>
            <CardTitle>Patients Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{patientsData.total_active_patients}</p>
                  <p className="text-gray-600">Active patients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{patientsData.patient_details_count || 0}</p>
                  <p className="text-gray-600">Detailed records</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">{patientsData.avg_recent_appointments.toFixed(1)}</p>
                  <p className="text-gray-500">Avg recent appointments</p>
                </div>
                <div>
                  <p className="font-medium">{patientsData.avg_upcoming_appointments.toFixed(1)}</p>
                  <p className="text-gray-500">Avg upcoming appointments</p>
                </div>
                <div>
                  <p className="font-medium">{patientsData.avg_total_appointments.toFixed(1)}</p>
                  <p className="text-gray-500">Avg total appointments</p>
                </div>
              </div>
              
              {isPatientsLoading && (
                <LoadingSpinner />
              )}
              {patientsError && (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  Error loading patients
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 