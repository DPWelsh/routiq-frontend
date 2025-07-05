'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Bot,
  Timer
} from 'lucide-react'

/**
 * Automation Summary Tab Component
 * 
 * Displays automation performance and ROI metrics:
 * - Revenue impact and cost savings from automation
 * - Automation performance metrics and health status
 * - Admin time savings and efficiency improvements
 * - Automation usage analytics and trends
 */
export function AutomationSummaryTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-routiq-core">
            Automation Summary
          </h2>
          <p className="text-routiq-blackberry/70 mt-1">
            ROI tracking and automation performance analytics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Bot className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Real-time ROI
          </Badge>
        </div>
      </div>

      {/* ROI Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Impact */}
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

        {/* Time Saved */}
        <Card className="border-routiq-prompt/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Saved
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-routiq-prompt">
              142 hrs
            </div>
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              This month
            </div>
          </CardContent>
        </Card>

        {/* Automation Rate */}
        <Card className="border-routiq-prompt/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-routiq-prompt">
              87%
            </div>
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              Of eligible tasks
            </div>
          </CardContent>
        </Card>

        {/* Cost Savings */}
        <Card className="border-routiq-prompt/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-routiq-prompt">
              $8,900
            </div>
            <div className="text-sm text-routiq-blackberry/70 mt-1">
              Vs manual processes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Performance */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Activity className="h-5 w-5" />
            Automation Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-green-700">Success Rate</div>
                <div className="text-xs text-green-600 mt-1">
                  ✅ Highly reliable
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <div className="text-sm text-blue-700">Avg Response Time</div>
                <div className="text-xs text-blue-600 mt-1">
                  ⚡ Ultra-fast processing
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">847</div>
                <div className="text-sm text-purple-700">Tasks Automated</div>
                <div className="text-xs text-purple-600 mt-1">
                  🤖 This month
                </div>
              </div>
            </div>

            {/* Automation Health Status */}
            <div className="space-y-3">
              <h4 className="font-medium text-routiq-core">System Health</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Message Processing</p>
                    <p className="text-sm text-green-600">All systems operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Appointment Automation</p>
                    <p className="text-sm text-green-600">Running smoothly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Follow-up Sequences</p>
                    <p className="text-sm text-green-600">Active & delivering</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Payment Reminders</p>
                    <p className="text-sm text-yellow-600">Minor delay detected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Time Savings */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Timer className="h-5 w-5" />
            Admin Time Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Savings by Category */}
            <div className="space-y-4">
              <h4 className="font-medium text-routiq-core">Time Savings by Category</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">Appointment Scheduling</span>
                  <span className="text-sm font-medium text-routiq-prompt">48 hrs</span>
                </div>
                <Progress value={65} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">Follow-up Communications</span>
                  <span className="text-sm font-medium text-routiq-prompt">36 hrs</span>
                </div>
                <Progress value={48} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">Payment Processing</span>
                  <span className="text-sm font-medium text-routiq-prompt">28 hrs</span>
                </div>
                <Progress value={38} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-routiq-blackberry/70">Data Entry & Updates</span>
                  <span className="text-sm font-medium text-routiq-prompt">30 hrs</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-routiq-core">Efficiency Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-routiq-prompt" />
                    <span className="text-sm">Messages Automated</span>
                  </div>
                  <span className="font-medium text-routiq-prompt">1,247</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-routiq-prompt" />
                    <span className="text-sm">Avg Task Completion</span>
                  </div>
                  <span className="font-medium text-routiq-prompt">85% faster</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-routiq-prompt" />
                    <span className="text-sm">Error Reduction</span>
                  </div>
                  <span className="font-medium text-routiq-prompt">92%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-routiq-prompt" />
                    <span className="text-sm">Staff Productivity</span>
                  </div>
                  <span className="font-medium text-routiq-prompt">+34%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Breakdown */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <BarChart3 className="h-5 w-5" />
            ROI Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ROI Chart Placeholder */}
            <div className="h-48 bg-routiq-prompt/5 rounded-lg border border-routiq-prompt/20 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-routiq-blackberry/40 mx-auto mb-2" />
                <p className="text-routiq-blackberry/70">
                  Interactive ROI breakdown chart
                </p>
                <p className="text-sm text-routiq-blackberry/50 mt-1">
                  Coming in Phase 4
                </p>
              </div>
            </div>

            {/* ROI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Total ROI</span>
                </div>
                <div className="text-2xl font-bold text-green-600">284%</div>
                <p className="text-sm text-green-600 mt-1">
                  Since implementation
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Payback Period</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">2.3</div>
                <p className="text-sm text-blue-600 mt-1">
                  Months to break even
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Monthly Savings</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">$8,900</div>
                <p className="text-sm text-purple-600 mt-1">
                  Recurring monthly benefit
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Opportunities */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-routiq-core">
            <Bot className="h-5 w-5" />
            Automation Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-routiq-blackberry/70">
              AI-identified opportunities to further improve efficiency
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg border border-routiq-prompt/20">
                <div>
                  <p className="font-medium text-routiq-core">Automated Treatment Reminders</p>
                  <p className="text-sm text-routiq-blackberry/70">Potential 15 hrs/month savings</p>
                </div>
                <Badge variant="outline" className="text-routiq-prompt border-routiq-prompt/40">
                  High Impact
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg border border-routiq-prompt/20">
                <div>
                  <p className="font-medium text-routiq-core">Insurance Pre-authorization</p>
                  <p className="text-sm text-routiq-blackberry/70">Potential 22 hrs/month savings</p>
                </div>
                <Badge variant="outline" className="text-routiq-prompt border-routiq-prompt/40">
                  Medium Impact
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-routiq-prompt/5 rounded-lg border border-routiq-prompt/20">
                <div>
                  <p className="font-medium text-routiq-core">Patient Intake Forms</p>
                  <p className="text-sm text-routiq-blackberry/70">Potential 8 hrs/month savings</p>
                </div>
                <Badge variant="outline" className="text-routiq-prompt border-routiq-prompt/40">
                  Low Impact
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-routiq-prompt/20">
        <CardHeader>
          <CardTitle className="text-routiq-core">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-routiq-prompt/40 text-routiq-blackberry hover:bg-routiq-prompt/10">
              View Automation Settings
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-prompt/40 text-routiq-blackberry hover:bg-routiq-prompt/10">
              Export ROI Report
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-prompt/40 text-routiq-blackberry hover:bg-routiq-prompt/10">
              Schedule Optimization
            </Button>
            <Button variant="outline" size="sm" className="border-routiq-prompt/40 text-routiq-blackberry hover:bg-routiq-prompt/10">
              Enable New Automation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 