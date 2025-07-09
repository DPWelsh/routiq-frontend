'use client'

import { useState } from 'react'
import { BarChart3, Users, Bot } from 'lucide-react'
import { ClinicOverviewTab } from './tabs/clinic-overview-tab'
import { PatientInsightsTab } from './tabs/patient-insights-tab'
import { AutomationSummaryTab } from './tabs/automation-summary-tab'

/**
 * Main Dashboard Tabs Component - Simplified Single Component
 */
export function MainDashboardTabs() {
  const [activeTab, setActiveTab] = useState('clinic-overview')

  const tabs = [
    {
      id: 'clinic-overview',
      label: 'Clinic Overview',
      icon: BarChart3,
      component: <ClinicOverviewTab />
    },
    {
      id: 'patient-insights',
      label: 'Patient Overview', 
      icon: Users,
      component: <PatientInsightsTab />
    },
    {
      id: 'automation-summary',
      label: 'Automation Overview',
      icon: Bot,
      component: <AutomationSummaryTab />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Header */}
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

        {/* Simple Tab Navigation */}
        <div className="bg-gray-50 py-6">
          <div className="flex justify-center">
            <div className="inline-flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-3 px-5 rounded-md text-base font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-[#7ba2e0] text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-8 py-8">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  )
} 