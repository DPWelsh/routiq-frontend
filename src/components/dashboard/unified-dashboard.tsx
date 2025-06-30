'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Activity, RefreshCw, Zap, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { useDashboardData, usePatientsData, useSyncMutation } from '@/hooks/useDashboardData'
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
  }, [hasActiveSyncs, refetchDashboard])

  const handleManualRefresh = async () => {
    await refetchDashboard()
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

  // Error State
  if (dashboardError) {
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

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold">
                  {summary?.total_patients || 0}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {summary?.sync_percentage || 0}% synced
                  </Badge>
                  {summary?.last_sync_time && (
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(summary.last_sync_time), { 
                        addSuffix: true 
                      })}
                    </p>
                  )}
                </div>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Patients
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {summary?.active_patients || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {summary?.engagement_rate || 0}% engagement rate
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Appointments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary?.total_upcoming_appointments || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {summary?.patients_with_upcoming || 0} patients
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recent Appointments
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {summary?.total_recent_appointments || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {summary?.patients_with_recent || 0} patients
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Progress */}
      {summary?.sync_percentage !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle>Data Synchronization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sync Progress</span>
                <span className="text-sm font-medium">{summary.sync_percentage}%</span>
              </div>
              <Progress value={summary.sync_percentage} className="h-2" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{summary.synced_patients} patients synced</span>
                <span>
                  Last sync: {summary.last_sync_time ? 
                    formatDistanceToNow(new Date(summary.last_sync_time), { addSuffix: true }) : 
                    'Never'
                  }
                </span>
              </div>
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
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-600">
                      {activity.records_success} / {activity.records_processed} processed
                      {activity.records_failed > 0 && (
                        <span className="text-red-600 ml-2">
                          • {activity.records_failed} failed
                        </span>
                      )}
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
                      {activity.minutes_ago} min ago
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{patientsData.total_count}</p>
                <p className="text-gray-600">Total patients in system</p>
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