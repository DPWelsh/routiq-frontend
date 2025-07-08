'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Zap, Bot } from 'lucide-react'
import { ClinicOverviewTab } from './tabs/clinic-overview-tab'
import { PatientInsightsTab } from './tabs/patient-insights-tab'
import { AutomationSummaryTab } from './tabs/automation-summary-tab'

/**
 * Main Dashboard Tabs Component - Stripe-style Design
 * 
 * Provides a clean, minimal navigation structure inspired by Stripe's dashboard:
 * - Clinic Overview (default): Month/Week views with booking metrics
 * - Patient Insights: Sentiment analysis and patient value metrics  
 * - Automation Summary: ROI tracking and automation performance
 */
export function MainDashboardTabs() {
  const [activeTab, setActiveTab] = useState('clinic-overview')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Stripe-style Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-8 max-w-none">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Overview of your healthcare practice performance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Navigation Tabs */}
        <div className="bg-gray-50 py-6">
          <div className="flex justify-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="inline-flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <TabsTrigger 
                  value="clinic-overview" 
                  className="flex items-center gap-2 py-3 px-5 rounded-md text-base font-medium transition-all data-[state=active]:bg-routiq-blackberry data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Clinic Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="patient-insights"
                  className="flex items-center gap-2 py-3 px-5 rounded-md text-base font-medium transition-all data-[state=active]:bg-routiq-blackberry data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Users className="h-5 w-5" />
                  <span>Patient Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="automation-summary"
                  className="flex items-center gap-2 py-3 px-5 rounded-md text-base font-medium transition-all data-[state=active]:bg-routiq-blackberry data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Bot className="h-5 w-5" />
                  <span>Automation Overview</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Clinic Overview Tab Content */}
            <TabsContent value="clinic-overview" className="mt-0">
              <ClinicOverviewTab />
            </TabsContent>

            {/* Patient Insights Tab Content */}
            <TabsContent value="patient-insights" className="mt-0">
              <PatientInsightsTab />
            </TabsContent>

            {/* Automation Summary Tab Content */}
            <TabsContent value="automation-summary" className="mt-0">
              <AutomationSummaryTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 