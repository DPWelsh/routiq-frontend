'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Users
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

  return (
    <div className="min-h-screen bg-routiq-cloud/5">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div>
            <h1 className="text-3xl font-bold text-routiq-core">Patient Overview</h1>
            <p className="text-routiq-blackberry/70 text-lg">
              Comprehensive patient database with smart filtering and insights
            </p>
          </div>
        </div>

        {/* Patient Overview Content */}
        <AllPatientsTab searchTerm={searchTerm} />
      </div>
    </div>
  )
} 