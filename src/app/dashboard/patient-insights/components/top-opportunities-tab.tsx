'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Users,
  Send,
  Eye,
  Mail,
  Route,
  ChevronDown,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'
import { PatientJourneyTracker } from './patient-journey-tracker'

/**
 * Top Opportunities Tab - PI-006 & PI-007: Re-engagement Action Center
 * 
 * Features:
 * - Automated opportunity detection
 * - Re-engagement action center
 * - High-value patient prioritization
 * - Actionable outreach suggestions
 */
export function TopOpportunitiesTab() {
  const [actionFilter, setActionFilter] = useState<'all' | 'high-value' | 'at-risk' | 'dormant'>('all')

  // Mock opportunity data
  const opportunities = [
    {
      id: '1',
      type: 'high-value',
      title: 'High-Value Patient Re-engagement',
      patient: 'Sarah Johnson',
      patientId: 'P001',
      ltv: 2450,
      lastSeen: '2024-01-15',
      daysInactive: 8,
      riskScore: 65,
      suggestedAction: 'Send personalized check-in message',
      actionType: 'message',
      priority: 'high',
      potentialValue: 340,
      confidence: 85,
      phone: '+61 423 567 890',
      email: 'sarah.j@email.com',
      notes: 'Missed last appointment, usually very regular. May need scheduling assistance.',
      automationState: {
        currentSequence: 'Routine Care Maintenance',
        currentStage: 'Follow-up Scheduled',
        progress: 75,
        nextAction: 'Appointment Reminder',
        nextActionDate: '2024-01-28',
        automationStatus: 'active' as const
      }
    },
    {
      id: '2',
      type: 'at-risk',
      title: 'Prevent Patient Churn',
      patient: 'Michael Chen',
      patientId: 'P002',
      ltv: 1850,
      lastSeen: '2023-12-08',
      daysInactive: 45,
      riskScore: 89,
      suggestedAction: 'Schedule follow-up call',
      actionType: 'call',
      priority: 'urgent',
      potentialValue: 890,
      confidence: 92,
      phone: '+61 456 789 123',
      email: 'michael.c@email.com',
      notes: 'Treatment was going well, sudden drop-off. May have found another provider.',
      automationState: {
        currentSequence: 'Reengagement Campaign',
        currentStage: 'Email Sent - Awaiting Response',
        progress: 40,
        nextAction: 'SMS Follow-up',
        nextActionDate: '2024-01-25',
        automationStatus: 'active' as const
      }
    },
    {
      id: '3',
      type: 'dormant',
      title: 'Dormant Patient Reactivation',
      patient: 'Emma Wilson',
      patientId: 'P003',
      ltv: 890,
      lastSeen: '2023-11-22',
      daysInactive: 62,
      riskScore: 78,
      suggestedAction: 'Send wellness check email',
      actionType: 'email',
      priority: 'medium',
      potentialValue: 245,
      confidence: 72,
      phone: '+61 789 123 456',
      email: 'emma.w@email.com',
      notes: 'Completed initial treatment plan. May be ready for maintenance sessions.',
      automationState: {
        currentSequence: 'High-Risk Intervention',
        currentStage: 'Phone Call Scheduled',
        progress: 60,
        nextAction: 'Personal Outreach Call',
        nextActionDate: '2024-01-24',
        automationStatus: 'priority' as const
      }
    },
    {
      id: '4',
      type: 'high-value',
      title: 'VIP Patient Retention',
      patient: 'James Rodriguez',
      patientId: 'P004',
      ltv: 3200,
      lastSeen: '2024-01-18',
      daysInactive: 5,
      riskScore: 45,
      suggestedAction: 'Proactive wellness check',
      actionType: 'message',
      priority: 'high',
      potentialValue: 520,
      confidence: 78,
      phone: '+61 321 654 987',
      email: 'james.r@email.com',
      notes: 'Top tier patient, ensure excellent service continuity.',
      automationState: {
        currentSequence: 'VIP Care Journey',
        currentStage: 'Satisfaction Survey Sent',
        progress: 90,
        nextAction: 'Loyalty Program Invite',
        nextActionDate: '2024-01-30',
        automationStatus: 'active' as const
      }
    }
  ]

  const filteredOpportunities = opportunities.filter(opp => {
    if (actionFilter === 'all') return true
    return opp.type === actionFilter
  })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>
      case 'high':
        return <Badge className="bg-amber-100 text-amber-800">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call':
        return <Phone className="h-4 w-4" />
      case 'message':
        return <MessageCircle className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      default:
        return <Send className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high-value':
        return 'border-l-green-500 bg-green-50'
      case 'at-risk':
        return 'border-l-red-500 bg-red-50'
      case 'dormant':
        return 'border-l-orange-500 bg-orange-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const OpportunitySummary = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <Card className="border-routiq-cloud/20 bg-white/60">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-routiq-core/10 rounded-lg">
              <Target className="h-4 w-4 text-routiq-core" />
            </div>
            <div>
              <div className="text-xl font-bold text-routiq-core">
                {opportunities.length}
              </div>
              <div className="text-xs text-routiq-blackberry/60">
                Opportunities
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-routiq-cloud/20 bg-white/60">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">
                ${opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0).toLocaleString()}
              </div>
              <div className="text-xs text-routiq-blackberry/60">
                Potential Value
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-routiq-cloud/20 bg-white/60">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-amber-600">
                {opportunities.filter(opp => opp.priority === 'urgent').length}
              </div>
              <div className="text-xs text-routiq-blackberry/60">
                Urgent
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-routiq-cloud/20 bg-white/60">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-routiq-energy" />
            </div>
            <div>
              <div className="text-xl font-bold text-routiq-energy">
                {Math.round(opportunities.reduce((sum, opp) => sum + opp.confidence, 0) / opportunities.length)}%
              </div>
              <div className="text-xs text-routiq-blackberry/60">
                Confidence
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const OpportunityCard = ({ opportunity }: { opportunity: typeof opportunities[0] }) => {
    const [isAutomationExpanded, setIsAutomationExpanded] = useState(false)
    
    const getAutomationStatusIcon = (status: string) => {
      switch (status) {
        case 'active': return <Play className="h-4 w-4 text-blue-600" />
        case 'paused': return <Pause className="h-4 w-4 text-gray-600" />
        case 'priority': return <AlertTriangle className="h-4 w-4 text-orange-600" />
        default: return <CheckCircle className="h-4 w-4 text-green-600" />
      }
    }

    const getAutomationStatusBadge = (status: string) => {
      switch (status) {
        case 'active': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Active</Badge>
        case 'paused': return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Paused</Badge>
        case 'priority': return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Priority</Badge>
        default: return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
      }
    }

    return (
      <Card className={`border-l-4 ${getTypeColor(opportunity.type)} border-routiq-cloud/20 hover:shadow-md transition-all duration-200`}>
        <CardContent className="p-4 space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-routiq-core text-base">{opportunity.patient}</h3>
                {getPriorityBadge(opportunity.priority)}
              </div>
              <div className="flex items-center gap-3 text-sm text-routiq-blackberry/60">
                <span>#{opportunity.patientId}</span>
                <span>LTV: ${opportunity.ltv.toLocaleString()}</span>
                <span className="text-red-600">{opportunity.daysInactive}d inactive</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">${opportunity.potentialValue}</div>
              <div className="text-xs text-routiq-blackberry/50">potential</div>
            </div>
          </div>

          {/* 🚀 PROMINENT AUTOMATION JOURNEY SECTION */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl p-4 space-y-3">
            {/* Automation Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Route className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-blue-900 text-sm">🤖 Active Automation</div>
                  <div className="text-blue-700 font-medium">{opportunity.automationState.currentSequence}</div>
                </div>
              </div>
              {getAutomationStatusBadge(opportunity.automationState.automationStatus)}
            </div>

            {/* Current Stage & Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAutomationStatusIcon(opportunity.automationState.automationStatus)}
                  <span className="text-sm font-medium text-blue-800">
                    Current: {opportunity.automationState.currentStage}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-700">
                  {opportunity.automationState.progress}% Complete
                </span>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="w-full bg-blue-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                    style={{ width: `${opportunity.automationState.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Action Preview */}
            <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Next Action</div>
                    <div className="text-xs text-blue-700">{opportunity.automationState.nextAction}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-600">Scheduled</div>
                  <div className="text-sm font-medium text-blue-800">
                    {new Date(opportunity.automationState.nextActionDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Journey Details */}
            <button
              onClick={() => setIsAutomationExpanded(!isAutomationExpanded)}
              className="w-full flex items-center justify-center gap-2 py-2 text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span className="text-sm font-medium">
                {isAutomationExpanded ? 'Hide Journey Details' : 'View Full Journey'}
              </span>
              {isAutomationExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </button>
          </div>

          {/* Expandable Full Automation Journey */}
          {isAutomationExpanded && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 animate-in slide-in-from-top-1 duration-200">
              <PatientJourneyTracker
                patient={{
                  id: opportunity.patientId,
                  name: opportunity.patient,
                  automationState: opportunity.automationState,
                  status: opportunity.type
                }}
                onActionTrigger={(action) => {
                  console.log(`Triggering action: ${action} for patient: ${opportunity.patient}`)
                }}
              />
            </div>
          )}

          {/* Suggested Action - Enhanced */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-routiq-energy/20 to-routiq-energy/10 rounded-lg border-2 border-routiq-energy/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-routiq-core rounded-lg">
                {getActionIcon(opportunity.actionType)}
              </div>
              <div>
                <div className="font-medium text-routiq-core text-sm">
                  💡 {opportunity.suggestedAction}
                </div>
                <div className="text-xs text-routiq-blackberry/60 flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {opportunity.confidence}% confidence • AI Recommended
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-routiq-cloud/30 text-routiq-blackberry/70 text-xs px-3 py-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button 
                size="sm" 
                className="bg-routiq-core hover:bg-routiq-core/90 text-white text-xs px-3 py-1 shadow-md"
              >
                Take Action
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-routiq-core">
            Top Opportunities
          </h2>
          <p className="text-routiq-blackberry/70 mt-1">
            AI-detected re-engagement opportunities and action center
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-routiq-cloud/30 text-routiq-blackberry/70"
          >
            Export List
          </Button>
          <Button 
            size="sm" 
            className="bg-routiq-core hover:bg-routiq-core/90 text-white"
          >
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Opportunity Summary */}
      <OpportunitySummary />

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-routiq-cloud/20">
        <span className="text-sm font-medium text-routiq-blackberry/70">Filter by:</span>
        <div className="flex items-center gap-2">
          {(['all', 'high-value', 'at-risk', 'dormant'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActionFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                actionFilter === filter
                  ? 'bg-routiq-core text-white'
                  : 'bg-routiq-cloud/20 text-routiq-blackberry/70 hover:bg-routiq-cloud/30'
              }`}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List - Streamlined */}
      <div className="space-y-3">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>

      {/* Streamlined Action Center */}
      <Card className="border-routiq-core/20 bg-gradient-to-r from-routiq-core/5 to-routiq-energy/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-routiq-core flex items-center gap-2">
              <Send className="h-4 w-4" />
              Quick Actions
            </h3>
            <span className="text-xs text-routiq-blackberry/60">
              {filteredOpportunities.length} opportunities
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="border-green-200 text-green-700 hover:bg-green-50 h-12 text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Bulk Messages
            </Button>
            
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-12 text-sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Schedule Calls
            </Button>
            
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50 h-12 text-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 