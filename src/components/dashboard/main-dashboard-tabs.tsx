'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Zap } from 'lucide-react'

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
          <div className="space-y-6">
            {/* Placeholder for Clinic Overview content */}
            <div className="text-center py-16 bg-routiq-cloud/5 rounded-lg border border-routiq-cloud/20">
              <BarChart3 className="h-16 w-16 text-routiq-blackberry/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-routiq-core mb-2">
                Clinic Overview
              </h3>
              <p className="text-routiq-blackberry/70 max-w-md mx-auto">
                Booking metrics, active patients, and daily trends will be displayed here. 
                Month/Week toggle and live data indicators coming soon.
              </p>
              <div className="mt-4 text-sm text-routiq-prompt">
                📊 Ready for Phase 2 implementation
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Patient Insights Tab Content */}
        <TabsContent value="patient-insights" className="mt-6">
          <div className="space-y-6">
            {/* Placeholder for Patient Insights content */}
            <div className="text-center py-16 bg-routiq-energy/5 rounded-lg border border-routiq-energy/20">
              <Users className="h-16 w-16 text-routiq-blackberry/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-routiq-core mb-2">
                Patient Insights
              </h3>
              <p className="text-routiq-blackberry/70 max-w-md mx-auto">
                Patient sentiment analysis, value metrics, and risk assessment will be displayed here.
                Advanced analytics and engagement tracking coming soon.
              </p>
              <div className="mt-4 text-sm text-routiq-energy">
                👥 Ready for Phase 3 implementation
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Automation Summary Tab Content */}
        <TabsContent value="automation-summary" className="mt-6">
          <div className="space-y-6">
            {/* Placeholder for Automation Summary content */}
            <div className="text-center py-16 bg-routiq-prompt/5 rounded-lg border border-routiq-prompt/20">
              <Zap className="h-16 w-16 text-routiq-blackberry/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-routiq-core mb-2">
                Automation Summary
              </h3>
              <p className="text-routiq-blackberry/70 max-w-md mx-auto">
                ROI tracking, automation performance metrics, and admin time savings will be displayed here.
                Revenue impact and efficiency analytics coming soon.
              </p>
              <div className="mt-4 text-sm text-routiq-prompt">
                ⚡ Ready for Phase 4 implementation
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 