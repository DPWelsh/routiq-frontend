'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  TrendingUp, 
  Heart, 
  AlertTriangle, 
  DollarSign, 
  MessageCircle,
  Calendar,
  ArrowUpRight
} from 'lucide-react'

/**
 * Patient Insights Tab Component - Simplified Version
 * 
 * Displays exactly what was originally specified:
 * - 5 simple metrics
 * - 1 graph (4-week sentiment over time)
 * - 1 quick link (high risk patients list)
 */
export function PatientInsightsTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const lastUpdated = new Date().toLocaleTimeString()

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Simulate retry
    setTimeout(() => setLoading(false), 1000)
  }

  // Loading skeleton for metric card
  const MetricSkeleton = () => (
    <Card className="border-routiq-energy/20">
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
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load patient insights</h3>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-routiq-core">
            Patient Insights
          </h2>
          <p className="text-routiq-blackberry/70 mt-1">
            Key patient metrics and sentiment analysis
          </p>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div className="flex items-center gap-2 text-sm text-routiq-blackberry/70">
        <span>Last updated: {lastUpdated}</span>
      </div>

      {/* Key Metrics Grid - Exactly 5 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Patient Satisfaction */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-energy/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Patient Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-energy">
                4.7/5
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+0.3 this month</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sentiment */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-energy/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-energy">
                68%
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Positive feedback
              </div>
            </CardContent>
          </Card>
        )}

        {/* Avg. Bookings per Patient */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-energy/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Avg. Bookings per Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-energy">
                2.8
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Per month
              </div>
            </CardContent>
          </Card>
        )}

        {/* Avg. Revenue per Patient */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-energy/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Avg. Revenue per Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-energy">
                $1,240
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Monthly average
              </div>
            </CardContent>
          </Card>
        )}

        {/* High-Risk Patients */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                High-Risk Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                7
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Churn risk detected
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sentiment Graph - 4 Week Trend */}
      <Card className="border-routiq-energy/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <TrendingUp className="h-5 w-5" />
            Sentiment Over Last 4 Weeks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 bg-routiq-cloud/5 rounded-lg border border-routiq-cloud/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-routiq-cloud/20 rounded animate-pulse mx-auto mb-2" />
                <div className="w-32 h-4 bg-routiq-cloud/20 rounded animate-pulse mx-auto mb-1" />
                <div className="w-24 h-3 bg-routiq-cloud/20 rounded animate-pulse mx-auto" />
              </div>
            </div>
          ) : (
            <div className="h-48 bg-routiq-energy/5 rounded-lg border border-routiq-energy/20 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-routiq-blackberry/40 mx-auto mb-2" />
                <p className="text-routiq-blackberry/70">
                  4-week sentiment trend chart
                </p>
                <p className="text-sm text-routiq-blackberry/50 mt-1">
                  Coming in Phase 2
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Link - High Risk Patients List */}
      <Card className="border-routiq-prompt/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-routiq-core">High Risk Patients</h4>
              <p className="text-sm text-routiq-blackberry/70 mt-1">
                7 patients need immediate attention
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-routiq-prompt/40 text-routiq-prompt hover:bg-routiq-prompt/10"
            >
              View List
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 