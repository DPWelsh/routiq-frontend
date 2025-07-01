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
  Activity, 
  TrendingUp,
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Loader2,
  Search,
  Grid3X3,
  List,
  Filter
} from "lucide-react"
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { UpcomingAppointments } from '@/components/features/patients/upcoming-appointments'
import { usePatientsData } from '@/hooks/useDashboardData'
import { useRiskMetrics } from '@/hooks/useReengagementData'
import { PatientRiskData } from '@/lib/routiq-api'
import { PatientRiskTable } from '@/components/features/patients/patient-risk-table'

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

  // Get risk metrics data (the actual API you're using)
  const { 
    data: riskMetricsData, 
    isLoading: riskMetricsLoading,
    error: riskMetricsError 
  } = useRiskMetrics(organizationId || '')
  
  // Local state for filtering and search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')


  // Extract patients data from risk metrics API - include all patients now
  const allPatients = riskMetricsData?.patients || []
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
        patient.patient_name?.toLowerCase().includes(searchLower) ||
        patient.phone?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((patient: Patient) => {
        switch (statusFilter) {
          case 'active':
            return patient.engagement_status === 'active'
          case 'dormant':
            return patient.engagement_status === 'dormant'
          case 'stale':
            return patient.engagement_status === 'stale'
          case 'upcoming':
            return patient.upcoming_appointment_count > 0
          default:
            return true
        }
      })
    }
    
    // Apply risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter((patient: Patient) => {
        switch (riskFilter) {
          case 'low':
            return patient.risk_level === 'low'
          case 'medium':
            return patient.risk_level === 'medium' 
          case 'high':
            return patient.risk_level === 'high'
          default:
            return true
        }
      })
    }
    
    return filtered
  }, [allPatients, searchTerm, statusFilter, riskFilter])

  // Get displayed patients for card view only
  const displayedPatients = useMemo(() => {
    return filteredPatients.slice(0, 20) // Fixed limit for card view
  }, [filteredPatients])

  // Create stats from patients data
  const stats = useMemo(() => {
    if (!allPatients.length) return null
    
    const activePatients = allPatients.filter((p: Patient) => p.is_active).length
    const patientsWithUpcoming = allPatients.filter((p: Patient) => p.upcoming_appointment_count > 0).length
    const patientsWithRecent = allPatients.filter((p: Patient) => p.recent_appointment_count > 0).length
    
    return {
      overview: {
        totalPatients: totalCount,
        activePatients,
        inactivePatients: totalCount - activePatients,
        patientsWithRecentActivity: patientsWithRecent,
        activityRate: totalCount > 0 ? (activePatients / totalCount) * 100 : 0
      }
    }
  }, [allPatients, totalCount, organizationId])

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

  const getEngagementLevel = (patient: Patient) => {
    // Combine risk level and engagement status for priority display
    if (patient.engagement_status === 'stale') {
      return { level: 'Stale', color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
    
    switch (patient.risk_level) {
      case 'high':
        return { level: 'High Risk', color: 'bg-red-100 text-red-800', icon: AlertCircle }
      case 'medium':
        return { level: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      case 'low':
        return { level: 'Low Risk', color: 'bg-green-100 text-green-800', icon: UserCheck }
      default:
        return { level: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'No phone'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const PatientCard = ({ patient }: { patient: Patient }) => {
    const engagement = getEngagementLevel(patient)
    const EngagementIcon = engagement.icon
    
    return (
      <div
        className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white"
        onClick={() => handlePatientClick(patient.phone)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{patient.patient_name}</h3>
              <Badge className={`${engagement.color} text-xs`}>
                <EngagementIcon className="h-3 w-3 mr-1" />
                {engagement.level}
              </Badge>
              {patient.is_active && (
                <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                  Active
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {formatPhoneNumber(patient.phone)}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {patient.email || 'No email'}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-500" />
                <span>{patient.upcoming_appointment_count} upcoming</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span>{patient.recent_appointment_count} recent</span>
              </div>
            </div>
            
            {patient.next_appointment_time && (
              <div className="mt-2 text-sm text-gray-600">
                Next: {new Date(patient.next_appointment_time).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 text-sm">Manage patient engagement and appointments</p>
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
            <Loader2 className="h-4 w-4 animate-spin" />
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



        {/* Patient List Section */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-lg">
                Patients ({filteredPatients.length})
              </CardTitle>
              
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className="h-7 px-2"
                  >
                    <Grid3X3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-7 px-2"
                  >
                    <List className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
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
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-2 text-gray-600">Loading patients...</p>
                          </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
                          </div>
            ) : (
              <>
                {viewMode === 'card' ? (
                  <div className="grid gap-3">
                    {displayedPatients.map((patient) => (
                      <PatientCard key={patient.patient_id} patient={patient} />
                    ))}
                  </div>
                ) : (
                  <PatientRiskTable 
                    data={filteredPatients}
                    onPatientClick={handlePatientClick}
                  />
                )}

              </>
            )}
                        </CardContent>
                      </Card>
      </div>
    </div>
  )
} 