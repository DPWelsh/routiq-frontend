'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Users, Clock, AlertCircle, UserPlus } from 'lucide-react'

type ViewPeriod = 'month' | 'week'

/**
 * Clinic Overview Tab Component - Simplified Version
 * 
 * Displays exactly 5 key metrics as originally specified:
 * - Total Bookings
 * - Active Patients  
 * - New Patients (+ % change)
 * - Missed Appointments (+ % change)
 * - Daily Booking Average (7 day trend)
 */
export function ClinicOverviewTab() {
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('month')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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
  const lastUpdated = new Date().toLocaleTimeString()

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Simulate retry
    setTimeout(() => setLoading(false), 1000)
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

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load clinic data</h3>
          <p className="text-red-600 mb-4">Please check your connection and try again</p>
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
        </div>
        
        {/* Month/Week Toggle */}
        <div className="flex items-center gap-2 bg-routiq-cloud/10 p-1 rounded-lg">
          <Button
            variant={viewPeriod === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewPeriod('month')}
            className={`
              ${viewPeriod === 'month' 
                ? 'bg-routiq-core text-white shadow-sm' 
                : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-white'
              }
            `}
          >
            Month View
          </Button>
          <Button
            variant={viewPeriod === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewPeriod('week')}
            className={`
              ${viewPeriod === 'week' 
                ? 'bg-routiq-core text-white shadow-sm' 
                : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-white'
              }
            `}
          >
            Week View
          </Button>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div className="flex items-center gap-2 text-sm text-routiq-blackberry/70">
        <span>Last updated: {lastUpdated}</span>
      </div>

      {/* Key Metrics Grid - Exactly 5 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Bookings */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                247
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12% from last {viewPeriod}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Patients */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                89
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Currently engaged
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Patients */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                New Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                23
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+15% from last {viewPeriod}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Missed Appointments */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Missed Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                12
              </div>
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-2% from last {viewPeriod}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Booking Average */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-cloud/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Daily Average
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-core">
                {viewPeriod === 'month' ? '8.2' : '11.4'}
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>7-day trend: +5%</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 