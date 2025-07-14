'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Users,
  Clock,
  MessageCircle,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Play,
  Pause,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  Zap
} from 'lucide-react'

/**
 * Engagement Overview Tab - PI-004: Visual Risk Analysis Dashboard
 * 
 * Features:
 * - Visual risk analysis with donut charts
 * - Engagement metrics and trend analysis
 * - Patient satisfaction tracking
 * - Real-time engagement monitoring
 */
export function EngagementOverviewTab() {
  const [selectedMetric, setSelectedMetric] = useState('risk-analysis')

  // Mock engagement data
  const engagementData = {
    totalPatients: 247,
    activePatients: 189,
    atRiskPatients: 23,
    dormantPatients: 35,
    averageEngagement: 78,
    satisfactionScore: 4.7,
    responseRate: 87,
    reEngagementSuccess: 65
  }

  const riskDistribution = [
    { status: 'Low Risk', count: 189, percentage: 76.5, color: 'bg-green-500' },
    { status: 'Medium Risk', count: 35, percentage: 14.2, color: 'bg-orange-500' },
    { status: 'High Risk', count: 23, percentage: 9.3, color: 'bg-red-500' }
  ]

  const engagementMetrics = [
    {
      title: 'Patient Satisfaction',
      value: '4.7/5',
      change: '+0.3',
      trend: 'up',
      icon: Heart,
      color: 'text-green-600'
    },
    {
      title: 'Response Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: MessageCircle,
      color: 'text-green-600'
    },
    {
      title: 'Avg. Engagement',
      value: '78%',
      change: '-2%',
      trend: 'down',
      icon: Activity,
      color: 'text-red-600'
    },
    {
      title: 'Re-engagement Success',
      value: '65%',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600'
    }
  ]

  const RiskAnalysisCard = () => (
    <Card className="border-routiq-cloud/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-routiq-core">
          <PieChart className="h-5 w-5" />
          Patient Risk Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Distribution Visual */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-routiq-core mb-2">
              {engagementData.totalPatients}
            </div>
            <div className="text-sm text-routiq-blackberry/60">Total Patients</div>
          </div>
          
          {/* Risk Bars */}
          <div className="space-y-3">
            {riskDistribution.map((risk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                    <span className="text-sm font-medium text-routiq-blackberry/80">
                      {risk.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-routiq-blackberry/80">
                      {risk.count}
                    </span>
                    <span className="text-xs text-routiq-blackberry/60">
                      ({risk.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-routiq-cloud/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${risk.color}`}
                    style={{ width: `${risk.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-routiq-cloud/20">
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              View High Risk Patients ({riskDistribution[2].count})
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              <Clock className="h-4 w-4 mr-2" />
              Review Dormant Patients ({riskDistribution[1].count})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EngagementMetricsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {engagementMetrics.map((metric, index) => (
        <Card key={index} className="border-routiq-cloud/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="h-5 w-5 text-routiq-energy" />
                <div>
                  <div className="text-xs text-routiq-blackberry/60 uppercase font-medium">
                    {metric.title}
                  </div>
                  <div className="text-2xl font-bold text-routiq-core">
                    {metric.value}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${metric.color}`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const EngagementTrendsChart = () => (
    <Card className="border-routiq-cloud/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-routiq-core">
          <BarChart3 className="h-5 w-5" />
          Engagement Trends (Last 6 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-routiq-energy/5 rounded-lg border border-routiq-energy/20 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-routiq-blackberry/40 mx-auto mb-2" />
            <p className="text-routiq-blackberry/70 font-medium">
              Interactive Engagement Chart
            </p>
            <p className="text-sm text-routiq-blackberry/50 mt-1">
              Shows patient engagement trends over time
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PatientFlowAnalysis = () => (
    <Card className="border-routiq-cloud/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-routiq-core">
          <Users className="h-5 w-5" />
          Patient Flow Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Patients */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              +24
            </div>
            <div className="text-sm text-routiq-blackberry/60 mb-1">
              New Patients
            </div>
            <div className="text-xs text-green-600">
              This month
            </div>
          </div>
          
          {/* Returning Patients */}
          <div className="text-center">
            <div className="text-3xl font-bold text-routiq-core mb-2">
              164
            </div>
            <div className="text-sm text-routiq-blackberry/60 mb-1">
              Returning Patients
            </div>
            <div className="text-xs text-routiq-blackberry/60">
              Active this month
            </div>
          </div>
          
          {/* Churn Rate */}
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              8.3%
            </div>
            <div className="text-sm text-routiq-blackberry/60 mb-1">
              Churn Rate
            </div>
            <div className="text-xs text-red-600">
              Down from 12.1%
            </div>
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
            Engagement Overview
          </h2>
          <p className="text-routiq-blackberry/70 mt-1">
            Visual risk analysis and engagement metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-routiq-cloud/30 text-routiq-blackberry/70"
          >
            Export Report
          </Button>
          <Button 
            size="sm" 
            className="bg-routiq-core hover:bg-routiq-core/90 text-white"
          >
            Schedule Review
          </Button>
        </div>
      </div>

      {/* Engagement Metrics Grid */}
      <EngagementMetricsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Analysis - Takes up 1 column */}
        <div className="lg:col-span-1">
          <RiskAnalysisCard />
        </div>
        
        {/* Engagement Trends - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <EngagementTrendsChart />
        </div>
      </div>

      {/* Patient Flow Analysis */}
      <PatientFlowAnalysis />

      {/* Automation Stage Analytics */}
      <Card className="border-routiq-cloud/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Zap className="h-5 w-5" />
            Automation Stage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Automation Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Active Sequences</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">142</div>
              <div className="text-xs text-blue-600 mt-1">Currently running</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Completed This Month</span>
              </div>
              <div className="text-2xl font-bold text-green-700">23</div>
              <div className="text-xs text-green-600 mt-1">Journey completed</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Pause className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Paused Sequences</span>
              </div>
              <div className="text-2xl font-bold text-gray-700">8</div>
              <div className="text-xs text-gray-600 mt-1">Need attention</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Priority Interventions</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">5</div>
              <div className="text-xs text-orange-600 mt-1">High-risk patients</div>
            </div>
          </div>

          {/* Upcoming Actions Today */}
          <div className="space-y-4">
            <h4 className="font-medium text-routiq-core">Actions Due Today</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-routiq-cloud/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-routiq-core" />
                  <div>
                    <div className="font-medium text-routiq-blackberry/80">Personal Outreach Calls</div>
                    <div className="text-sm text-routiq-blackberry/60">High-risk intervention</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-routiq-core">5</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-routiq-cloud/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-routiq-core" />
                  <div>
                    <div className="font-medium text-routiq-blackberry/80">SMS Follow-ups</div>
                    <div className="text-sm text-routiq-blackberry/60">Reengagement campaign</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-routiq-core">8</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-routiq-cloud/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-routiq-core" />
                  <div>
                    <div className="font-medium text-routiq-blackberry/80">Appointment Reminders</div>
                    <div className="text-sm text-routiq-blackberry/60">Routine maintenance</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-routiq-core">12</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-routiq-cloud/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-routiq-core" />
                  <div>
                    <div className="font-medium text-routiq-blackberry/80">Email Campaigns</div>
                    <div className="text-sm text-routiq-blackberry/60">Various sequences</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-routiq-core">3</div>
              </div>
            </div>
          </div>

          {/* Sequence Performance */}
          <div className="space-y-4">
            <h4 className="font-medium text-routiq-core">Top Performing Sequences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-green-700">Routine Care Maintenance</div>
                    <div className="text-sm text-green-600">89 patients • 94% completion rate</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-700">Reengagement Campaign</div>
                    <div className="text-sm text-blue-600">28 patients • 67% success rate</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="border-routiq-prompt/20 bg-routiq-prompt/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Target className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-routiq-cloud/20">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <div className="font-medium text-routiq-core">
                  Review 23 High-Risk Patients
                </div>
                <div className="text-sm text-routiq-blackberry/60">
                  Patients showing signs of disengagement - immediate attention needed
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-amber-200 text-amber-700">
                Review Now
              </Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-routiq-cloud/20">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-routiq-core">
                  Follow Up on Dormant Patients
                </div>
                <div className="text-sm text-routiq-blackberry/60">
                  35 patients haven&apos;t been active recently - consider re-engagement campaign
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-blue-200 text-blue-700">
                Start Campaign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 