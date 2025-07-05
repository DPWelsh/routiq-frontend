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
  Mail
} from 'lucide-react'

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
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)
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
      notes: 'Missed last appointment, usually very regular. May need scheduling assistance.'
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
      notes: 'Treatment was going well, sudden drop-off. May have found another provider.'
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
      notes: 'Completed initial treatment plan. May be ready for maintenance sessions.'
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
      notes: 'Top tier patient, ensure excellent service continuity.'
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
        return 'border-l-yellow-500 bg-yellow-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const OpportunitySummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="border-routiq-cloud/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-routiq-core" />
            <div>
              <div className="text-2xl font-bold text-routiq-core">
                {opportunities.length}
              </div>
              <div className="text-sm text-routiq-blackberry/60">
                Total Opportunities
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-routiq-cloud/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                ${opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0)}
              </div>
              <div className="text-sm text-routiq-blackberry/60">
                Potential Revenue
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-routiq-cloud/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {opportunities.filter(opp => opp.priority === 'urgent').length}
              </div>
              <div className="text-sm text-routiq-blackberry/60">
                Urgent Actions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-routiq-cloud/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-routiq-energy" />
            <div>
              <div className="text-2xl font-bold text-routiq-energy">
                {Math.round(opportunities.reduce((sum, opp) => sum + opp.confidence, 0) / opportunities.length)}%
              </div>
              <div className="text-sm text-routiq-blackberry/60">
                Avg. Confidence
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const OpportunityCard = ({ opportunity }: { opportunity: typeof opportunities[0] }) => (
    <Card className={`border-l-4 ${getTypeColor(opportunity.type)} border-routiq-cloud/20`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-routiq-core flex items-center gap-2">
              {opportunity.title}
              {getPriorityBadge(opportunity.priority)}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-routiq-blackberry/60 mt-1">
              <span className="font-medium">{opportunity.patient}</span>
              <span>#{opportunity.patientId}</span>
              <span>LTV: ${opportunity.ltv}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${opportunity.potentialValue}
            </div>
            <div className="text-sm text-routiq-blackberry/60">
              Potential value
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded-lg border border-routiq-cloud/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-routiq-blackberry/60" />
              <span>Last seen: {opportunity.lastSeen}</span>
              <span className="text-red-600">({opportunity.daysInactive} days ago)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Risk score: {opportunity.riskScore}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-routiq-blackberry/60" />
              <span>{opportunity.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-routiq-blackberry/60" />
              <span>{opportunity.email}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-3 bg-routiq-cloud/10 rounded-lg">
          <div className="text-sm text-routiq-blackberry/70">
            <strong>Notes:</strong> {opportunity.notes}
          </div>
        </div>

        {/* Suggested Action */}
        <div className="flex items-center justify-between p-3 bg-routiq-energy/10 rounded-lg border border-routiq-energy/20">
          <div className="flex items-center gap-3">
            {getActionIcon(opportunity.actionType)}
            <div>
              <div className="font-medium text-routiq-core">
                {opportunity.suggestedAction}
              </div>
              <div className="text-sm text-routiq-blackberry/60">
                Confidence: {opportunity.confidence}%
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-routiq-cloud/30 text-routiq-blackberry/70"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button 
              size="sm" 
              className="bg-routiq-core hover:bg-routiq-core/90 text-white"
            >
              Take Action
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>

      {/* Action Center */}
      <Card className="border-routiq-core/20 bg-routiq-core/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Send className="h-5 w-5" />
            Quick Action Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="border-green-200 text-green-700 hover:bg-green-50 h-16"
            >
              <div className="text-center">
                <MessageCircle className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm">Send Bulk Messages</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-16"
            >
              <div className="text-center">
                <Phone className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm">Schedule Calls</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50 h-16"
            >
              <div className="text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm">Book Appointments</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 