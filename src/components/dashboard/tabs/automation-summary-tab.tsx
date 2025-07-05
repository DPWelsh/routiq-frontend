'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
  Users
} from 'lucide-react'

/**
 * Automation Summary Tab Component - Simplified Version
 * 
 * Displays exactly what was originally specified:
 * - 7 metrics: Total ROI, Bookings via AI, At-Risk Patients Rebooked, 
 *   Conversion rate, Response time, Admin hours saved, Automation list
 */
export function AutomationSummaryTab() {
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
    <Card className="border-routiq-prompt/20">
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
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load automation data</h3>
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
            Automation Summary
          </h2>
          <p className="text-routiq-blackberry/70 mt-1">
            ROI tracking and automation performance
          </p>
        </div>
      </div>

      {/* Data Freshness Indicator */}
      <div className="flex items-center gap-2 text-sm text-routiq-blackberry/70">
        <span>Last updated: {lastUpdated}</span>
      </div>

      {/* Key Metrics Grid - Exactly 7 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total ROI */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                284%
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Since implementation
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookings via AI */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Bookings via AI
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                156
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                This month
              </div>
            </CardContent>
          </Card>
        )}

        {/* At-Risk Patients Rebooked */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Users className="h-4 w-4" />
                At-Risk Patients Rebooked
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                23
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Retention success
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversion Rate */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                68%
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Enquiry to booking
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Time */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                2.3 hrs
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                Patient response avg
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Hours Saved */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Admin Hours Saved
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                142
              </div>
              <div className="text-sm text-routiq-blackberry/70 mt-1">
                This month
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revenue Impact */}
        {loading ? <MetricSkeleton /> : (
          <Card className="border-routiq-prompt/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-routiq-prompt">
                $23,400
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+18% this month</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Automation List with Checkboxes */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <MessageCircle className="h-5 w-5" />
            Active Automations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-4 h-4 bg-routiq-cloud/20 rounded animate-pulse" />
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-routiq-cloud/20 rounded animate-pulse mb-1" />
                    <div className="w-24 h-3 bg-routiq-cloud/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="appointment-reminder" 
                  checked={true}
                  className="border-routiq-prompt/40 data-[state=checked]:bg-routiq-prompt data-[state=checked]:border-routiq-prompt"
                />
                <div className="flex-1">
                  <label 
                    htmlFor="appointment-reminder" 
                    className="text-sm font-medium text-routiq-core cursor-pointer"
                  >
                    Appointment Reminder
                  </label>
                  <p className="text-xs text-routiq-blackberry/70">
                    1,247 messages sent this month
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="rebooking-reminder" 
                  checked={true}
                  className="border-routiq-prompt/40 data-[state=checked]:bg-routiq-prompt data-[state=checked]:border-routiq-prompt"
                />
                <div className="flex-1">
                  <label 
                    htmlFor="rebooking-reminder" 
                    className="text-sm font-medium text-routiq-core cursor-pointer"
                  >
                    Rebooking Reminder
                  </label>
                  <p className="text-xs text-routiq-blackberry/70">
                    847 follow-ups sent this month
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="payment-reminder" 
                  checked={false}
                  className="border-routiq-prompt/40 data-[state=checked]:bg-routiq-prompt data-[state=checked]:border-routiq-prompt"
                />
                <div className="flex-1">
                  <label 
                    htmlFor="payment-reminder" 
                    className="text-sm font-medium text-routiq-blackberry/70 cursor-pointer"
                  >
                    Payment Reminder
                  </label>
                  <p className="text-xs text-routiq-blackberry/70">
                    Currently disabled
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="treatment-followup" 
                  checked={true}
                  className="border-routiq-prompt/40 data-[state=checked]:bg-routiq-prompt data-[state=checked]:border-routiq-prompt"
                />
                <div className="flex-1">
                  <label 
                    htmlFor="treatment-followup" 
                    className="text-sm font-medium text-routiq-core cursor-pointer"
                  >
                    Treatment Follow-up
                  </label>
                  <p className="text-xs text-routiq-blackberry/70">
                    623 check-ins sent this month
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 