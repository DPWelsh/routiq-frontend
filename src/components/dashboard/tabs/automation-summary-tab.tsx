'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  MessageCircle,
  AlertTriangle,
  Bot,
  Users,
  Activity
} from 'lucide-react'

type TimeframeType = '7d' | '30d' | '90d' | '1y'

/**
 * Automation Summary Tab Component - Stripe-style Design
 * 
 * Displays automation metrics with clean, minimal design:
 * - 7 key metrics: Total ROI, Bookings via AI, At-Risk Patients Rebooked, 
 *   Conversion rate, Response time, Admin hours saved, Automation list
 */
export function AutomationSummaryTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<TimeframeType>('30d')
  
  const lastUpdated = new Date().toLocaleTimeString()

  // Get timeframe-specific data
  const getTimeframeData = () => {
    switch (timeframe) {
      case '7d':
        return {
          hoursSaved: '12 hrs',
          aiBookings: '38',
          executions: '247',
          timeframePeriod: 'This week',
          comparisons: {
            hoursSaved: '+8.5%',
            aiBookings: '+12.3%',
            executions: '+15.2%'
          }
        }
      case '90d':
        return {
          hoursSaved: '142 hrs',
          aiBookings: '468',
          executions: '2,847',
          timeframePeriod: 'This quarter',
          comparisons: {
            hoursSaved: '+18.7%',
            aiBookings: '+24.6%',
            executions: '+22.8%'
          }
        }
      case '1y':
        return {
          hoursSaved: '564 hrs',
          aiBookings: '1,873',
          executions: '11,392',
          timeframePeriod: 'This year',
          comparisons: {
            hoursSaved: '+42.3%',
            aiBookings: '+35.7%',
            executions: '+38.9%'
          }
        }
      default: // 30d
        return {
          hoursSaved: '47 hrs',
          aiBookings: '156',
          executions: '1,124',
          timeframePeriod: 'This month',
          comparisons: {
            hoursSaved: '+12.7%',
            aiBookings: '+16.8%',
            executions: '+18.4%'
          }
        }
    }
  }

  const data = getTimeframeData()

  // Get current date range display
  const getCurrentDateRange = () => {
    const now = new Date()
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
    
    switch (timeframe) {
      case '7d':
        const weekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
        return `${formatDate(weekStart)} - ${formatDate(now)}`
      
      case '30d':
        const monthStart = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
        return `${formatDate(monthStart)} - ${formatDate(now)}`
      
      case '90d':
        const quarterStart = new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000)
        return `${formatDate(quarterStart)} - ${formatDate(now)}`
      
      case '1y':
        const yearStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        return `${formatDate(yearStart)} - ${formatDate(now)}`
      
      default:
        return ''
    }
  }

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Simulate retry
    setTimeout(() => setLoading(false), 1000)
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

  // Error state
  if (error) {
    return (
      <div className="stripe-card p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load automation data</h3>
        <p className="text-base text-gray-600 mb-4">Please check your connection and try again</p>
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
          <h2 className="text-3xl font-semibold text-gray-900">
            Automation Overview
          </h2>
          <p className="text-lg text-gray-600 mt-1">
            Automation Performance Analytics
          </p>
        </div>
        
        {/* Timeframe Toggle - Stripe style */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={timeframe === '7d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimeframe('7d')}
            className={`px-4 py-2 text-base font-medium ${
              timeframe === '7d' 
                ? 'bg-routiq-cloud text-white hover:bg-routiq-cloud/90' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            7 Days
          </Button>
          <Button
            variant={timeframe === '30d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimeframe('30d')}
            className={`px-4 py-2 text-base font-medium ${
              timeframe === '30d' 
                ? 'bg-routiq-cloud text-white hover:bg-routiq-cloud/90' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            30 Days
          </Button>
          <Button
            variant={timeframe === '90d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimeframe('90d')}
            className={`px-4 py-2 text-base font-medium ${
              timeframe === '90d' 
                ? 'bg-routiq-cloud text-white hover:bg-routiq-cloud/90' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            90 Days
          </Button>
          <Button
            variant={timeframe === '1y' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimeframe('1y')}
            className={`px-4 py-2 text-base font-medium ${
              timeframe === '1y' 
                ? 'bg-routiq-cloud text-white hover:bg-routiq-cloud/90' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Date Range Display */}
      <div className="text-center text-base text-gray-600">
        {getCurrentDateRange()}
      </div>

      {/* Data Freshness Indicator */}
      <div className="flex items-center gap-2 text-base text-gray-600">
        <span>Last updated: {lastUpdated}</span>
      </div>

      {/* Key Metrics Grid - Stripe style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. AI-Generated Bookings */}
        {loading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">AI-Generated Bookings</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {data.aiBookings}
            </div>
            <div className="flex items-center gap-2 text-base">
              <span className={`font-medium ${
                data.comparisons.aiBookings.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.comparisons.aiBookings}
              </span>
              <span className="text-gray-600">from last period</span>
            </div>
          </div>
        )}

        {/* 2. Hours Saved */}
        {loading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">Hours Saved</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {data.hoursSaved}
            </div>
            <div className="flex items-center gap-2 text-base">
              <span className={`font-medium ${
                data.comparisons.hoursSaved.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.comparisons.hoursSaved}
              </span>
              <span className="text-gray-600">from last period</span>
            </div>
          </div>
        )}

        {/* 3. No. Executions */}
        {loading ? <MetricSkeleton /> : (
          <div className="stripe-metric-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-routiq-cloud/10 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-routiq-cloud" />
              </div>
              <h3 className="text-base font-medium text-gray-600">No. Executions</h3>
            </div>
            <div className="text-3xl font-semibold text-gray-900 mb-2">
              {data.executions}
            </div>
            <div className="flex items-center gap-2 text-base">
              <span className={`font-medium ${
                data.comparisons.executions.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.comparisons.executions}
              </span>
              <span className="text-gray-600">from last period</span>
            </div>
          </div>
        )}
      </div>

      {/* Automation Performance Table - Stripe style */}
      <div className="stripe-card">
        <div className="stripe-card-header">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="h-6 w-6 text-routiq-cloud" />
            Automation Performance
          </h3>
        </div>
        <div className="stripe-card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-0 text-base font-semibold text-gray-900">
                    Automation Type
                  </th>
                  <th className="text-left py-4 px-4 text-base font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-base font-semibold text-gray-900">
                    Bookings
                  </th>
                  <th className="text-right py-4 px-4 text-base font-semibold text-gray-900">
                    Time Saved (hrs/month)
                  </th>
                  <th className="text-right py-4 px-4 text-base font-semibold text-gray-900">
                    No. Executions
                  </th>
                  <th className="text-right py-4 px-0 text-base font-semibold text-gray-900">
                    Patients Reached
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-0 text-base font-medium text-gray-900">
                    Follow-Up Automation
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-base font-semibold text-routiq-cloud">
                    +73
                  </td>
                  <td className="py-4 px-4 text-right text-base text-gray-900">
                    6
                  </td>
                  <td className="py-4 px-4 text-right text-base text-gray-900">
                    287
                  </td>
                  <td className="py-4 px-0 text-right text-base text-gray-900">
                    142
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-0 text-base font-medium text-gray-900">
                    Cancellation Recovery
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-base font-semibold text-routiq-cloud">
                    +26
                  </td>
                  <td className="py-4 px-4 text-right text-base text-gray-900">
                    4
                  </td>
                  <td className="py-4 px-4 text-right text-base text-gray-900">
                    156
                  </td>
                  <td className="py-4 px-0 text-right text-base text-gray-900">
                    89
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-0 text-base font-medium text-gray-900">
                    Booking Reminders
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-base font-semibold text-routiq-cloud">
                    +41
                  </td>
                  <td className="py-4 px-4 text-right text-base text-gray-900">
                    9
                  </td>
                  <td className="py-4 px-4 text-right text-base text-gray-900">
                    431
                  </td>
                  <td className="py-4 px-0 text-right text-base text-gray-900">
                    217
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 