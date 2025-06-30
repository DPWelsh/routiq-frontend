'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  Activity, 
  Phone, 
  Mail, 
  RefreshCw, 
  Loader2, 
  AlertCircle,
  UserCheck,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrganizationContext } from '@/hooks/useOrganizationContext'
import { UpcomingAppointments } from '@/components/features/patients/upcoming-appointments'
import { usePatientsData } from '@/hooks/useDashboardData'

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
  
  // Local state for filtering and search
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  
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
    
    return filtered
  }, [allPatients, searchTerm, filterType])

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
      },
      engagement: {
        totalConversations: 0,
        averageConversationsPerPatient: 0,
        patientsWithEscalations: 0,
        escalationRate: 0
      },
      sentiment: {
        averageScore: null,
        conversationsAnalyzed: 0
      },
      timeframe: {
        days: 30,
        includeInactive: false,
        dateThreshold: new Date().toISOString()
      },
      organizationContext: {
        organizationId: organizationId || '',
        userRole: 'user'
      },
      lastUpdated: new Date().toISOString()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
          <p className="text-gray-600">
            Manage and view patient engagement levels and appointment status
          </p>
        </div>

        {/* Error State */}
        {patientsError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Error loading patients: {patientsError.message}
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm" 
                className="ml-4"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold">{stats.overview.totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Patients</p>
                    <p className="text-2xl font-bold text-green-600">{stats.overview.activePatients}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">With Recent Activity</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.overview.patientsWithRecentActivity}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Activity Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.overview.activityRate.toFixed(1)}%</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <UpcomingAppointments />
        </div>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search patients by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={setFilterType} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="high">High Priority</TabsTrigger>
                <TabsTrigger value="medium">Medium Priority</TabsTrigger>
                <TabsTrigger value="low">Low Priority</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Has Upcoming</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Patients List */}
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-2 text-gray-600">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPatients.map((patient) => {
                  const engagement = getEngagementLevel(patient)
                  const EngagementIcon = engagement.icon
                  
                  return (
                    <div
                      key={patient.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePatientClick(patient.phone)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                            <Badge className={engagement.color}>
                              <EngagementIcon className="h-3 w-3 mr-1" />
                              {engagement.level}
                            </Badge>
                            {patient.is_active && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Active
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {formatPhoneNumber(patient.phone)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {patient.email || 'No email'}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>{patient.upcoming_appointment_count} upcoming</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-orange-500" />
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
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 