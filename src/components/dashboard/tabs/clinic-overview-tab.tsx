'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Users, Clock, AlertCircle, UserPlus, DollarSign } from 'lucide-react'
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { useDashboardAnalyticsWithFallback } from '@/hooks/useDashboardAnalytics'

type ViewPeriod = 'month' | 'week'
type TimeframeOption = '7d' | '30d' | '90d' | '1y'

/**
 * Clinic Overview Tab Component - Integrated with Real Backend Data
 * 
 * Displays key metrics with real data from backend analytics API:
 * - Total Bookings (real: 294, was hardcoded: 247)
 * - Active Patients (real: 36, was hardcoded: 89)
 * - Total Patients (real: 651, was hardcoded: 89)
 * - Total Revenue (real: $44,100, was not displayed)
 * - ROI (real: 35.48%, was hardcoded: 284%)
 */
export function ClinicOverviewTab() {
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('month')
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30d')
  
  // Get organization context
  const { organizationId } = useOrganizationContext()
  
  // Get real analytics data with fallback to hardcoded values
  const {
    analyticsData,
    isLoading,
    hasError,
    analyticsError,
    refetchAnalytics,
    bookingMetrics,
    patientMetrics,
    financialMetrics,
    automationMetrics,
    lastUpdated,
    isUsingFallback
  } = useDashboardAnalyticsWithFallback(organizationId, timeframe)
  
  // Get current date range based on selected period
  const getCurrentDateRange = () => {
    const now = new Date()
    if (viewPeriod === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return {
        start: monthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: monthEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    } else {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return {
        start: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        end: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    }
  }

  const dateRange = getCurrentDateRange()
  const displayLastUpdated = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString()
    : new Date().toLocaleTimeString()

  const handleRetry = () => {
    refetchAnalytics()
  }

  const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
    setTimeframe(newTimeframe)
  }

  // Loading skeleton for metric card
  const MetricSkeleton = () => (
    <Card className="border-routiq-cloud/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-routiq-cloud/20 rounded animate-pulse" />
          <div className="w-24 h-4 bg-routiq-cloud/20 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-16 h-8 bg-routiq-cloud/20 rounded animate-pulse mb-2" />
        <div className="w-20 h-4 bg-routiq-cloud/20 rounded animate-pulse" />
      </CardContent>
    </Card>
  )

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percentage values
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Calculate daily average based on timeframe
  const calculateDailyAverage = () => {
    if (!bookingMetrics?.total_bookings) return '0.0'
    
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
    return (bookingMetrics.total_bookings / days).toFixed(1)
  }

  // Error state
  if (hasError && !isUsingFallback) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load clinic data</h3>
          <p className="text-red-600 mb-4">
            {analyticsError?.message || 'Please check your connection and try again'}
          </p>
          <Button 
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Month/Week Toggle and Data Freshness */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-routiq-core">
            Clinic Overview
          </h2>
          <p className="text-routiq-blackberry/70 flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            {dateRange.start} - {dateRange.end}
          </p>
          {isUsingFallback && (
            <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Using fallback data
            </p>
          )}
        </div>
        
        {/* Timeframe Toggle */}
        <div className="flex items-center gap-2 bg-routiq-cloud/10 p-1 rounded-lg">
          <Button
            variant={timeframe === '7d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTimeframeChange('7d')}
            className={`
              ${timeframe === '7d' 
                ? 'bg-routiq-core text-white shadow-sm' 
                : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-white'
              }
            `}
          >
            7 Days
          </Button>
          <Button
            variant={timeframe === '30d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTimeframeChange('30d')}
            className={`
              ${timeframe === '30d' 
                ? 'bg-routiq-core text-white shadow-sm' 
                : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-white'
              }
            `}
          >
            30 Days
          </Button>
          <Button
            variant={timeframe === '90d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTimeframeChange('90d')}
            className={`
              ${timeframe === '90d' 
                ? 'bg-routiq-core text-white shadow-sm' 
                : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-white'
              }
            `}
          >
            90 Days
          </Button>
          <Button
            variant={timeframe === '1y' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTimeframeChange('1y')}
            className={`
              ${timeframe === '1y' 
                ? 'bg-routiq-core text-white shadow-sm' 
                : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-white'
              }
            `}
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div className="flex items-center gap-2 text-sm text-routiq-blackberry/70">
        <span>Last updated: {displayLastUpdated}</span>
        {isLoading && (
          <Badge variant="outline" className="text-xs">
            Refreshing...
          </Badge>
        )}
      </div>

      {/* Key Metrics Grid - Real Data from Backend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Bookings - REAL DATA */}
        {isLoading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {bookingMetrics?.total_bookings || 0}
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>{formatPercentage(bookingMetrics?.period_comparison || 0)} from last period</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Patients - REAL DATA */}
        {isLoading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {patientMetrics?.total_patients || 0}
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                In organization
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Patients - REAL DATA */}
        {isLoading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {patientMetrics?.active_patients || 0}
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Currently engaged
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Patients - REAL DATA */}
        {isLoading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                New Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {patientMetrics?.new_patients || 0}
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                In {timeframe}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Revenue - REAL DATA */}
        {isLoading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {formatCurrency(financialMetrics?.total_revenue || 0)}
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Avg: {formatCurrency(financialMetrics?.avg_revenue_per_patient || 0)}/patient
              </div>
            </CardContent>
          </Card>
        )}

        {/* ROI - REAL DATA */}
        {isLoading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {formatPercentage(automationMetrics?.total_roi || 0)}
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Efficiency: {formatPercentage(automationMetrics?.efficiency_score || 0)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 