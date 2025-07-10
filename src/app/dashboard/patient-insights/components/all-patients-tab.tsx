'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search,
  Filter,
  Users,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Download,
  Plus,
  TrendingUp,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  UserX,
  CalendarX,
  ShieldAlert,
  CircleDollarSign,
  UserCheck,
  Crown,
  Zap,
  Target,
  Heart,
  MessageCircle
} from 'lucide-react'

interface AllPatientsTabProps {
  searchTerm: string
}

type FilterType = 'all' | 'active' | 'at-risk' | 'high-ltv' | 'upcoming' | 'dormant' | 'vips' | 'top-opportunities'

interface AutomationStatus {
  title: string
  description: string
  progress: number
  automationStatus: string
  nextAction: string
  nextDate: string
}

/**
 * Patient Overview - Comprehensive Patient Database
 * 
 * Structure:
 * 1. Search & Filters (Top Bar) - Universal search + Quick filters
 * 2. Summary KPIs (Strip Below Search) - Clickable visual filters
 * 3. Patient Database Table - Core patient data with specific columns
 */
export function AllPatientsTab({ searchTerm }: AllPatientsTabProps) {
  const [tableSearchTerm, setTableSearchTerm] = useState(searchTerm || '')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  // Mock patient data - will be replaced with real API data
  const mockPatients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+61 423 567 890',
      email: 'sarah.johnson@email.com',
      ltv: 2450,
      totalSessions: 14,
      lastAppointment: '2025-07-15',
      nextAppointment: '2025-08-05',
      lastContacted: 3, // 3 days ago
      noShows: 1,
      status: 'Active',
      riskLevel: 'low',
      isVip: false,
      automation: {
        title: 'Routine Care',
        description: 'Follow-up Scheduled',
        progress: 75,
        automationStatus: 'Active',
        nextAction: 'Appointment Reminder',
        nextDate: '28/07/2025'
      }
    },
    {
      id: '2', 
      name: 'Michael Chen',
      phone: '+61 456 789 123',
      email: 'michael.chen@email.com',
      ltv: 4850,
      totalSessions: 23,
      lastAppointment: '2025-07-12',
      nextAppointment: null, // Removed upcoming appointment
      lastContacted: 1, // 1 day ago
      noShows: 0,
      status: 'At-Risk',
      riskLevel: 'medium',
      isVip: true,
      automation: {
        title: 'Reengagement Campaign',
        description: 'Follow-up Email Sent',
        progress: 65,
        automationStatus: 'Active',
        nextAction: 'Personal Outreach Call',
        nextDate: '30/07/2025'
      }
    },
    {
      id: '3',
      name: 'Emma Wilson',
      phone: '+61 789 123 456',
      email: 'emma.wilson@email.com',
      ltv: 890,
      totalSessions: 6,
      lastAppointment: '2025-06-22',
      nextAppointment: null, // At-risk patient, no appointment scheduled
      lastContacted: 45, // 45 days ago
      noShows: 3,
      status: 'At-Risk',
      riskLevel: 'high',
      isVip: false,
      automation: {
        title: 'High-Risk Intervention',
        description: 'Phone Call Scheduled',
        progress: 60,
        automationStatus: 'Priority',
        nextAction: 'Personal Outreach Call',
        nextDate: '24/07/2025'
      }
    },
    {
      id: '4',
      name: 'James Rodriguez',
      phone: '+61 321 654 987',
      email: 'james.rodriguez@email.com',
      ltv: 3200,
      totalSessions: 16,
      lastAppointment: '2025-07-18',
      nextAppointment: null, // Removed upcoming appointment
      lastContacted: 2, // 2 days ago
      noShows: 0,
      status: 'At-Risk',
      riskLevel: 'medium',
      isVip: true,
      automation: {
        title: 'Reengagement Campaign',
        description: 'SMS Follow-up Sent',
        progress: 55,
        automationStatus: 'Active',
        nextAction: 'Schedule Consultation',
        nextDate: '26/07/2025'
      }
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      phone: '+61 654 987 321',
      email: 'lisa.thompson@email.com',
      ltv: 1340,
      totalSessions: 9,
      lastAppointment: '2025-06-10',
      nextAppointment: null, // Dormant patient, no appointment scheduled
      lastContacted: 38, // 38 days ago
      noShows: 2,
      status: 'Dormant',
      riskLevel: 'medium',
      isVip: false,
      automation: {
        title: 'Reengagement Campaign',
        description: 'Email Sent - Awaiting Response',
        progress: 40,
        automationStatus: 'Active',
        nextAction: 'SMS Follow-up',
        nextDate: '25/07/2025'
      }
    },
    {
      id: '6',
      name: 'David Kim',
      phone: '+61 987 654 321',
      email: 'david.kim@email.com',
      ltv: 5600,
      totalSessions: 28,
      lastAppointment: '2025-07-20',
      nextAppointment: null, // Removed upcoming appointment
      lastContacted: 1, // 1 day ago
      noShows: 0,
      status: 'At-Risk',
      riskLevel: 'medium',
      isVip: true,
      automation: {
        title: 'Reengagement Campaign',
        description: 'WhatsApp Message Sent',
        progress: 40,
        automationStatus: 'Active',
        nextAction: 'Appointment Booking',
        nextDate: '29/07/2025'
      }
    },
    {
      id: '7',
      name: 'Anna Martinez',
      phone: '+61 234 567 890',
      email: 'anna.martinez@email.com',
      ltv: 720,
      totalSessions: 4,
      lastAppointment: '2025-06-15',
      nextAppointment: null, // At-risk patient, no appointment scheduled
      lastContacted: 52, // 52 days ago
      noShows: 4,
      status: 'At-Risk',
      riskLevel: 'high',
      isVip: false,
      automation: {
        title: 'High-Risk Intervention',
        description: 'Urgent Retention Protocol',
        progress: 25,
        automationStatus: 'Priority',
        nextAction: 'Emergency Contact',
        nextDate: '23/07/2025'
      }
    },
    {
      id: '8',
      name: 'Rebecca Collins',
      phone: '+61 429 876 543',
      email: 'rebecca.collins@email.com',
      ltv: 1890,
      totalSessions: 12,
      lastAppointment: '2025-07-22',
      nextAppointment: '2025-08-03',
      lastContacted: 4, // 4 days ago
      noShows: 0,
      status: 'Active',
      riskLevel: 'low',
      isVip: false,
      automation: {
        title: 'Routine Care',
        description: 'Check-in Email Sent',
        progress: 80,
        automationStatus: 'Active',
        nextAction: 'Appointment Reminder',
        nextDate: '01/08/2025'
      }
    },
    {
      id: '9',
      name: 'Tyler Murphy',
      phone: '+61 412 345 678',
      email: 'tyler.murphy@email.com',
      ltv: 2340,
      totalSessions: 18,
      lastAppointment: '2025-07-19',
      nextAppointment: '2025-07-31',
      lastContacted: 2, // 2 days ago
      noShows: 1,
      status: 'Active',
      riskLevel: 'low',
      isVip: false,
      automation: {
        title: 'Routine Care',
        description: 'Progress Update Scheduled',
        progress: 65,
        automationStatus: 'Active',
        nextAction: 'Progress Assessment',
        nextDate: '29/07/2025'
      }
    },
    {
      id: '10',
      name: 'Sophie Anderson',
      phone: '+61 467 234 891',
      email: 'sophie.anderson@email.com',
      ltv: 3140,
      totalSessions: 21,
      lastAppointment: '2025-07-21',
      nextAppointment: '2025-08-07',
      lastContacted: 3, // 3 days ago
      noShows: 0,
      status: 'Active',
      riskLevel: 'low',
      isVip: false,
      automation: {
        title: 'Routine Care',
        description: 'Wellness Plan Review',
        progress: 90,
        automationStatus: 'Active',
        nextAction: 'Treatment Plan Update',
        nextDate: '04/08/2025'
      }
    }
  ]

  // Calculate summary statistics
  const totalPatients = mockPatients.length
  const activePatients = mockPatients.filter(p => p.status === 'Active' && p.nextAppointment !== null).length
  const dormantPatients = mockPatients.filter(p => p.status === 'Dormant').length
  const atRiskPatients = mockPatients.filter(p => p.status === 'At-Risk').length
  const topOpportunityPatients = mockPatients.filter(p => {
    const daysSinceContact = Math.floor((Date.now() - new Date(p.lastContacted).getTime()) / (1000 * 60 * 60 * 24))
    return (p.ltv >= 3000 && (p.status === 'At-Risk' || p.status === 'Dormant')) || 
           (p.isVip && daysSinceContact > 10)
  }).length

  // Filter patients based on active filter
  const getFilteredPatients = () => {
    let filtered = mockPatients

    // Apply search filter
    if (tableSearchTerm) {
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        patient.phone.includes(tableSearchTerm) ||
        patient.email.toLowerCase().includes(tableSearchTerm.toLowerCase())
      )
    }

    // Apply active filter
    switch (activeFilter) {
      case 'active':
        filtered = filtered.filter(p => p.status === 'Active' && p.nextAppointment !== null)
        break
      case 'at-risk':
        filtered = filtered.filter(p => p.status === 'At-Risk')
        break
      case 'high-ltv':
        filtered = filtered.filter(p => p.ltv >= 3000)
        break
      case 'upcoming':
        filtered = filtered.filter(p => p.nextAppointment !== null)
        break
      case 'dormant':
        filtered = filtered.filter(p => p.status === 'Dormant')
        break
      case 'vips':
        filtered = filtered.filter(p => p.isVip)
        break
      case 'top-opportunities':
        filtered = filtered.filter(p => {
          const daysSinceContact = Math.floor((Date.now() - new Date(p.lastContacted).getTime()) / (1000 * 60 * 60 * 24))
          return (p.ltv >= 3000 && (p.status === 'At-Risk' || p.status === 'Dormant')) || 
                 p.isVip
        })
        break
      default:
        // 'all' - no additional filtering
        break
    }

    return filtered
  }

  const filteredPatients = getFilteredPatients()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 shadow-sm border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
            Active
          </span>
        )
      case 'Dormant':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 shadow-sm border border-yellow-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5"></div>
            Dormant
          </span>
        )
      case 'At-Risk':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-rose-100 text-red-800 shadow-sm border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
            At-Risk
          </span>
        )
      case 'Priority':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 shadow-sm border border-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5 animate-pulse"></div>
            Priority
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 shadow-sm border border-gray-200">
            Unknown
          </span>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDaysAgo = (days: number) => {
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  const getAutomationStatusBadge = (automationStatus: string) => {
    switch (automationStatus) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <Play className="w-3 h-3 mr-1" />
            Active
          </span>
        )
      case 'Priority':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Priority
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Paused
          </span>
        )
    }
  }

  const getAutomationIcon = (title: string) => {
    switch (title) {
      case 'VIP Care Journey':
        return <Crown className="w-4 h-4 text-purple-600" />
      case 'High-Risk Intervention':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'Reengagement Campaign':
        return <MessageCircle className="w-4 h-4 text-blue-600" />
      case 'Routine Care':
        return <Heart className="w-4 h-4 text-green-600" />
      default:
        return <Zap className="w-4 h-4 text-gray-600" />
    }
  }

  const renderAutomationStatus = (automation: AutomationStatus) => {
    return (
      <div className="space-y-2">
        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getAutomationIcon(automation.title)}
            <div>
              <div className="text-sm font-medium text-gray-900">{automation.title}</div>
              <div className="text-xs text-gray-600">{automation.description}</div>
            </div>
          </div>
          {getAutomationStatusBadge(automation.automationStatus)}
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
              <div 
                className={`h-1.5 rounded-full ${
                  automation.automationStatus === 'Priority' ? 'bg-orange-500' : 'bg-blue-500'
                }`}
                style={{ width: `${automation.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 font-medium">{automation.progress}%</span>
          </div>
        </div>
        
        {/* Next Action */}
        <div className="flex items-center text-xs text-gray-600">
          <Clock className="w-3 h-3 mr-1" />
          <span className="mr-1">Next:</span>
          <span className="font-medium">{automation.nextAction}</span>
          <ArrowRight className="w-3 h-3 mx-1" />
          <span>{automation.nextDate}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Search & Filters (Top Bar) */}
      <div className="space-y-6">
        {/* Main Patient Search - Prominent */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={tableSearchTerm}
                onChange={(e) => setTableSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-gray-300 focus:border-routiq-core shadow-sm bg-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-gray-300 hover:!bg-[#93B3E4]/80 hover:!text-white hover:!border-[#93B3E4]/80 transition-all duration-150 ease-out [backface-visibility:hidden] [transform:translate3d(0,0,0)]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button className="bg-routiq-core hover:bg-routiq-core/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* 2. Summary KPIs (Strip Below Search Bar) - Clickable Visual Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* 1. All Patients */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border transform hover:scale-105 ${
              activeFilter === 'all' 
                ? 'border-slate-300 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 shadow-lg shadow-slate-200' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-gray-50 hover:border-slate-300 hover:shadow-md'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  activeFilter === 'all' 
                    ? 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <Users className={`h-6 w-6 ${activeFilter === 'all' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${activeFilter === 'all' ? 'text-slate-700' : 'text-gray-600'}`}>
                    {totalPatients}
                  </div>
                  <div className={`text-xs font-medium ${activeFilter === 'all' ? 'text-slate-600' : 'text-gray-500'}`}>
                    All Patients
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 2. Active Patients */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border transform hover:scale-105 ${
              activeFilter === 'active' 
                ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 shadow-lg shadow-emerald-100' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-emerald-25 hover:to-green-25 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-50'
            }`}
            onClick={() => setActiveFilter('active')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  activeFilter === 'active' 
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <TrendingUp className={`h-6 w-6 ${activeFilter === 'active' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${activeFilter === 'active' ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {activePatients}
                  </div>
                  <div className={`text-xs font-medium ${activeFilter === 'active' ? 'text-emerald-600' : 'text-gray-500'}`}>
                    Active
                  </div>
                  <div className={`text-xs ${activeFilter === 'active' ? 'text-emerald-500' : 'text-gray-400'} mt-0.5`}>
                    Has upcoming appointment
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 3. Dormant Patients */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border transform hover:scale-105 ${
              activeFilter === 'dormant' 
                ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 shadow-lg shadow-amber-100' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-amber-25 hover:to-yellow-25 hover:border-amber-200 hover:shadow-md hover:shadow-amber-50'
            }`}
            onClick={() => setActiveFilter('dormant')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  activeFilter === 'dormant' 
                    ? 'bg-gradient-to-br from-amber-300 to-yellow-400 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <UserCheck className={`h-6 w-6 ${activeFilter === 'dormant' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${activeFilter === 'dormant' ? 'text-amber-700' : 'text-gray-600'}`}>
                    {dormantPatients}
                  </div>
                  <div className={`text-xs font-medium ${activeFilter === 'dormant' ? 'text-amber-600' : 'text-gray-500'}`}>
                    Dormant
                  </div>
                  <div className={`text-xs ${activeFilter === 'dormant' ? 'text-amber-500' : 'text-gray-400'} mt-0.5`}>
                    No appointment in 30+ days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 4. At Risk Patients */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border transform hover:scale-105 ${
              activeFilter === 'at-risk' 
                ? 'border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-red-50 shadow-lg shadow-red-100' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-red-25 hover:to-rose-25 hover:border-red-200 hover:shadow-md hover:shadow-red-50'
            }`}
            onClick={() => setActiveFilter('at-risk')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  activeFilter === 'at-risk' 
                    ? 'bg-gradient-to-br from-red-400 to-rose-500 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <AlertTriangle className={`h-6 w-6 ${activeFilter === 'at-risk' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${activeFilter === 'at-risk' ? 'text-red-700' : 'text-gray-600'}`}>
                    {atRiskPatients}
                  </div>
                  <div className={`text-xs font-medium ${activeFilter === 'at-risk' ? 'text-red-600' : 'text-gray-500'}`}>
                    At Risk
                  </div>
                  <div className={`text-xs ${activeFilter === 'at-risk' ? 'text-red-500' : 'text-gray-400'} mt-0.5`}>
                    No scheduled appointment
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 5. Top Opportunities */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border transform hover:scale-105 ${
              activeFilter === 'top-opportunities' 
                ? 'border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 shadow-lg shadow-orange-100' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-orange-25 hover:to-amber-25 hover:border-orange-200 hover:shadow-md hover:shadow-orange-50'
            }`}
            onClick={() => setActiveFilter('top-opportunities')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  activeFilter === 'top-opportunities' 
                    ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <Star className={`h-6 w-6 ${activeFilter === 'top-opportunities' ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${activeFilter === 'top-opportunities' ? 'text-orange-700' : 'text-gray-600'}`}>
                    {topOpportunityPatients}
                  </div>
                  <div className={`text-xs font-medium ${activeFilter === 'top-opportunities' ? 'text-orange-600' : 'text-gray-500'}`}>
                    Top Opportunities
                  </div>
                  <div className={`text-xs ${activeFilter === 'top-opportunities' ? 'text-orange-500' : 'text-gray-400'} mt-0.5`}>
                    High LTV, no upcoming appointment
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Patient Database Table (Core Section) */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient Database
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {totalPatients} patients
                {activeFilter !== 'all' && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilter.replace('-', ' ')}
                  </Badge>
                )}
              </div>
              
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('all')}
                    className={`cursor-pointer ${activeFilter === 'all' ? 'bg-slate-100 text-slate-900' : ''}`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    All Patients
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('active')}
                    className={`cursor-pointer ${activeFilter === 'active' ? 'bg-emerald-50 text-emerald-900' : ''}`}
                  >
                    <TrendingUp className="h-4 w-4 mr-2 text-emerald-600" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('at-risk')}
                    className={`cursor-pointer ${activeFilter === 'at-risk' ? 'bg-red-50 text-red-900' : ''}`}
                  >
                    <ShieldAlert className="h-4 w-4 mr-2 text-red-600" />
                    At Risk
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('high-ltv')}
                    className={`cursor-pointer ${activeFilter === 'high-ltv' ? 'bg-emerald-50 text-emerald-900' : ''}`}
                  >
                    <CircleDollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                    High LTV
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('upcoming')}
                    className={`cursor-pointer ${activeFilter === 'upcoming' ? 'bg-blue-50 text-blue-900' : ''}`}
                  >
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Upcoming Appointments
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('dormant')}
                    className={`cursor-pointer ${activeFilter === 'dormant' ? 'bg-amber-50 text-amber-900' : ''}`}
                  >
                    <UserCheck className="h-4 w-4 mr-2 text-amber-600" />
                    Dormant
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('vips')}
                    className={`cursor-pointer ${activeFilter === 'vips' ? 'bg-purple-50 text-purple-900' : ''}`}
                  >
                    <Crown className="h-4 w-4 mr-2 text-purple-600" />
                    VIPs
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setActiveFilter('top-opportunities')}
                    className={`cursor-pointer ${activeFilter === 'top-opportunities' ? 'bg-orange-50 text-orange-900' : ''}`}
                  >
                    <Star className="h-4 w-4 mr-2 text-orange-600" />
                    Top Opportunities
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    LTV
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    No. Sessions
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    Last Appt
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    Next Appt
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    No. of upcoming
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 w-40">
                    Automation Journey
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-40">
                    Patient Status
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                                 {filteredPatients.map((patient) => (
                   <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 border-r border-gray-200 w-40">
                       <div className="flex items-center">
                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-routiq-core to-routiq-energy flex items-center justify-center text-white font-semibold text-sm relative">
                           {patient.name.split(' ').map(n => n[0]).join('')}
                           {patient.isVip && (
                             <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                           )}
                         </div>
                         <div className="ml-3">
                           <div className="text-sm font-medium text-gray-900 mb-1">
                             {patient.name}
                                                        {patient.isVip && (
                             <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-800">
                               VIP
                             </Badge>
                           )}
                           </div>
                           <div className="space-y-1">
                             <div className="flex items-center text-xs text-gray-600">
                               <Phone className="h-3 w-3 mr-1" />
                               {patient.phone}
                             </div>
                             <div className="flex items-center text-xs text-gray-500">
                               <Mail className="h-3 w-3 mr-1" />
                               {patient.email}
                             </div>
                           </div>
                         </div>
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 w-40 text-center">
                       <div className="text-sm font-semibold text-gray-900">
                         {formatCurrency(patient.ltv)}
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 w-40 text-center">
                       <div className="text-sm font-medium text-gray-800">
                         {patient.totalSessions}
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 w-40 text-center">
                       <div className="text-sm text-gray-700">
                         {formatDate(patient.lastAppointment)}
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 w-40 text-center">
                       <div className={`text-sm ${
                         patient.nextAppointment 
                           ? 'text-green-700 font-medium' 
                           : 'text-gray-400 italic'
                       }`}>
                         {patient.nextAppointment ? formatDate(patient.nextAppointment) : 'Not scheduled'}
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 w-40 text-center">
                       <div className="text-sm font-medium text-gray-700">
                         {patient.nextAppointment ? 1 : 0}
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 w-40 text-center">
                       <div className={`text-sm ${
                         patient.lastContacted <= 7 ? 'text-green-700' : 
                         patient.lastContacted <= 30 ? 'text-amber-600' : 
                         'text-red-600'
                       }`}>
                         {formatDaysAgo(patient.lastContacted)}
                       </div>
                     </td>
                     
                     <td className="px-6 py-4 border-r border-gray-200 w-40">
                       {renderAutomationStatus(patient.automation)}
                     </td>
                     
                     <td className="px-6 py-4 whitespace-nowrap w-40 text-center">
                       {getStatusBadge(patient.isVip ? 'Priority' : patient.status)}
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} results
                {activeFilter !== 'all' && ` (filtered by ${activeFilter.replace('-', ' ')})`}
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
                <Button variant="outline" size="sm" disabled className="border-gray-300">
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled className="border-gray-300">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
} 