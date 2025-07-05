'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  Target, 
  Search,
  ChevronRight,
  Home,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

// Import tab components (will create these next)
import { AllPatientsTab } from './components/all-patients-tab'
import { EngagementOverviewTab } from './components/engagement-overview-tab'  
import { TopOpportunitiesTab } from './components/top-opportunities-tab'

/**
 * Patient Insights - Comprehensive Patient Journey Tracking System
 * 
 * Goal: Make every patient's journey trackable, measurable, and re-engageable
 * 
 * Architecture:
 * - All Patients: Searchable table with patient data and advanced filters
 * - Engagement Overview: Risk analysis and engagement analytics
 * - Top Opportunities: Re-engagement opportunities and action center
 */
export default function PatientInsightsPage() {
  const [activeTab, setActiveTab] = useState('all-patients')
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Search functionality across all tabs
  const searchableContent = {
    'all-patients': ['patient', 'name', 'phone', 'email', 'ltv', 'sessions', 'appointments'],
    'engagement-overview': ['risk', 'engagement', 'analytics', 'charts', 'metrics'],
    'top-opportunities': ['opportunities', 'reengagement', 'actions', 'high-value', 'inactive']
  }

  const filteredTabs = searchTerm 
    ? Object.entries(searchableContent)
        .filter(([tab, keywords]) => 
          keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tab.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .map(([tab]) => tab)
    : ['all-patients', 'engagement-overview', 'top-opportunities']

  const handleRefresh = () => {
    setLastUpdated(new Date())
    // Trigger data refresh for active tab
    console.log('🔄 Refreshing patient insights data...')
  }

  return (
    <div className="min-h-screen bg-routiq-cloud/5">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header with Search and Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-routiq-core">Patient Insights</h1>
              <p className="text-routiq-blackberry/70 text-lg">
                Track patient journeys, identify opportunities, and drive re-engagement
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 border border-routiq-cloud/30 rounded-lg hover:bg-routiq-cloud/10 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4 text-routiq-blackberry/60" />
                <span className="text-sm text-routiq-blackberry/60">Refresh</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 border border-routiq-cloud/30 rounded-lg hover:bg-routiq-cloud/10 transition-colors">
                <Download className="h-4 w-4 text-routiq-blackberry/60" />
                <span className="text-sm text-routiq-blackberry/60">Export</span>
              </button>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-routiq-blackberry/60">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-routiq-core font-medium">Patient Insights</span>
            {activeTab !== 'all-patients' && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-routiq-core font-medium capitalize">
                  {activeTab.replace('-', ' ')}
                </span>
              </>
            )}
          </div>

          {/* Global Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-routiq-blackberry/50 h-4 w-4" />
              <Input
                placeholder="Search patients, metrics, opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-routiq-cloud/30 focus:border-routiq-core"
              />
            </div>
            
            {/* Data Freshness Indicator */}
            <div className="flex items-center gap-2 text-sm text-routiq-blackberry/60">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Main 3-Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-routiq-cloud/20 h-14 rounded-xl p-1 shadow-sm">
            {filteredTabs.includes('all-patients') && (
              <TabsTrigger 
                value="all-patients" 
                className="flex items-center gap-3 text-base font-medium text-routiq-blackberry/70 data-[state=active]:bg-routiq-cloud data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-routiq-cloud/10 hover:text-routiq-cloud rounded-lg transition-all duration-200"
              >
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div>All Patients</div>
                  <div className="text-xs opacity-70">Searchable patient data</div>
                </div>
              </TabsTrigger>
            )}
            
            {filteredTabs.includes('engagement-overview') && (
              <TabsTrigger 
                value="engagement-overview" 
                className="flex items-center gap-3 text-base font-medium text-routiq-blackberry/70 data-[state=active]:bg-routiq-cloud data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-routiq-cloud/10 hover:text-routiq-cloud rounded-lg transition-all duration-200"
              >
                <TrendingUp className="h-5 w-5" />
                <div className="text-left">
                  <div>Engagement Overview</div>
                  <div className="text-xs opacity-70">Risk analysis & metrics</div>
                </div>
              </TabsTrigger>
            )}
            
            {filteredTabs.includes('top-opportunities') && (
              <TabsTrigger 
                value="top-opportunities" 
                className="flex items-center gap-3 text-base font-medium text-routiq-blackberry/70 data-[state=active]:bg-routiq-cloud data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-routiq-cloud/10 hover:text-routiq-cloud rounded-lg transition-all duration-200"
              >
                <Target className="h-5 w-5" />
                <div className="text-left">
                  <div>Top Opportunities</div>
                  <div className="text-xs opacity-70">Re-engagement actions</div>
                </div>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            {/* All Patients Tab */}
            <TabsContent value="all-patients" className="space-y-6 mt-0">
              <AllPatientsTab searchTerm={searchTerm} />
            </TabsContent>

            {/* Engagement Overview Tab */}
            <TabsContent value="engagement-overview" className="space-y-6 mt-0">
              <EngagementOverviewTab />
            </TabsContent>

            {/* Top Opportunities Tab */}
            <TabsContent value="top-opportunities" className="space-y-6 mt-0">
              <TopOpportunitiesTab />
            </TabsContent>
          </div>
        </Tabs>


      </div>
    </div>
  )
} 