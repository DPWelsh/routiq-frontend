'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Users, Clock, AlertCircle, UserPlus, DollarSign, ArrowUp, ArrowDown, Activity } from 'lucide-react'
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { useDashboardAnalyticsWithFallback } from '@/hooks/useDashboardAnalytics'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type ViewPeriod = 'month' | 'week'
type TimeframeOption = '7d' | '30d' | '90d' | '1y'

/**
 * Clinic Overview Tab Component - Stripe-style Design
 * 
 * Displays key metrics with clean, minimal design inspired by Stripe's dashboard:
 * - Total Bookings, Active Patients, Total Patients, Revenue, ROI
 * - Modern card layout with subtle shadows and clean typography
 * - Brand color #7ba2e0 for accents and positive trends
 */
export function ClinicOverviewTab() {
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('month')
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30d')
  
  // Get organization context
  const { organizationId } = useOrganizationContext()
  
  // Get real analytics data with fallback to hardcoded values
  const {
    analyticsData,
    chartsData,
    isLoading,
    hasError,
    analyticsError,
    refetchAnalytics,
    bookingMetrics,
    patientMetrics,
    financialMetrics,
    automationMetrics,
    lastUpdated,
    isUsingFallback,
    testClinicOverview
  } = useDashboardAnalyticsWithFallback(organizationId, timeframe)
  
  // Get current date range based on selected period
  const getCurrentDateRange = () => {
    const now = new Date()
    const endDate = now.toISOString().split('T')[0]
    
    let startDate: string
    let displayRange: string
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        displayRange = 'Last 7 days'
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        displayRange = 'Last 30 days'
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        displayRange = 'Last 90 days'
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        displayRange = 'Last year'
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        displayRange = 'Last 30 days'
    }
    
    return { startDate, endDate, displayRange }
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

  // Loading skeleton for metric card - Stripe style
  const MetricSkeleton = () => (
    <div className="stripe-metric-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="w-20 h-8 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
    </div>
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

  // Get percentage change with proper formatting and trend icon
  const getPercentageChange = (value: number | null | undefined, fallback: string = '+0.0%') => {
    if (value === null || value === undefined) return { text: fallback, isPositive: true }
    
    const isPositive = value >= 0
    const formattedValue = `${isPositive ? '+' : ''}${value.toFixed(1)}%`
    return { text: formattedValue, isPositive }
  }

  // Extract metrics from test clinic overview data
  const getMetricsFromTestData = () => {
    if (!testClinicOverview?.metrics) return null
    
    const metrics = testClinicOverview.metrics
    return {
      bookings_change: getPercentageChange(metrics.bookings_change_percent),
      new_patients_change: getPercentageChange(metrics.new_patients_change_percent),
      total_patients_change: getPercentageChange(metrics.total_patients_change_percent),
      active_patients_change: getPercentageChange(metrics.active_patients_change_percent),
      missed_appointments_change: getPercentageChange(metrics.missed_appointments_change_percent),
      revenue_change: getPercentageChange(metrics.revenue_change_percent),
      missed_appointments_count: metrics.missed_appointments || 0
    }
  }

  const metricsChanges = getMetricsFromTestData()

  // Calculate daily average based on timeframe
  const calculateDailyAverage = () => {
    if (!bookingMetrics?.total_bookings) return '0.0'
    
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
    return (bookingMetrics.total_bookings / days).toFixed(1)
  }

  // Get revenue data from API or generate fallback
  const getRevenueData = () => {
    // Use API data if available - try both possible structures
    const dailyData = (chartsData as any)?.revenue_trends?.daily_data || chartsData?.booking_trends
    
    if (dailyData && Array.isArray(dailyData)) {
      return dailyData.map((item: any) => {
        const date = new Date(item.date)
        const revenue = item.revenue || item.bookings || 0
        
        switch (timeframe) {
          case '7d':
          case '30d':
            return {
              period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
              revenue: revenue,
              change: 0 // API doesn't provide change data yet
            }
          
          case '90d':
            return {
              period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
              revenue: revenue,
              change: 0
            }
          
          case '1y':
          default:
            return {
              period: date.toLocaleDateString('en-US', { month: 'short' }),
              fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              revenue: revenue,
              change: 0
            }
        }
      })
    }
    
    // Demo account fallback data - more realistic healthcare clinic revenue
    const now = new Date()
    
    switch (timeframe) {
      case '7d':
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
          // Daily revenue: $4,200-$5,800 (higher for mid-week)
          const dayOfWeek = date.getDay()
          const midWeekBonus = (dayOfWeek >= 2 && dayOfWeek <= 4) ? 800 : 0
          const baseRevenue = 4200 + midWeekBonus + Math.sin(i * 0.5) * 400
          // Use deterministic "randomness" based on index
          const deterministicChange = (Math.sin(i * 1.7) - 0.3) * 15
          return {
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
            revenue: Math.round(baseRevenue),
            change: deterministicChange
          }
        })
      
      case '30d':
        return Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
          // Daily revenue: $3,800-$5,200 with growth trend
          const baseRevenue = 3800 + (i * 15) + Math.sin(i * 0.3) * 600
          // Use deterministic "randomness" based on index
          const deterministicChange = (Math.sin(i * 1.3) - 0.2) * 20
          return {
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
            revenue: Math.round(baseRevenue),
            change: deterministicChange
          }
        })
      
      case '90d':
        return Array.from({ length: 13 }, (_, i) => {
          const date = new Date(now.getTime() - (12 - i) * 7 * 24 * 60 * 60 * 1000)
          // Weekly revenue: $28,000-$36,000 with seasonal variation
          const baseRevenue = 28000 + (i * 400) + Math.sin(i * 0.4) * 4000
          const endDate = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000)
          // Use deterministic "randomness" based on index
          const deterministicChange = (Math.sin(i * 1.1) - 0.15) * 25
          return {
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
            revenue: Math.round(baseRevenue),
            change: deterministicChange
          }
        })
      
      case '1y':
      default:
        // Monthly revenue: $95,000-$135,000 with growth trend
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
          // Seasonal pattern: higher in Jan-Mar, lower in summer, pickup in fall
          const seasonalMultiplier = 1 + 0.2 * Math.sin((i + 1) * Math.PI / 6)
          const baseRevenue = 95000 + (i * 2800) + (seasonalMultiplier * 15000)
          // Use deterministic "randomness" based on index
          const deterministicChange = (Math.sin(i * 0.9) - 0.1) * 18
          return {
            period: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            revenue: Math.round(baseRevenue),
            change: deterministicChange
          }
        })
    }
  }

  // Calculate revenue insights based on current data
  const getRevenueInsights = () => {
    const data = getRevenueData()
    const currentRevenue = data[data.length - 1]?.revenue || 0
    const previousRevenue = data[data.length - 2]?.revenue || 0
    const totalRevenue = data.reduce((sum: number, item: any) => sum + item.revenue, 0)
    const avgRevenue = totalRevenue / data.length
    
    const growthRate = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
    
    // Find best performing period
    const bestPeriod = data.reduce((best: any, current: any) => 
      current.revenue > best.revenue ? current : best
    )
    
    const timeframeLabels = {
      '7d': 'week',
      '30d': 'month', 
      '90d': 'quarter',
      '1y': 'year'
    }
    
    return {
      growthRate: growthRate.toFixed(1),
      avgRevenue: Math.round(avgRevenue),
      bestPeriod: bestPeriod.period,
      bestRevenue: bestPeriod.revenue,
      timeframeLabel: timeframeLabels[timeframe] || 'period'
    }
  }

  // Error state - Only show error if the main analytics/test clinic overview fails
  // Charts failure is expected and handled gracefully
  if (analyticsError && !testClinicOverview) {
    return (
      <div className="stripe-card p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load clinic data</h3>
        <p className="text-base text-gray-600 mb-4">
          {analyticsError?.message || 'Please check your connection and try again'}
        </p>
        <Button 
          onClick={handleRetry}
          className="stripe-button stripe-button-primary px-4 py-2"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Timeframe Controls - Stripe style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Clinic Overview
          </h2>
          <p className="text-base text-gray-600 mt-1">
            Performance Metrics For Your Healthcare Practice
          </p>
          {isUsingFallback && (
            <p className="text-amber-600 text-base mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Using demo data
            </p>
          )}
        </div>
        
        {/* Timeframe Toggle - Stripe style */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={timeframe === '7d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleTimeframeChange('7d')}
            className={`
              h-8 px-3 text-sm font-medium transition-colors
              ${timeframe === '7d' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
              h-8 px-3 text-sm font-medium transition-colors
              ${timeframe === '30d' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
              h-8 px-3 text-sm font-medium transition-colors
              ${timeframe === '90d' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
              h-8 px-3 text-sm font-medium transition-colors
              ${timeframe === '1y' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Date Range Display */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-base text-gray-600">
        <div className="font-medium">
          {(() => {
            const now = new Date()
            const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: timeframe === '1y' ? 'numeric' : undefined 
            })
            
            let startDate: Date
            switch (timeframe) {
              case '7d':
                startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
                break
              case '30d':
                startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
                break
              case '90d':
                startDate = new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000)
                break
              case '1y':
                startDate = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000)
                break
              default:
                startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
            }
            
            return `${formatDate(startDate)} - ${formatDate(now)}`
          })()}
        </div>
        <div className="flex items-center gap-2">
          <span>Last updated: {displayLastUpdated}</span>
          {isLoading && (
            <Badge variant="outline" className="text-sm text-routiq-cloud border-routiq-cloud">
              Refreshing...
            </Badge>
          )}
        </div>
      </div>

      {/* Key Metrics Grid - Stripe style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Total Bookings */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Total Bookings</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {bookingMetrics?.total_bookings || 0}
            </div>
            <div className={`flex items-center gap-1 text-base ${metricsChanges?.bookings_change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metricsChanges?.bookings_change.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metricsChanges?.bookings_change.text || '+8.2%'} from last period</span>
            </div>
          </div>
        )}

        {/* 2. New Patients */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">New Patients</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientMetrics?.new_patients || 0}
            </div>
            <div className={`flex items-center gap-1 text-base ${metricsChanges?.new_patients_change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metricsChanges?.new_patients_change.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metricsChanges?.new_patients_change.text || '+15.4%'} from last period</span>
            </div>
          </div>
        )}

        {/* 3. Total Patients */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Total Patients</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientMetrics?.total_patients || 0}
            </div>
            <div className={`flex items-center gap-1 text-base ${metricsChanges?.total_patients_change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metricsChanges?.total_patients_change.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metricsChanges?.total_patients_change.text || '+3.7%'} from last period</span>
            </div>
          </div>
        )}

        {/* 4. Active Patients */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Active Patients</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientMetrics?.active_patients || 0}
            </div>
            <div className={`flex items-center gap-1 text-base ${metricsChanges?.active_patients_change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metricsChanges?.active_patients_change.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metricsChanges?.active_patients_change.text || '+6.8%'} from last period</span>
            </div>
          </div>
        )}

        {/* 5. Missed Appointments */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Missed Appointments</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {metricsChanges?.missed_appointments_count || Math.round((bookingMetrics?.total_bookings || 0) * 0.12)}
            </div>
            <div className={`flex items-center gap-1 text-base ${metricsChanges?.missed_appointments_change.isPositive ? 'text-red-600' : 'text-green-600'}`}>
              {metricsChanges?.missed_appointments_change.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metricsChanges?.missed_appointments_change.text || '-2.3%'} from last period</span>
            </div>
          </div>
        )}

        {/* 6. Revenue this [period] */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">
                Revenue this {timeframe === '7d' ? 'Week' : timeframe === '30d' ? 'Month' : timeframe === '90d' ? 'Quarter' : 'Year'}
              </h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {formatCurrency(financialMetrics?.total_revenue || 0)}
            </div>
            <div className={`flex items-center gap-1 text-base ${metricsChanges?.revenue_change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metricsChanges?.revenue_change.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{metricsChanges?.revenue_change.text || '+12.5%'} from last period</span>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Trends Chart - Stripe style */}
      <div className="stripe-card">
        <div className="stripe-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-routiq-cloud" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Revenue Trends</h3>
                <p className="text-base text-gray-600">
                  {timeframe === '7d' && 'Daily revenue performance over 7 days'}
                  {timeframe === '30d' && 'Daily revenue performance over 30 days'}
                  {timeframe === '90d' && 'Weekly revenue performance over 90 days'}
                  {timeframe === '1y' && 'Monthly revenue performance over 1 year'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Current vs Previous Period Comparison */}
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {timeframe === '7d' && 'This Week vs Last Week'}
                  {timeframe === '30d' && 'This Month vs Last Month'}
                  {timeframe === '90d' && 'This Quarter vs Last Quarter'}
                  {timeframe === '1y' && 'This Year vs Last Year'}
                </div>
                <div className="flex items-center gap-1 text-base font-semibold">
                  {getRevenueInsights().growthRate.startsWith('-') ? (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  )}
                  <span className={getRevenueInsights().growthRate.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                    {getRevenueInsights().growthRate.startsWith('-') ? '' : '+'}{getRevenueInsights().growthRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="stripe-card-content">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getRevenueData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') {
                      return [`$${value.toLocaleString()}`, 'Revenue']
                    }
                    return [value, name]
                  }}
                  labelFormatter={(label, payload) => {
                    // Use the fullDate field for better tooltip labels
                    if (payload && payload.length > 0 && payload[0].payload.fullDate) {
                      return payload[0].payload.fullDate
                    }
                    return label
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#7ba2e0" 
                  strokeWidth={3}
                  dot={{ fill: '#7ba2e0', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7ba2e0' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Revenue Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Growth Rate</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {getRevenueInsights().growthRate.startsWith('-') ? '' : '+'}{getRevenueInsights().growthRate}%
              </div>
              <div className="text-sm text-gray-600">
                vs last {getRevenueInsights().timeframeLabel}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span>
                  {timeframe === '7d' && 'Avg Daily'}
                  {timeframe === '30d' && 'Avg Daily'}
                  {timeframe === '90d' && 'Avg Weekly'}
                  {timeframe === '1y' && 'Avg Monthly'}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{formatCurrency(getRevenueInsights().avgRevenue)}</div>
              <div className="text-sm text-gray-600">
                over {timeframe === '1y' ? '12 months' : timeframe === '90d' ? '13 weeks' : timeframe === '30d' ? '30 days' : '7 days'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Best {timeframe === '1y' ? 'Month' : timeframe === '90d' ? 'Week' : 'Day'}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{getRevenueInsights().bestPeriod}</div>
              <div className="text-sm text-gray-600">{formatCurrency(getRevenueInsights().bestRevenue)} revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 