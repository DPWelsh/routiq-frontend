'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Search,
  Filter
} from "lucide-react"
import LoadingSpinner from "@/components/magicui/loading-spinner"
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { UpcomingAppointments } from '@/components/features/patients/upcoming-appointments'
import { usePatientsData } from '@/hooks/useDashboardData'
import { useRiskMetrics, usePrioritizedPatients } from '@/hooks/useReengagementData'
import { PatientRiskData } from '@/lib/routiq-api'
import { PatientRiskTable } from '@/components/features/patients/patient-risk-table'
import { PerformanceDashboard } from '@/components/features/reengagement'

// Use PatientRiskData from the API
type Patient = PatientRiskData

// Stats interface
interface ActivePatientsApiStats {
  overview: {
    totalPatients: number
    activePatients: number
    inactivePatients: number
    patientsWithRecentActivity: number
    activityRate: number
  }
  engagement: {
    totalConversations: number
    averageConversationsPerPatient: number
    patientsWithEscalations: number
    escalationRate: number
  }
  sentiment: {
    averageScore: number | null
    conversationsAnalyzed: number
  }
  timeframe: {
    days: number
    includeInactive: boolean
    dateThreshold: string
  }
  organizationContext: {
    organizationId: string
    userRole: string
  }
  lastUpdated: string
}

export default function PatientsPage() {
  const router = useRouter()
  const { organizationId } = useOrganizationContext()
  
  // Use the unified data flow architecture
  const { 
    data: patientsResponse, 
    isLoading, 
    error: patientsError,
    refetch: refetchPatients 
  } = usePatientsData(organizationId)

  // Get risk metrics summary for dashboard cards
  const { 
    data: riskMetricsData, 
    isLoading: riskMetricsLoading,
    error: riskMetricsError 
  } = useRiskMetrics(organizationId || '')

  // Get prioritized patients data (the new API)
  const { 
    data: prioritizedPatientsData, 
    isLoading: isPrioritizedLoading,
    error: prioritizedError 
  } = usePrioritizedPatients(organizationId || '', { limit: 200 })
  
  // Local state for filtering and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')

  // Extract patients data from prioritized patients API
  const allPatients = prioritizedPatientsData?.patients || []
  const totalCount = allPatients.length

  const handlePatientClick = (phone: string) => {
    router.push(`/dashboard/conversations/phone/${encodeURIComponent(phone)}`)
  }

  // Apply client-side filtering based on status and risk filters
  const filteredPatients = useMemo(() => {
    let filtered = allPatients
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(patient => 
        patient.name?.toLowerCase().includes(searchLower) ||
        patient.phone?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((patient: PatientRiskData) => {
        switch (statusFilter) {
          case 'active':
            return patient.engagement_status === 'active'
          case 'dormant':
            return patient.engagement_status === 'dormant'
          case 'stale':
            return patient.engagement_status === 'stale'
          case 'upcoming':
            return patient.next_scheduled_appointment !== null
          default:
            return true
        }
      })
    }
    
    // Apply risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter((patient: PatientRiskData) => {
        switch (riskFilter) {
          case 'low':
            return patient.risk_level === 'low'
          case 'medium':
            return patient.risk_level === 'medium' 
          case 'high':
            return patient.risk_level === 'high'
          case 'critical':
            return patient.risk_level === 'critical'
          case 'engaged':
            return patient.risk_level === 'engaged'
          default:
            return true
        }
      })
    }
    
    return filtered
  }, [allPatients, searchTerm, statusFilter, riskFilter])



  // Create stats from patients data
  const stats = useMemo(() => {
    if (!allPatients.length) return null
    
    const activePatients = allPatients.filter((p: PatientRiskData) => p.engagement_status === 'active').length
    const patientsWithUpcoming = allPatients.filter((p: PatientRiskData) => p.next_scheduled_appointment !== null).length
    const patientsWithRecent = allPatients.filter((p: PatientRiskData) => p.last_appointment_date !== null).length
    
    return {
      overview: {
        totalPatients: totalCount,
        activePatients,
        inactivePatients: totalCount - activePatients,
        patientsWithRecentActivity: patientsWithRecent,
        activityRate: totalCount > 0 ? (activePatients / totalCount) * 100 : 0
      }
    }
  }, [allPatients, totalCount])

  const handleRefresh = async () => {
    await refetchPatients()
  }

  // Handle card clicks to toggle filters additively
  const handleRiskCardToggle = (risk: 'high' | 'medium' | 'low') => {
    setRiskFilter(riskFilter === risk ? 'all' : risk)
  }

  const handleStatusCardToggle = (status: 'active' | 'dormant' | 'stale') => {
    setStatusFilter(statusFilter === status ? 'all' : status)
  }

  const handleClearAllFilters = () => {
    setRiskFilter('all')
    setStatusFilter('all')
    setSearchTerm('')
  }







  return (
    <div className="min-h-screen bg-routiq-cloud/5">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-routiq-core">Patient Management</h1>
              <p className="text-routiq-blackberry/70 text-lg">Manage patient engagement and appointments</p>
            </div>
            {patientsError && (
              <Alert className="max-w-md border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  Error loading patients. <Button onClick={handleRefresh} variant="link" className="p-0 h-auto text-red-800">Retry</Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Risk Level Filter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* High Risk Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 ${
              riskFilter === 'high' ? 'border-l-red-500 bg-red-50 ring-2 ring-red-200' : 'border-l-red-500 bg-white hover:bg-red-50'
            }`}
            onClick={() => handleRiskCardToggle('high')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">🚨 High Risk</p>
                  <p className="text-2xl font-bold text-red-600">
                    {allPatients.filter(p => p.risk_level === 'high').length}
                  </p>
                  <p className="text-xs text-gray-600">
                    Need immediate attention
                  </p>
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {riskFilter === 'high' ? 'Click to remove ×' : 'Click to filter →'}
                  </p>
                </div>
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              </CardContent>
            </Card>
                    
          {/* Medium Risk Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 ${
              riskFilter === 'medium' ? 'border-l-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-l-orange-500 bg-white hover:bg-orange-50'
            }`}
            onClick={() => handleRiskCardToggle('medium')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">📞 Medium Risk</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {allPatients.filter(p => p.risk_level === 'medium').length}
                  </p>
                  <p className="text-xs text-gray-600">
                    Important follow-ups
                  </p>
                  <p className="text-xs text-orange-600 font-medium mt-1">
                    {riskFilter === 'medium' ? 'Click to remove ×' : 'Click to filter →'}
                  </p>
                </div>
                <Clock className="h-7 w-7 text-orange-500" />
              </div>
              </CardContent>
            </Card>
                    
          {/* Low Risk Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 ${
              riskFilter === 'low' ? 'border-l-green-500 bg-green-50 ring-2 ring-green-200' : 'border-l-green-500 bg-white hover:bg-green-50'
            }`}
            onClick={() => handleRiskCardToggle('low')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">✅ Low Risk</p>
                  <p className="text-2xl font-bold text-green-600">
                    {allPatients.filter(p => p.risk_level === 'low').length}
                  </p>
                  <p className="text-xs text-gray-600">
                    Stable patients
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {riskFilter === 'low' ? 'Click to remove ×' : 'Click to filter →'}
                  </p>
                </div>
                <UserCheck className="h-7 w-7 text-green-500" />
              </div>
              </CardContent>
            </Card>

          {/* All Patients Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 ${
              statusFilter === 'all' && riskFilter === 'all' ? 'border-l-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-l-blue-500 bg-white hover:bg-blue-50'
            }`}
            onClick={handleClearAllFilters}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">📊 All Patients</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalCount}
                  </p>
                  <p className="text-xs text-gray-600">
                    Total in system
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Click to clear filters
                  </p>
                </div>
                <Users className="h-7 w-7 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
              statusFilter === 'active' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-green-25'
            }`}
            onClick={() => handleStatusCardToggle('active')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Active</p>
                  <p className="text-lg font-bold text-green-600">
                    {allPatients.filter(p => p.engagement_status === 'active').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {statusFilter === 'active' ? 'Click to remove' : 'Click to filter'}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
              statusFilter === 'dormant' ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white hover:bg-orange-25'
            }`}
            onClick={() => handleStatusCardToggle('dormant')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Dormant</p>
                  <p className="text-lg font-bold text-orange-600">
                    {allPatients.filter(p => p.engagement_status === 'dormant').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {statusFilter === 'dormant' ? 'Click to remove' : 'Click to filter'}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
              statusFilter === 'stale' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-25'
            }`}
            onClick={() => handleStatusCardToggle('stale')}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Stale</p>
                  <p className="text-lg font-bold text-gray-600">
                    {allPatients.filter(p => p.engagement_status === 'stale').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {statusFilter === 'stale' ? 'Click to remove' : 'Click to filter'}
                  </p>
                </div>
                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
              </div>
              </CardContent>
            </Card>
        </div>

        {/* Show risk metrics loading state */}
        {riskMetricsLoading && (
          <Alert className="mb-4">
            <LoadingSpinner size="sm" />
            <AlertDescription>
              Loading risk metrics...
            </AlertDescription>
          </Alert>
        )}

        {/* Show risk metrics error */}
        {riskMetricsError && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error loading risk metrics:</strong> {riskMetricsError.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Performance Dashboard */}
        {organizationId && (
          <div className="mb-6">
            <PerformanceDashboard organizationId={organizationId} />
          </div>
        )}

        {/* Patient List Section */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-lg">
                Patients ({filteredPatients.length})
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                </Button>
                </div>
          </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Active Filters Indicator */}
            {(statusFilter !== 'all' || riskFilter !== 'all' || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm font-medium text-blue-800">Active filters:</span>
                {statusFilter !== 'all' && (
                  <Badge variant="outline" className="bg-white border-blue-300 text-blue-700">
                    Status: {statusFilter}
                    <button 
                      onClick={() => setStatusFilter('all')} 
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {riskFilter !== 'all' && (
                  <Badge variant="outline" className="bg-white border-blue-300 text-blue-700">
                    Risk: {riskFilter}
                    <button 
                      onClick={() => setRiskFilter('all')} 
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="outline" className="bg-white border-blue-300 text-blue-700">
                    Search: &ldquo;{searchTerm}&rdquo;
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearAllFilters}
                  className="ml-auto h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Search and Manual Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                  placeholder="Search patients by name, phone, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                    />
                  </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="dormant">Dormant</SelectItem>
                    <SelectItem value="stale">Stale</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                          </div>

            {/* Patient List */}
            {(isLoading || isPrioritizedLoading) ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" text="Loading patients..." />
                          </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
                          </div>
            ) : (
              <PatientRiskTable 
                data={filteredPatients}
                onPatientClick={handlePatientClick}
                organizationId={organizationId || undefined}
              />
            )}
                        </CardContent>
                      </Card>
      </div>
    </div>
  )
} 