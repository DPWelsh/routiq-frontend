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
    <div className="min-h-screen bg-routiq-cloud/5">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-routiq-core">
                Dashboard
              </h1>
              <p className="text-routiq-blackberry/70 text-lg">
                Overview of your healthcare practice performance
              </p>
            </div>
          </div>
        </div>

        {/* Simple Tab Navigation */}
        <div className="flex justify-center">
          <div className="inline-flex bg-routiq-cloud/10 border border-routiq-cloud/30 rounded-lg p-1 shadow-sm">
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
                      ? 'bg-white text-routiq-core shadow-sm' 
                      : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-routiq-cloud/20'
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

        {/* Tab Content */}
        <div className="mt-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  )
} 