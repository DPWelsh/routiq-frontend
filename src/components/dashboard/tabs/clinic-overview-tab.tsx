'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react'

type ViewPeriod = 'month' | 'week'

/**
 * Clinic Overview Tab Component
 * 
 * Displays key clinic metrics with Month/Week toggle:
 * - Booking metrics and trends
 * - Active patient counts
 * - Daily averages and performance indicators
 * - Live data indicators showing real-time updates
 */
export function ClinicOverviewTab() {
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('month')
  
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

  return (
    <div className="space-y-6">
      {/* Header with Month/Week Toggle */}
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

      {/* Live Data Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-routiq-blackberry/70">Live data</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
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

        {/* Active Patients */}
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
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+5 new patients</span>
            </div>
          </CardContent>
        </Card>

        {/* Daily Average */}
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
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              bookings per day
            </div>
          </CardContent>
        </Card>

        {/* Missed Appointments */}
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
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              4.9% of total bookings
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends Section */}
      <Card className="border-routiq-cloud/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <TrendingUp className="h-5 w-5" />
            Booking Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart Placeholder */}
            <div className="h-48 bg-routiq-cloud/5 rounded-lg border border-routiq-cloud/20 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-routiq-blackberry/40 mx-auto mb-2" />
                <p className="text-routiq-blackberry/70">
                  Interactive booking trends chart
                </p>
                <p className="text-sm text-routiq-blackberry/50 mt-1">
                  Coming in Phase 2
                </p>
              </div>
            </div>

            {/* Trend Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Peak Hours</p>
                  <p className="text-sm text-green-600">9 AM - 11 AM showing highest bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Growth Trend</p>
                  <p className="text-sm text-blue-600">Steady 12% increase in bookings</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-routiq-cloud/20">
        <CardHeader>
          <CardTitle className="text-routiq-core">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-routiq-cloud/40 text-routiq-blackberry hover:bg-routiq-cloud/10">
              View Full Calendar
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-cloud/40 text-routiq-blackberry hover:bg-routiq-cloud/10">
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-cloud/40 text-routiq-blackberry hover:bg-routiq-cloud/10">
              Manage Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 