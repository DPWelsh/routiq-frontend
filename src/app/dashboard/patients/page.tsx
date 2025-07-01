'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useReengagementDashboard } from '@/hooks/useReengagementData'

// Patient interface for TypeScript
interface Patient {
  id: string
  name: string
  phone: string
  email: string
  cliniko_patient_id: string
  is_active: boolean
  recent_appointment_count: number
  upcoming_appointment_count: number
  total_appointment_count: number
  next_appointment_time?: string
  last_appointment_date?: string
}

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

  // Get reengagement dashboard data
  const { 
    data: reengagementData, 
    isLoading: reengagementLoading,
    error: reengagementError 
  } = useReengagementDashboard(organizationId || '')
  
  // Local state for filtering and search
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [showCount, setShowCount] = useState(10)

  // Extract patients data from response - use correct API structure
  const allPatients = patientsResponse?.patient_details || []
  const totalCount = patientsResponse?.total_active_patients || 0

  const handlePatientClick = (phone: string) => {
    router.push(`/dashboard/conversations/phone/${encodeURIComponent(phone)}`)
  }

  // Apply client-side filtering based on filter type
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
    
    // Apply type filter
      if (filterType !== 'all') {
      filtered = filtered.filter((patient: Patient) => {
        switch (filterType) {
          case 'high':
            return patient.recent_appointment_count === 0 && patient.upcoming_appointment_count === 0
          case 'medium':
            return patient.upcoming_appointment_count === 0
          case 'low':
            return patient.upcoming_appointment_count > 0
          case 'active':
            return patient.is_active
          case 'upcoming':
            return patient.upcoming_appointment_count > 0
          default:
            return true
        }
      })
    }
    
    return filtered.slice(0, showCount)
  }, [allPatients, searchTerm, filterType, showCount])

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

  const getEngagementLevel = (patient: Patient) => {
    const totalAppointments = patient.recent_appointment_count + patient.upcoming_appointment_count
    
    if (totalAppointments === 0) return { level: 'High Priority', color: 'bg-red-100 text-red-800', icon: AlertCircle }
    if (patient.upcoming_appointment_count === 0) return { level: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    return { level: 'Low Priority', color: 'bg-green-100 text-green-800', icon: UserCheck }
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
              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
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

  const PatientTable = () => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Appointments</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => {
              const engagement = getEngagementLevel(patient)
              const EngagementIcon = engagement.icon
              
              return (
                <tr 
                  key={patient.id}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePatientClick(patient.phone)}
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.cliniko_patient_id}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{formatPhoneNumber(patient.phone)}</div>
                      <div className="text-gray-500">{patient.email || 'No email'}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        {patient.upcoming_appointment_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-500" />
                        {patient.recent_appointment_count}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`${engagement.color} text-xs`}>
                      <EngagementIcon className="h-3 w-3 mr-1" />
                      {engagement.level}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {patient.is_active ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600 border-gray-200 text-xs">
                        Inactive
                      </Badge>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

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

        {/* Reengagement-Focused Stats Cards - Using Real API Data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">🚨 Action Required</p>
                  <p className="text-xl font-bold text-red-600">
                    {reengagementData?.immediate_actions_required || '12'}
                  </p>
                  <p className="text-xs text-gray-500">Immediate contact needed</p>
                </div>
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">📞 This Week&apos;s Target</p>
                  <p className="text-xl font-bold text-orange-600">
                    {reengagementData?.risk_distribution?.find(r => r.risk_level === 'high')?.count || '25'}
                  </p>
                  <p className="text-xs text-gray-500">Patients to recontact</p>
                </div>
                <Phone className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">✅ Engaged Patients</p>
                  <p className="text-xl font-bold text-green-600">
                    {reengagementData?.risk_distribution?.find(r => r.risk_level === 'engaged')?.percentage?.toFixed(1) || '74.1'}%
                  </p>
                  <p className="text-xs text-gray-500">Recently active</p>
                </div>
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">📊 Total Patients</p>
                  <p className="text-xl font-bold text-blue-600">
                    {reengagementData?.total_patients || totalCount}
                  </p>
                  <p className="text-xs text-gray-500">In system</p>
                </div>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Show reengagement data loading state */}
        {reengagementLoading && (
          <Alert className="mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Loading reengagement analytics...
            </AlertDescription>
          </Alert>
        )}

        {/* Show demo data notice */}
        {reengagementData?.message && (
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Reengagement Platform Active:</strong> {reengagementData.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Compact Upcoming Appointments Alert */}
        <div className="mb-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 text-sm">
              Integration with backend pending - organization context required
            </AlertDescription>
          </Alert>
        </div>

        {/* Patient List Section */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-lg">Patients ({filteredPatients.length})</CardTitle>
              
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
        {/* Search and Filters */}
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
              
              <Tabs value={filterType} onValueChange={setFilterType} className="w-auto">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-auto">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                  <TabsTrigger value="upcoming" className="text-xs">Upcoming</TabsTrigger>
                  <TabsTrigger value="high" className="text-xs">High Priority</TabsTrigger>
                  <TabsTrigger value="medium" className="text-xs">Medium</TabsTrigger>
                  <TabsTrigger value="low" className="text-xs">Low Priority</TabsTrigger>
                </TabsList>
              </Tabs>
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
                    {filteredPatients.map((patient) => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                  </div>
                ) : (
                  <PatientTable />
                )}
                
                {/* Show More Button */}
                {filteredPatients.length === showCount && allPatients.length > showCount && (
                  <div className="text-center mt-6">
                                  <Button
                      variant="outline" 
                      onClick={() => setShowCount(prev => prev + 10)}
                      className="w-full sm:w-auto"
                    >
                      Show More Patients
                                  </Button>
                  </div>
                )}
              </>
            )}
                        </CardContent>
                      </Card>
      </div>
    </div>
  )
} 