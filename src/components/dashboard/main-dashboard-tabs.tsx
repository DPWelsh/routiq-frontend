'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Zap } from 'lucide-react'
import { ClinicOverviewTab } from './tabs/clinic-overview-tab'
import { PatientInsightsTab } from './tabs/patient-insights-tab'
import { AutomationSummaryTab } from './tabs/automation-summary-tab'

/**
 * Main Dashboard Tabs Component
 * 
 * Provides the primary navigation structure for the dashboard with three main sections:
 * - Clinic Overview (default): Month/Week views with booking metrics
 * - Patient Insights: Sentiment analysis and patient value metrics  
 * - Automation Summary: ROI tracking and automation performance
 */
export function MainDashboardTabs() {
  const [activeTab, setActiveTab] = useState('clinic-overview')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-routiq-core">
          Dashboard Overview
        </h1>
        <p className="text-routiq-blackberry/70 mt-1">
          AI-powered insights and analytics for your healthcare practice
        </p>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-routiq-cloud/10 p-1 h-12">
          <TabsTrigger 
            value="clinic-overview" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium">Clinic Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="patient-insights"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors"
          >
            <Users className="h-4 w-4" />
            <span className="font-medium">Patient Insights</span>
          </TabsTrigger>
          <TabsTrigger 
            value="automation-summary"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span className="font-medium">Automation Summary</span>
          </TabsTrigger>
        </TabsList>

        {/* Clinic Overview Tab Content */}
        <TabsContent value="clinic-overview" className="mt-6">
          <ClinicOverviewTab />
        </TabsContent>

        {/* Patient Insights Tab Content */}
        <TabsContent value="patient-insights" className="mt-6">
          <PatientInsightsTab />
        </TabsContent>

        {/* Automation Summary Tab Content */}
        <TabsContent value="automation-summary" className="mt-6">
          <AutomationSummaryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
} 