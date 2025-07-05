'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  TrendingUp, 
  Heart, 
  AlertTriangle, 
  DollarSign, 
  MessageCircle,
  Target,
  Clock,
  Star,
  Activity
} from 'lucide-react'

/**
 * Patient Insights Tab Component
 * 
 * Displays patient-centric analytics and insights:
 * - Patient sentiment analysis and satisfaction scores
 * - Patient value metrics (LTV, engagement, retention)
 * - Risk assessment and churn prediction
 * - Communication patterns and engagement trends
 */
export function PatientInsightsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-routiq-core">
            Patient Insights
          </h2>
          <p className="text-routiq-blackberry/70 mt-1">
            Advanced analytics and sentiment tracking for patient engagement
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            AI-Powered Analytics
          </Badge>
          <Badge variant="outline" className="text-xs">
            Real-time Tracking
          </Badge>
        </div>
      </div>

      {/* Patient Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Patient Satisfaction */}
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

        {/* High-Value Patients */}
        <Card className="border-routiq-energy/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              High-Value Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-routiq-energy">
              23
            </div>
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              $2,400+ LTV
            </div>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card className="border-routiq-energy/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Engagement Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-routiq-energy">
              85%
            </div>
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              Above average
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Patients */}
        <Card className="border-routiq-prompt/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              At-Risk Patients
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
      </div>

      {/* Patient Sentiment Analysis */}
      <Card className="border-routiq-energy/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <MessageCircle className="h-5 w-5" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sentiment Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">68%</div>
                <div className="text-sm text-green-700">Positive</div>
                <div className="text-xs text-green-600 mt-1">
                  👍 Happy with treatment
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">24%</div>
                <div className="text-sm text-yellow-700">Neutral</div>
                <div className="text-xs text-yellow-600 mt-1">
                  😐 Standard interactions
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">8%</div>
                <div className="text-sm text-red-700">Negative</div>
                <div className="text-xs text-red-600 mt-1">
                  😟 Needs attention
                </div>
              </div>
            </div>

            {/* Recent Sentiment Trends */}
            <div className="space-y-3">
              <h4 className="font-medium text-routiq-core">Recent Sentiment Trends</h4>
              <div className="h-32 bg-routiq-energy/5 rounded-lg border border-routiq-energy/20 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-routiq-blackberry/40 mx-auto mb-2" />
                  <p className="text-sm text-routiq-blackberry/70">
                    Sentiment trend chart
                  </p>
                  <p className="text-xs text-routiq-blackberry/50 mt-1">
                    Coming in Phase 3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Value Metrics */}
      <Card className="border-routiq-energy/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Target className="h-5 w-5" />
            Patient Value Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lifetime Value Distribution */}
            <div className="space-y-4">
              <h4 className="font-medium text-routiq-core">Lifetime Value Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">High Value ($2,000+)</span>
                  <span className="text-sm font-medium">23 patients</span>
                </div>
                <Progress value={26} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">Medium Value ($500-$2,000)</span>
                  <span className="text-sm font-medium">41 patients</span>
                </div>
                <Progress value={46} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">New Patients ($0-$500)</span>
                  <span className="text-sm font-medium">25 patients</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-routiq-core">Engagement Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-routiq-energy/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-routiq-energy" />
                    <span className="text-sm">Avg. Session Rating</span>
                  </div>
                  <span className="font-medium text-routiq-energy">4.6/5</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-routiq-energy/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-routiq-energy" />
                    <span className="text-sm">Avg. Response Time</span>
                  </div>
                  <span className="font-medium text-routiq-energy">2.3 hours</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-routiq-energy/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-routiq-energy" />
                    <span className="text-sm">Messages per Patient</span>
                  </div>
                  <span className="font-medium text-routiq-energy">8.4</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Risk Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">High Risk</span>
                </div>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-sm text-red-600 mt-1">
                  Immediate attention needed
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Medium Risk</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <p className="text-sm text-yellow-600 mt-1">
                  Monitor closely
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Low Risk</span>
                </div>
                <div className="text-2xl font-bold text-green-600">82</div>
                <p className="text-sm text-green-600 mt-1">
                  Healthy engagement
                </p>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-3">
              <h4 className="font-medium text-routiq-core">Key Risk Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-routiq-cloud/5 rounded">
                  <span className="text-sm text-routiq-blackberry/70">Missed appointments</span>
                  <Badge variant="destructive" className="text-xs">High Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-routiq-cloud/5 rounded">
                  <span className="text-sm text-routiq-blackberry/70">Delayed responses</span>
                  <Badge variant="secondary" className="text-xs">Medium Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-routiq-cloud/5 rounded">
                  <span className="text-sm text-routiq-blackberry/70">Payment delays</span>
                  <Badge variant="secondary" className="text-xs">Medium Impact</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-routiq-energy/20">
        <CardHeader>
          <CardTitle className="text-routiq-core">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-routiq-energy/40 text-routiq-blackberry hover:bg-routiq-energy/10">
              Review At-Risk Patients
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-energy/40 text-routiq-blackberry hover:bg-routiq-energy/10">
              Export Patient Report
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-energy/40 text-routiq-blackberry hover:bg-routiq-energy/10">
              Schedule Follow-ups
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-energy/40 text-routiq-blackberry hover:bg-routiq-energy/10">
              Send Satisfaction Survey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 