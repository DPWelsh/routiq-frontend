'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Download,
  RefreshCw
} from 'lucide-react'

// Import only the All Patients tab component (now the main Patient Overview)
import { AllPatientsTab } from './components/all-patients-tab'

/**
 * Patient Overview - Comprehensive Patient Database Management
 * 
 * Goal: Make every patient's journey trackable, measurable, and actionable
 * 
 * Features:
 * - Universal search and filtering
 * - Clickable KPI filters  
 * - Comprehensive patient database table
 */
export default function PatientInsightsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = () => {
    setLastUpdated(new Date())
    // Trigger data refresh
    console.log('🔄 Refreshing patient data...')
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Overview</h1>
            <p className="text-gray-600 text-lg">
              Comprehensive patient database with smart filtering and insights
            </p>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Refresh</span>
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Export</span>
            </button>
          </div>
        </div>

        {/* Patient Overview Content */}
        <AllPatientsTab searchTerm={searchTerm} />
      </div>
    </div>
  )
} 