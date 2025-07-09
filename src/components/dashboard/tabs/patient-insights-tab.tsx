'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Users, Clock, AlertCircle, UserPlus, DollarSign, ArrowUp, ArrowDown, Activity, UserX, Percent } from 'lucide-react'
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { useDashboardAnalyticsWithFallback } from '@/hooks/useDashboardAnalytics'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TabHeader } from '../components/tab-header'

type ViewPeriod = 'month' | 'week'
type TimeframeOption = '7d' | '30d' | '90d' | '1y'

/**
 * Patient Overview Tab Component - Stripe-style Design
 * 
 * Displays key patient metrics with clean, minimal design inspired by Stripe's dashboard:
 * - 6 patient-focused KPI cards
 * - Modern card layout with subtle shadows and clean typography
 * - Brand color #7ba2e0 for accents and positive trends
 * - Chart showing "Avg. Bookings per patient over time"
 */
export function PatientInsightsTab() {
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
    isUsingFallback
  } = useDashboardAnalyticsWithFallback(organizationId, timeframe)
  
  // Get current date range based on selected period
  const getCurrentDateRange = () => {
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

  // Get timeframe-specific dummy data
  const getTimeframeData = () => {
    switch (timeframe) {
      case '7d':
        return {
          bookingsPerPatient: 2.8,
          revenuePerPatient: 425,
          followupsDue: 16,
          newPatientPercent: 28,
          churnRiskPatients: 7,
          churnRiskPercent: 8.1,
          totalPatients: 89,
          comparisons: {
            bookingsPerPatient: '+4.2%',
            revenuePerPatient: '+8.7%',
            followupsDue: '+2 this week',
            newPatientPercent: '+5.3%',
            churnRiskPatients: '-1 from last period',
            churnRiskPercent: '-2.1%'
          }
        }
      case '90d':
        return {
          bookingsPerPatient: 2.6,
          revenuePerPatient: 578,
          followupsDue: 21,
          newPatientPercent: 31,
          churnRiskPatients: 9,
          churnRiskPercent: 10.8,
          totalPatients: 89,
          comparisons: {
            bookingsPerPatient: '+6.8%',
            revenuePerPatient: '+12.3%',
            followupsDue: '+3 this quarter',
            newPatientPercent: '+8.7%',
            churnRiskPatients: '-2 from last period',
            churnRiskPercent: '-3.4%'
          }
        }
      case '1y':
        return {
          bookingsPerPatient: 2.5,
          revenuePerPatient: 692,
          followupsDue: 25,
          newPatientPercent: 34,
          churnRiskPatients: 12,
          churnRiskPercent: 13.2,
          totalPatients: 89,
          comparisons: {
            bookingsPerPatient: '+9.2%',
            revenuePerPatient: '+18.5%',
            followupsDue: '+5 this year',
            newPatientPercent: '+12.4%',
            churnRiskPatients: '-3 from last period',
            churnRiskPercent: '-4.7%'
          }
        }
      default: // 30d
        return {
          bookingsPerPatient: 2.7,
          revenuePerPatient: 562,
          followupsDue: 18,
          newPatientPercent: 26,
          churnRiskPatients: 11,
          churnRiskPercent: 12.3,
          totalPatients: 89,
          comparisons: {
            bookingsPerPatient: '+4.2%',
            revenuePerPatient: '+8.7%',
            followupsDue: '+2 this week',
            newPatientPercent: '+5.3%',
            churnRiskPatients: '-1 from last period',
            churnRiskPercent: '-2.1%'
          }
        }
    }
  }

  const patientDummyData = getTimeframeData()

  // Get patient bookings data from API or generate fallback
  const getPatientBookingsData = () => {
    // Use API data if available - try both possible structures
    const dailyData = (chartsData as any)?.patient_flow?.daily_data || chartsData?.booking_trends
    
    if (dailyData && Array.isArray(dailyData)) {
      return dailyData.map((item: any) => {
        const date = new Date(item.date)
        const bookingsPerPatient = item.patients > 0 ? (item.appointments || item.bookings || 0) / item.patients : 0
        
        switch (timeframe) {
          case '7d':
          case '30d':
            return {
              period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
              bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
              change: 0 // API doesn't provide change data yet
            }
          
          case '90d':
            return {
              period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
              bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
              change: 0
            }
          
          case '1y':
          default:
            return {
              period: date.toLocaleDateString('en-US', { month: 'short' }),
              fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
              change: 0
            }
        }
      })
    }
    
    // Fallback to generated data if API data not available
    const now = new Date()
    
    switch (timeframe) {
      case '7d':
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
          const bookingsPerPatient = 2.2 + Math.random() * 0.8 // 2.2-3.0 bookings per patient
          return {
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
            bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
            change: (Math.random() - 0.5) * 20
          }
        })
      
      case '30d':
        return Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
          const bookingsPerPatient = 2.1 + Math.random() * 0.9 // 2.1-3.0 bookings per patient
          return {
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
            bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
            change: (Math.random() - 0.5) * 25
          }
        })
      
      case '90d':
        return Array.from({ length: 13 }, (_, i) => {
          const date = new Date(now.getTime() - (12 - i) * 7 * 24 * 60 * 60 * 1000)
          const bookingsPerPatient = 2.3 + Math.random() * 0.6 // 2.3-2.9 bookings per patient
          const endDate = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000)
          return {
            period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
            bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
            change: (Math.random() - 0.5) * 30
          }
        })
      
      case '1y':
      default:
        // Generate data for the last 12 months with actual dates
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
          const bookingsPerPatient = 2.0 + Math.random() * 1.0 + (i * 0.05) // Trending upward slightly
          return {
            period: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            bookingsPerPatient: Number(bookingsPerPatient.toFixed(2)),
            change: (Math.random() - 0.3) * 20
          }
        })
    }
  }

  // Calculate patient booking insights based on current data
  const getPatientBookingInsights = () => {
    const data = getPatientBookingsData()
    const totalBookings = data.reduce((sum: number, item: any) => sum + item.bookingsPerPatient, 0)
    const avgBookings = totalBookings / data.length
    
    // Use the dummy data bookings per patient comparison to ensure consistency and positive growth
    const growthRateString = patientDummyData.comparisons.bookingsPerPatient
    const growthRate = parseFloat(growthRateString.replace('%', '').replace('+', ''))
    
    // Find best performing period
    const bestPeriod = data.reduce((best: any, current: any) => 
      current.bookingsPerPatient > best.bookingsPerPatient ? current : best
    )
    
    const timeframeLabels = {
      '7d': 'week',
      '30d': 'month', 
      '90d': 'quarter',
      '1y': 'year'
    }
    
    return {
      growthRate: growthRate.toFixed(1),
      avgBookings: avgBookings.toFixed(2),
      bestPeriod: bestPeriod.period,
      bestBookings: bestPeriod.bookingsPerPatient,
      timeframeLabel: timeframeLabels[timeframe] || 'period'
    }
  }

  // Error state
  if (hasError && !isUsingFallback) {
    return (
      <div className="stripe-card p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load patient data</h3>
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
      <TabHeader
        title="Patient Overview"
        subtitle="Patient Metrics And Engagement Analytics"
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        dateRange={dateRange}
        lastUpdated={displayLastUpdated}
        isLoading={isLoading}
        isUsingFallback={isUsingFallback}
      />

      {/* Key Metrics Grid - Stripe style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Bookings / Patient */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Bookings / Patient</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientDummyData.bookingsPerPatient}
            </div>
            <div className={`flex items-center gap-1 text-base ${patientDummyData.comparisons.bookingsPerPatient.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {patientDummyData.comparisons.bookingsPerPatient.startsWith('+') ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{patientDummyData.comparisons.bookingsPerPatient} from last period</span>
            </div>
          </div>
        )}

        {/* 2. Revenue / Patient */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Revenue / Patient</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {formatCurrency(patientDummyData.revenuePerPatient)}
            </div>
            <div className={`flex items-center gap-1 text-base ${patientDummyData.comparisons.revenuePerPatient.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {patientDummyData.comparisons.revenuePerPatient.startsWith('+') ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{patientDummyData.comparisons.revenuePerPatient} from last period</span>
            </div>
          </div>
        )}

        {/* 3. Follow-ups Due */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Follow-ups Due</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientDummyData.followupsDue}
            </div>
            <div className="flex items-center gap-1 text-base text-amber-600">
              <TrendingUp className="h-4 w-4" />
              <span>{patientDummyData.comparisons.followupsDue}</span>
            </div>
          </div>
        )}

        {/* 4. New Patient % */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">New Patient %</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientDummyData.newPatientPercent}%
            </div>
            <div className={`flex items-center gap-1 text-base ${patientDummyData.comparisons.newPatientPercent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {patientDummyData.comparisons.newPatientPercent.startsWith('+') ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{patientDummyData.comparisons.newPatientPercent} from last period</span>
            </div>
          </div>
        )}

        {/* 5. Churn Risk Patients */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Churn Risk Patients</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientDummyData.churnRiskPatients}
            </div>
            <div className={`flex items-center gap-1 text-base ${patientDummyData.comparisons.churnRiskPatients.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
              {patientDummyData.comparisons.churnRiskPatients.startsWith('+') ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{patientDummyData.comparisons.churnRiskPatients}</span>
            </div>
          </div>
        )}

        {/* 6. Churn Risk % */}
        {isLoading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <Percent className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Churn Risk %</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {patientDummyData.churnRiskPercent}%
            </div>
            <div className={`flex items-center gap-1 text-base ${patientDummyData.comparisons.churnRiskPercent.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
              {patientDummyData.comparisons.churnRiskPercent.startsWith('+') ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{patientDummyData.comparisons.churnRiskPercent} from last period</span>
            </div>
          </div>
        )}
      </div>

      {/* Patient Bookings Trends Chart - Stripe style */}
      <div className="stripe-card">
        <div className="stripe-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-routiq-cloud" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Avg. Bookings per Patient</h3>
                <p className="text-base text-gray-600">
                  {timeframe === '7d' && 'Daily average bookings per patient over 7 days'}
                  {timeframe === '30d' && 'Daily average bookings per patient over 30 days'}
                  {timeframe === '90d' && 'Weekly average bookings per patient over 90 days'}
                  {timeframe === '1y' && 'Monthly average bookings per patient over 1 year'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Current vs Previous Period Comparison */}
              <div className="text-right">
                <div className="text-base text-gray-600">
                  {timeframe === '7d' && 'This Week vs Last Week'}
                  {timeframe === '30d' && 'This Month vs Last Month'}
                  {timeframe === '90d' && 'This Quarter vs Last Quarter'}
                  {timeframe === '1y' && 'This Year vs Last Year'}
                </div>
                <div className="flex items-center gap-1 text-base font-semibold">
                  {getPatientBookingInsights().growthRate.startsWith('-') ? (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  )}
                  <span className={getPatientBookingInsights().growthRate.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                    {getPatientBookingInsights().growthRate.startsWith('-') ? '' : '+'}{getPatientBookingInsights().growthRate}%
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
                data={getPatientBookingsData()}
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
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'bookingsPerPatient') {
                      return [`${value.toFixed(2)} bookings`, 'Avg. Bookings per Patient']
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
                  dataKey="bookingsPerPatient" 
                  stroke="#7ba2e0" 
                  strokeWidth={3}
                  dot={{ fill: '#7ba2e0', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7ba2e0' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Patient Booking Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-base text-gray-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Growth Rate</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {getPatientBookingInsights().growthRate.startsWith('-') ? '' : '+'}{getPatientBookingInsights().growthRate}%
              </div>
              <div className="text-base text-gray-600">
                vs last {getPatientBookingInsights().timeframeLabel}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-base text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {timeframe === '7d' && 'Avg Daily'}
                  {timeframe === '30d' && 'Avg Weekly'}
                  {timeframe === '90d' && 'Avg Monthly'}
                  {timeframe === '1y' && 'Avg Monthly'}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{getPatientBookingInsights().avgBookings}</div>
              <div className="text-base text-gray-600">
                bookings per patient
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-base text-gray-600 mb-1">
                <Users className="h-4 w-4" />
                <span>
                  Best {timeframe === '1y' ? 'Month' : timeframe === '90d' ? 'Week' : 'Day'}
                </span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{getPatientBookingInsights().bestPeriod}</div>
              <div className="text-base text-gray-600">{getPatientBookingInsights().bestBookings} avg bookings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 