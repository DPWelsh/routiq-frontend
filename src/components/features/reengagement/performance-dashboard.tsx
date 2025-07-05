'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Phone, 
  Mail, 
  MessageSquare, 
  Target,
  Clock,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { usePerformanceMetrics } from '@/hooks/useReengagementData'
import LoadingSpinner from '@/components/magicui/loading-spinner'

interface PerformanceDashboardProps {
  organizationId: string
  timeframe?: 'last_7_days' | 'last_30_days' | 'last_90_days'
}

export function PerformanceDashboard({ 
  organizationId, 
  timeframe = 'last_30_days' 
}: PerformanceDashboardProps) {
  const { data: performanceData, isLoading, error } = usePerformanceMetrics(organizationId, timeframe)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Loading performance metrics...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !performanceData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Unable to load performance metrics</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle the nested structure from backend API
  const performanceMetrics = performanceData.performance_metrics || {}
  const contactMetrics = performanceMetrics.contact_metrics || {}
  const appointmentMetrics = performanceMetrics.appointment_metrics || {}
  const engagementHealth = performanceMetrics.engagement_health || {}

  // Create compatible structure for the component
  const reengagement_metrics = {
    contact_success_rate: contactMetrics.contact_rate_percent || 0,
    conversion_rate: appointmentMetrics.avg_attendance_rate || 0,
    outreach_attempts: performanceMetrics.total_patients || 0,
    avg_days_to_reengage: 14, // Static fallback
    successful_contacts: engagementHealth.currently_active || 0,
    appointments_scheduled: appointmentMetrics.upcoming_appointments || 0,
  }

  // Mock communication channels since backend doesn't provide this yet
  const communication_channels = {
    sms: {
      response_rate: 72,
      sent: 100,
      delivered: 98,
      responded: 72,
    },
    email: {
      response_rate: 15,
      sent: 100,
      opened: 38,
      responded: 15,
    },
    phone: {
      conversion_rate: 35,
      attempted: 100,
      connected: 45,
      appointment_booked: 35,
    },
  }

  const benchmark_comparison = {
    our_performance: reengagement_metrics.contact_success_rate > 55 ? 'above_average' : 'below_average' as const,
    industry_avg_contact_rate: '55.0',
    industry_avg_conversion: '22.0',
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'above_average':
        return 'text-green-600'
      case 'below_average':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'above_average':
        return <TrendingUp className="h-4 w-4" />
      case 'below_average':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contact Success Rate</p>
                <p className="text-2xl font-bold">{reengagement_metrics.contact_success_rate.toFixed(1)}%</p>
                <div className={`flex items-center gap-1 text-xs ${getPerformanceColor(benchmark_comparison.our_performance)}`}>
                  {getPerformanceIcon(benchmark_comparison.our_performance)}
                  <span>vs {benchmark_comparison.industry_avg_contact_rate}% industry</span>
                </div>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{reengagement_metrics.conversion_rate.toFixed(1)}%</p>
                <div className={`flex items-center gap-1 text-xs ${getPerformanceColor(benchmark_comparison.our_performance)}`}>
                  {getPerformanceIcon(benchmark_comparison.our_performance)}
                  <span>vs {benchmark_comparison.industry_avg_conversion}% industry</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outreach Attempts</p>
                <p className="text-2xl font-bold">{reengagement_metrics.outreach_attempts}</p>
                <p className="text-xs text-gray-500">Last {timeframe.replace('last_', '').replace('_', ' ')}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Days to Reengage</p>
                <p className="text-2xl font-bold">{reengagement_metrics.avg_days_to_reengage.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Average timeline</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* SMS Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span className="font-medium">SMS</span>
                  <Badge variant="outline">{communication_channels.sms.response_rate.toFixed(1)}% response rate</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {communication_channels.sms.responded}/{communication_channels.sms.sent} responded
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Delivery Rate</span>
                  <span>{((communication_channels.sms.delivered / communication_channels.sms.sent) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(communication_channels.sms.delivered / communication_channels.sms.sent) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Email Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Email</span>
                  <Badge variant="outline">{communication_channels.email.response_rate.toFixed(1)}% response rate</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {communication_channels.email.responded}/{communication_channels.email.sent} responded
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Open Rate</span>
                  <span>{((communication_channels.email.opened / communication_channels.email.sent) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(communication_channels.email.opened / communication_channels.email.sent) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Phone Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Phone</span>
                  <Badge variant="outline">{communication_channels.phone.conversion_rate.toFixed(1)}% conversion rate</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {communication_channels.phone.appointment_booked}/{communication_channels.phone.attempted} booked
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Connection Rate</span>
                  <span>{((communication_channels.phone.connected / communication_channels.phone.attempted) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(communication_channels.phone.connected / communication_channels.phone.attempted) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Reengagement Success Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">
                {reengagement_metrics.successful_contacts}
              </div>
              <div className="text-sm text-green-600">Successful Contacts</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">
                {reengagement_metrics.appointments_scheduled}
              </div>
              <div className="text-sm text-blue-600">Appointments Scheduled</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">
                {benchmark_comparison.our_performance === 'above_average' ? '↗️' : 
                 benchmark_comparison.our_performance === 'below_average' ? '↘️' : '→'}
              </div>
              <div className="text-sm text-purple-600 capitalize">
                {benchmark_comparison.our_performance.replace('_', ' ')} Performance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 