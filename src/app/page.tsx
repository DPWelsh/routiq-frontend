'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Calendar, Clock, AlertTriangle, Search, RefreshCw, Phone, Mail, TrendingUp, TrendingDown, Activity, MoreHorizontal, MessageCircle } from 'lucide-react'
import { ActivePatient, ActivePatientsStats, ChurnRiskLevel, PatientSegment, RebookingPriority } from '@/lib/database/clients/active-patients'
import { BlurFade, NumberTicker } from '@/components/magicui'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// FIXED: Define the actual API response structure for stats
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

export default function HomePage() {
  const [patients, setPatients] = useState<ActivePatient[]>([])
  const [allPatients, setAllPatients] = useState<ActivePatient[]>([]) // For card calculations
  const [stats, setStats] = useState<ActivePatientsApiStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const handlePatientClick = (phone: string) => {
    // Navigate to the same conversation page as "View Conversation"
    handleViewConversation(phone)
  }

  const handleViewConversation = (phone: string) => {
    // For now, just log - can be extended with actual conversation functionality
    console.log('View conversation for phone:', phone)
  }

  const handleCallPatient = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self')
    }
  }

  const handleEmailPatient = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_self')
    }
  }

  const fetchPatients = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams()
      if (filterType !== 'all') {
        searchParams.append('filter', filterType)
      }
      
      const response = await fetch(`/api/active-patients?${searchParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      // FIXED: API returns structured response with success, data, meta
      if (result.success && Array.isArray(result.data)) {
        setPatients(result.data)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      setPatients([])
    }
  }, [filterType])

  const fetchAllPatients = useCallback(async () => {
    try {
      // Always fetch unfiltered patients for card calculations
      const response = await fetch('/api/active-patients')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      // FIXED: API returns structured response with success, data, meta
      if (result.success && Array.isArray(result.data)) {
        setAllPatients(result.data)
      } else {
        setAllPatients([])
      }
    } catch (error) {
      console.error('Error fetching all patients:', error)
      setAllPatients([])
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/active-patients/stats')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      // FIXED: API returns nested data structure
      if (result.success && result.data) {
        setStats(result.data)
      } else {
        setStats(null)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats(null)
    }
  }, [])

  const handleRefresh = async () => {
    if (refreshing || loading) return // Prevent multiple simultaneous refreshes
    
    try {
      setRefreshing(true)
      await Promise.all([fetchPatients(), fetchAllPatients(), fetchStats()])
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const refreshPatientData = async (patientId: number) => {
    try {
      const response = await fetch(`/api/active-patients/${patientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })
      
      if (response.ok) {
        await fetchPatients()
      }
    } catch (error) {
      console.error('Error refreshing patient data:', error)
    }
  }

  // FIXED: Initial data loading - runs only once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        
        // Load all data in parallel for better performance
        await Promise.all([
          fetchPatients(),
          fetchAllPatients(),
          fetchStats()
        ])
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, []) // Only run on mount

  // Re-fetch patients when filter changes
  useEffect(() => {
    if (!loading) {
      fetchPatients()
    }
  }, [filterType, fetchPatients, loading])

  const formatDate = (dateInput: string | Date | null): string => {
    if (!dateInput) return 'Never'
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return ''
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Handle different phone number formats
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
    
    return phone // Return original if format is unclear
  }

  const getChurnRiskColor = (risk: ChurnRiskLevel): string => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'  
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSegmentColor = (segment: PatientSegment) => {
    switch (segment) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'regular': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'new': return 'bg-green-100 text-green-800 border-green-200'
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRebookingPriorityColor = (priority: RebookingPriority): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMomentumIcon = (momentum: string) => {  
    switch (momentum) {
      case 'building': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'maintaining': return <Activity className="h-4 w-4 text-blue-600" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-orange-600" />
      case 'stalled': return <Clock className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Inner pulsing ring */}
          <div className="absolute inset-2 w-16 h-16 border-2 border-blue-100 rounded-full animate-pulse"></div>
          
          {/* Routiq Logo placeholder */}
          <div className="w-20 h-20 flex items-center justify-center">
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Active Patients</h1>
                <p className="text-gray-600">Churn analysis and rebooking management</p>
              </div>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-6 space-y-6">
          {/* Priority Stats */}
          <BlurFade delay={0.1}>
            <div className="grid gap-4 md:grid-cols-6">
              <Card 
                className={cn(
                  "bg-white border-red-200 cursor-pointer hover:shadow-md hover:border-red-300 transition-all",
                  filterType === 'high' && "ring-2 ring-red-300 border-red-400"
                )}
                onClick={() => setFilterType('high')}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    High Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold text-red-700">
                    <NumberTicker value={allPatients.filter(p => p.rebooking_priority === 'high').length} />
                  </div>
                  <p className="text-xs text-red-500">30+ days since visit</p>
                </CardContent>
              </Card>
                      
              <Card 
                className={cn(
                  "bg-white border-orange-200 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all",
                  filterType === 'medium' && "ring-2 ring-orange-300 border-orange-400"
                )}
                onClick={() => setFilterType('medium')}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Medium Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold text-orange-700">
                    <NumberTicker value={allPatients.filter(p => p.rebooking_priority === 'medium').length} />
                  </div>
                  <p className="text-xs text-orange-500">No upcoming appointments</p>
                </CardContent>
              </Card>
                      
              <Card 
                className={cn(
                  "bg-white border-green-200 cursor-pointer hover:shadow-md hover:border-green-300 transition-all",
                  filterType === 'low' && "ring-2 ring-green-300 border-green-400"
                )}
                onClick={() => setFilterType('low')}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Low Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold text-green-700">
                    <NumberTicker value={allPatients.filter(p => p.rebooking_priority === 'low').length} />
                  </div>
                  <p className="text-xs text-green-500">Already scheduled</p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "bg-white border-blue-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all",
                  filterType === 'active' && "ring-2 ring-blue-300 border-blue-400"
                )}
                onClick={() => setFilterType('active')}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Active Patients
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold text-blue-700">
                    <NumberTicker value={stats?.overview?.activePatients || allPatients.length} />
                  </div>
                  <p className="text-xs text-blue-500">Recently engaged</p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "bg-white border-gray-200 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all",
                  filterType === 'all' && "ring-2 ring-gray-300 border-gray-400"
                )}
                onClick={() => setFilterType('all')}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Patients
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold text-gray-700">
                    <NumberTicker value={allPatients.length} />
                  </div>
                  <p className="text-xs text-gray-500">Total patient base</p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "bg-white border-purple-200 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all",
                  filterType === 'upcoming' && "ring-2 ring-purple-300 border-purple-400"
                )}
                onClick={() => setFilterType('upcoming')}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-2xl font-bold text-purple-700">
                    <NumberTicker value={allPatients.filter(p => p.upcoming_appointment_count > 0).length} />
                  </div>
                  <p className="text-xs text-purple-500">Future appointments</p>
                </CardContent>
              </Card>
            </div>
          </BlurFade>

          {/* Search and Filters */}
          <BlurFade delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] bg-white border-gray-300 hover:border-blue-400 focus:border-blue-400 transition-colors">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-40 p-1 w-[180px]">
                  <SelectItem value="all" className="px-3 py-2 rounded-md hover:bg-gray-50 focus:bg-gray-50 text-gray-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium">All Patients</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high" className="px-3 py-2 rounded-md hover:bg-red-50 focus:bg-red-50 text-gray-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="font-medium">High Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="px-3 py-2 rounded-md hover:bg-orange-50 focus:bg-orange-50 text-gray-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="font-medium">Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="low" className="px-3 py-2 rounded-md hover:bg-green-50 focus:bg-green-50 text-gray-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Activity className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="font-medium">Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="active" className="px-3 py-2 rounded-md hover:bg-blue-50 focus:bg-blue-50 text-gray-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">Active Patients</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="upcoming" className="px-3 py-2 rounded-md hover:bg-purple-50 focus:bg-purple-50 text-gray-900 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <span className="font-medium">Upcoming Appointments</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </BlurFade>

          {/* Patients Table */}
          <BlurFade delay={0.3}>
            <Card className="bg-white border-gray-200 flex-1 flex flex-col min-h-0">
              <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Patient</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Contact</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900 text-sm">Appointments</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900 text-sm">Last Visit</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900 text-sm">Priority</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                              <Users className="h-12 w-12 text-gray-400" />
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">No patients found</h3>
                                <p className="text-sm text-gray-500">
                                  {searchTerm ? 'Try adjusting your search terms' : 'No patients match the current filters'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient, index) => (
                          <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            {/* Patient Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </span>
                                </div>
                                <div 
                                  className="cursor-pointer hover:text-blue-600 transition-colors"
                                  onClick={() => handlePatientClick(patient.phone)}
                                >
                                  <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">{formatPhoneNumber(patient.phone)}</p>
                                {patient.email && (
                                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{patient.email}</p>
                                )}
                              </div>
                            </td>

                            {/* Appointments */}
                            <td className="py-3 px-4 text-center">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {patient.total_appointment_count}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {patient.upcoming_appointment_count} upcoming
                                </p>
                              </div>
                            </td>

                            {/* Last Visit */}
                            <td className="py-3 px-4 text-center">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">
                                  {formatDate(patient.last_appointment_date)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {patient.days_since_last_appointment !== null && patient.days_since_last_appointment !== undefined
                                    ? patient.days_since_last_appointment > 0 
                                      ? `${patient.days_since_last_appointment} days ago`
                                      : `In ${Math.abs(patient.days_since_last_appointment)} days`
                                    : 'Unknown'
                                  }
                                </p>
                              </div>
                            </td>

                            {/* Priority */}
                            <td className="py-3 px-4 text-center">
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  getRebookingPriorityColor(patient.rebooking_priority as RebookingPriority)
                                )}
                              >
                                {patient.rebooking_priority}
                              </Badge>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg z-60 p-1">
                                  <DropdownMenuItem 
                                    onClick={() => handleViewConversation(patient.phone)}
                                    className="cursor-pointer hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 px-3 py-2 text-gray-900 transition-colors"
                                    disabled={!patient.phone}
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2 text-gray-600" />
                                    <span className="text-gray-900">View Details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleCallPatient(patient.phone)}
                                    className="cursor-pointer hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 px-3 py-2 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={!patient.phone}
                                  >
                                    <Phone className="h-4 w-4 mr-2 text-gray-600" />
                                    <span className="text-gray-900">Call Patient</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEmailPatient(patient.email)}
                                    className="cursor-pointer hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 px-3 py-2 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={!patient.email}
                                  >
                                    <Mail className="h-4 w-4 mr-2 text-gray-600" />
                                    <span className="text-gray-900">Email Patient</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => refreshPatientData(patient.id)}
                                    className="cursor-pointer hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 px-3 py-2 text-gray-900 transition-colors"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2 text-gray-600" />
                                    <span className="text-gray-900">Refresh Data</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  )
}
