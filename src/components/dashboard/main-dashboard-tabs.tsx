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
      <div className="max-w-8xl mx-auto space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-routiq-core">
                Dashboard
              </h1>
              <p className="text-routiq-blackberry/70 text-base md:text-lg">
                Overview of your healthcare practice performance
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Tab Navigation */}
        <div className="flex justify-center px-2 md:px-0">
          <div className="w-full max-w-4xl bg-routiq-cloud/10 border border-routiq-cloud/30 rounded-lg p-1 shadow-sm overflow-x-auto" data-tour="dashboard-tabs">
            <div className="flex min-w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 min-w-0 flex flex-col items-center gap-1 md:flex-row md:gap-2 py-3 px-3 md:px-5 rounded-md font-medium transition-all duration-200 min-h-[60px] md:min-h-[48px]
                      ${isActive 
                        ? 'bg-white text-routiq-core shadow-sm' 
                        : 'text-routiq-blackberry/70 hover:text-routiq-core hover:bg-routiq-cloud/20'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 md:h-5 md:w-5 flex-shrink-0" />
                    <span className="text-xs md:text-base text-center md:text-left leading-tight">
                      {/* Mobile: Short labels */}
                      <span className="md:hidden">
                        {tab.id === 'clinic-overview' ? 'Clinic' : 
                         tab.id === 'patient-insights' ? 'Patients' : 
                         'Automation'}
                      </span>
                      {/* Desktop: Full labels */}
                      <span className="hidden md:inline">{tab.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <div data-tour="clinic-metrics" className={activeTab === 'clinic-overview' ? '' : 'hidden'}>
            {activeTab === 'clinic-overview' && <ClinicOverviewTab />}
          </div>
          <div data-tour="patient-insights" className={activeTab === 'patient-insights' ? '' : 'hidden'}>
            {activeTab === 'patient-insights' && <PatientInsightsTab />}
          </div>
          <div data-tour="automation-panel" className={activeTab === 'automation-summary' ? '' : 'hidden'}>
            {activeTab === 'automation-summary' && <AutomationSummaryTab />}
          </div>
        </div>
      </div>
    </div>
  )
} 