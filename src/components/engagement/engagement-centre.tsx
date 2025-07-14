'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Clock, 
  AlertTriangle, 
  CalendarClock,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  RefreshCw,
  Target,
  UserX,
  Star,
  Activity,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react'

type TimeframeType = '7d' | '30d' | '90d'

interface PatientAction {
  id: string
  patientName: string
  lastContact: string
  lastMessageSent: string
  channel: 'whatsapp' | 'sms' | 'email' | 'phone' | 'none'
  status: 'active' | 'at-risk' | 'dormant' | 'needs-followup'
  priority: 'high' | 'medium' | 'low'
  nextBestAction: string
  actionType: 'rebooking' | 'follow-up' | 're-engage' | 'phone-call' | 'check-in'
  daysSinceLastContact: number
  noShows: number
  sentiment: 'positive' | 'neutral' | 'negative'
  ltv: number
  automationTrigger?: string
  timestamp?: string
}

interface RecentAction {
  id: string
  patientName: string
  action: string
  automation: string
  timestamp: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  channel: 'whatsapp' | 'sms' | 'email' | 'phone'
}

/**
 * Engagement Centre Component
 * 
 * Replaces the traditional inbox with smart patient engagement insights:
 * - Top priorities action feed
 * - KPI performance highlights  
 * - Recent patient actions live feed
 */
export function EngagementCentre() {
  const [timeframe, setTimeframe] = useState<TimeframeType>('30d')
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Mock data - in real implementation, this would come from API
  const [patients, setPatients] = useState<PatientAction[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      lastContact: '8 days ago',
      lastMessageSent: 'Follow-up SMS',
      channel: 'sms',
      status: 'needs-followup',
      priority: 'high',
      nextBestAction: 'Send rebooking message',
      actionType: 'rebooking',
      daysSinceLastContact: 8,
      noShows: 1,
      sentiment: 'neutral',
      ltv: 2400,
      automationTrigger: 'No-show follow-up',
      timestamp: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      patientName: 'David Ellis',
      lastContact: '15 days ago',
      lastMessageSent: 'No Contact',
      channel: 'none',
      status: 'dormant',
      priority: 'high',
      nextBestAction: 'Re-engage with offer',
      actionType: 're-engage',
      daysSinceLastContact: 15,
      noShows: 0,
      sentiment: 'positive',
      ltv: 5200,
      automationTrigger: 'Dormant patient re-engagement',
      timestamp: '2024-01-15T13:45:00Z'
    },
    {
      id: '3',
      patientName: 'Leila Brown',
      lastContact: '2 days ago',
      lastMessageSent: 'Chat (via Chatwoot)',
      channel: 'whatsapp',
      status: 'at-risk',
      priority: 'medium',
      nextBestAction: 'Schedule phone call',
      actionType: 'phone-call',
      daysSinceLastContact: 2,
      noShows: 2,
      sentiment: 'negative',
      ltv: 1800,
      automationTrigger: 'At-risk patient intervention',
      timestamp: '2024-01-15T12:15:00Z'
    },
    {
      id: '4',
      patientName: 'Michael Chen',
      lastContact: '1 day ago',
      lastMessageSent: 'Email reminder',
      channel: 'email',
      status: 'active',
      priority: 'low',
      nextBestAction: 'Send appointment confirmation',
      actionType: 'check-in',
      daysSinceLastContact: 1,
      noShows: 0,
      sentiment: 'positive',
      ltv: 3200,
      automationTrigger: 'Appointment confirmation',
      timestamp: '2024-01-15T11:30:00Z'
    },
    {
      id: '5',
      patientName: 'Emma Wilson',
      lastContact: '12 days ago',
      lastMessageSent: 'WhatsApp follow-up',
      channel: 'whatsapp',
      status: 'needs-followup',
      priority: 'medium',
      nextBestAction: 'Send rebooking message',
      actionType: 'rebooking',
      daysSinceLastContact: 12,
      noShows: 1,
      sentiment: 'neutral',
      ltv: 2800,
      automationTrigger: 'Follow-up sequence',
      timestamp: '2024-01-15T10:45:00Z'
    },
    {
      id: '6',
      patientName: 'James Rodriguez',
      lastContact: '5 days ago',
      lastMessageSent: 'Phone call',
      channel: 'phone',
      status: 'active',
      priority: 'low',
      nextBestAction: 'Send follow-up message',
      actionType: 'follow-up',
      daysSinceLastContact: 5,
      noShows: 0,
      sentiment: 'positive',
      ltv: 4100,
      automationTrigger: 'Post-call follow-up',
      timestamp: '2024-01-15T09:20:00Z'
    }
  ])

  // Recent actions feed - live automation activity
  const [recentActions, setRecentActions] = useState<RecentAction[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      action: 'Rebooking SMS sent',
      automation: 'No-show Recovery',
      timestamp: '2 minutes ago',
      status: 'delivered',
      channel: 'sms'
    },
    {
      id: '2',
      patientName: 'David Ellis',
      action: 'Re-engagement email sent',
      automation: 'Dormant Patient Campaign',
      timestamp: '5 minutes ago',
      status: 'sent',
      channel: 'email'
    },
    {
      id: '3',
      patientName: 'Emma Wilson',
      action: 'WhatsApp follow-up sent',
      automation: 'Weekly Check-in',
      timestamp: '12 minutes ago',
      status: 'delivered',
      channel: 'whatsapp'
    },
    {
      id: '4',
      patientName: 'Michael Chen',
      action: 'Appointment confirmation sent',
      automation: 'Pre-appointment Reminder',
      timestamp: '18 minutes ago',
      status: 'delivered',
      channel: 'email'
    },
    {
      id: '5',
      patientName: 'Leila Brown',
      action: 'Phone call scheduled',
      automation: 'At-risk Intervention',
      timestamp: '25 minutes ago',
      status: 'pending',
      channel: 'phone'
    },
    {
      id: '6',
      patientName: 'James Rodriguez',
      action: 'Follow-up SMS sent',
      automation: 'Post-call Follow-up',
      timestamp: '32 minutes ago',
      status: 'delivered',
      channel: 'sms'
    },
    {
      id: '7',
      patientName: 'Lisa Thompson',
      action: 'Welcome sequence started',
      automation: 'New Patient Onboarding',
      timestamp: '45 minutes ago',
      status: 'delivered',
      channel: 'email'
    },
    {
      id: '8',
      patientName: 'Robert Kim',
      action: 'Feedback request sent',
      automation: 'Post-treatment Survey',
      timestamp: '1 hour ago',
      status: 'sent',
      channel: 'sms'
    },
    {
      id: '9',
      patientName: 'Amanda Davis',
      action: 'Rebook reminder sent',
      automation: 'Treatment Completion',
      timestamp: '1 hour ago',
      status: 'failed',
      channel: 'whatsapp'
    },
    {
      id: '10',
      patientName: 'Chris Wilson',
      action: 'Care plan sent',
      automation: 'Treatment Planning',
      timestamp: '2 hours ago',
      status: 'delivered',
      channel: 'email'
    }
  ])

  // Calculate engagement metrics
  const getEngagementMetrics = () => {
    const totalPatients = patients.length
    const needsFollowup = patients.filter(p => p.status === 'needs-followup').length
    const atRisk = patients.filter(p => p.status === 'at-risk').length
    const dormant = patients.filter(p => p.status === 'dormant').length
    const uncontacted14Plus = patients.filter(p => p.daysSinceLastContact >= 14).length
    const noShowsNoRebook = patients.filter(p => p.noShows > 0 && p.daysSinceLastContact > 7).length
    const upcomingFollowups = patients.filter(p => p.actionType === 'follow-up' && p.daysSinceLastContact <= 3).length
    const urgentRebookings = patients.filter(p => p.noShows > 0 && p.daysSinceLastContact <= 14).length
    const lowEngagementHighLTV = patients.filter(p => p.daysSinceLastContact >= 10 && p.ltv >= 3000).length
    const patientsNeedingAction = patients.filter(p => p.priority === 'high' || p.status === 'needs-followup').length

    // Mock response time and success rate
    const avgResponseTime = timeframe === '7d' ? '1.2 hrs' : timeframe === '30d' ? '2.3 hrs' : '3.1 hrs'
    const outreachSuccessRate = timeframe === '7d' ? 72 : timeframe === '30d' ? 68 : 65

    return {
      avgResponseTime,
      outreachSuccessRate,
      uncontacted14Plus,
      upcomingFollowups,
      noShowsNoRebook,
      urgentRebookings,
      lowEngagementHighLTV,
      patientsNeedingAction
    }
  }

  const metrics = getEngagementMetrics()

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-600" />
      case 'sms':
        return <MessageCircle className="h-4 w-4 text-blue-600" />
      case 'email':
        return <Mail className="h-4 w-4 text-purple-600" />
      case 'phone':
        return <Phone className="h-4 w-4 text-orange-600" />
      default:
        return <div className="h-4 w-4 rounded bg-gray-300" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-orange-600" />
      default:
        return <div className="h-4 w-4 rounded bg-gray-300" />
    }
  }



  const handleRefresh = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date())
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Engagement Centre
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Smart Patient Communication Analytics
          </p>
        </div>
        
        {/* Timeframe Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={timeframe === '7d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('7d')}
              className="h-8 px-3 text-sm"
            >
              7 Days
            </Button>
            <Button
              variant={timeframe === '30d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('30d')}
              className="h-8 px-3 text-sm"
            >
              30 Days
            </Button>
            <Button
              variant={timeframe === '90d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('90d')}
              className="h-8 px-3 text-sm"
            >
              90 Days
            </Button>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-600">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>

      {/* 1. TOP PRIORITIES THIS WEEK (Action Feed) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Priorities This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 🔴 Urgent Patients to Rebook */}
          <Card className="border border-red-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-900">Revenue at Risk</h3>
                    <p className="text-xs text-red-700">Urgent patients to rebook</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-semibold text-red-900 mb-1">
                {metrics.urgentRebookings}
              </div>
              <p className="text-sm text-red-700 mb-4">
                patients missed appointments and haven't rebooked
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs font-medium border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
              >
                Go to List
              </Button>
            </CardContent>
          </Card>

          {/* 🔶 Patients Uncontacted 14+ Days */}
          <Card className="border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                    <UserX className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-orange-900">Silent Patients</h3>
                    <p className="text-xs text-orange-700">Uncontacted 14+ days</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-semibold text-orange-900 mb-1">
                {metrics.uncontacted14Plus}
              </div>
              <p className="text-sm text-orange-700 mb-4">
                patients have gone silent
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs font-medium border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
              >
                Go to List
              </Button>
            </CardContent>
          </Card>

          {/* 🟡 Low Engagement but High LTV */}
          <Card className="border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900">Top Opportunities</h3>
                    <p className="text-xs text-amber-700">Low engagement but high LTV</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-semibold text-amber-900 mb-1">
                {metrics.lowEngagementHighLTV}
              </div>
              <p className="text-sm text-amber-700 mb-4">
                VIP patients haven't responded in 10+ days
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs font-medium border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
              >
                Go to List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. KPI PERFORMANCE HIGHLIGHTS */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">KPI Performance Highlights</h2>
        
        {/* Engagement Quality Row */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Engagement Quality</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 📞 Avg. First Reply Time */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-slate-50 overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
                      <Clock className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Avg. First Reply Time</span>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↓ 0.8hrs</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metrics.avgResponseTime}
                </div>
                <p className="text-xs text-gray-600">Avg time it takes to reply to new messages</p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100/20 rounded-full -translate-y-8 translate-x-8"></div>
              </CardContent>
            </Card>

            {/* ✅ Outreach Success Rate */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-slate-50 overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center shadow-sm border border-slate-300">
                      <CheckCircle className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Outreach Success Rate</span>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ 5%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metrics.outreachSuccessRate}%
                </div>
                <p className="text-xs text-gray-600">How many patients reply to outbound comms</p>
                <div className="absolute bottom-0 right-0 w-16 h-2 bg-slate-300 rounded-full opacity-15"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-200/20 rounded-full -translate-y-8 translate-x-8"></div>
              </CardContent>
            </Card>

            {/* 🗓️ Weekly Engagements */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-slate-50 overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-300 rounded-xl flex items-center justify-center shadow-sm border border-slate-400">
                      <Calendar className="h-5 w-5 text-slate-800" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Weekly Engagements</span>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="h-3 w-3 text-red-500" />
                        <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">↓ 2</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metrics.upcomingFollowups}
                </div>
                <p className="text-xs text-gray-600">Follow-ups scheduled this week</p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-300/20 rounded-full -translate-y-8 translate-x-8"></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Risk Row */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Revenue Risk</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ❌ Missed Rebookings */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50 overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                      <AlertTriangle className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Missed Rebookings</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">📈 Rising</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metrics.noShowsNoRebook}
                </div>
                <p className="text-xs text-gray-600">No-shows without rebooking</p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-8 h-1 bg-gray-300 rounded-full opacity-30"></div>
              </CardContent>
            </Card>

            {/* 🧭 Active Pipeline */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50 overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm border border-gray-300">
                      <Target className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Active Pipeline</span>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ 1</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metrics.patientsNeedingAction}
                </div>
                <p className="text-xs text-gray-600">Total patients mid-journey</p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 right-0 w-12 h-1 bg-gray-300 rounded-full opacity-30"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 3. RECENT PATIENT ACTIONS (Live Feed) */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Patient Actions (10)
          </CardTitle>
          <p className="text-sm text-gray-600">Live feed of automation activity</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(action.channel)}
                    {getStatusIcon(action.status)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.patientName}</div>
                    <div className="text-sm text-gray-600">{action.action}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{action.automation}</div>
                  <div className="text-xs text-gray-500">{action.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View More Button */}
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
              View All Actions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 