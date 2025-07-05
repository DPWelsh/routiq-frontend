'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Target
} from 'lucide-react'

interface AllPatientsTabProps {
  searchTerm: string
}

/**
 * All Patients Tab - PI-002: Patient Data Table Infrastructure
 * 
 * Features:
 * - Searchable table with Name, Phone, Email search
 * - Sortable columns: Name, LTV, Avg. Spend, Sessions, Last Appt, Status
 * - Status indicators: Active (green), Dormant (yellow), At-Risk (red)
 * - Pagination and real-time updates
 */
export function AllPatientsTab({ searchTerm }: AllPatientsTabProps) {
  const [tableSearchTerm, setTableSearchTerm] = useState(searchTerm || '')
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
      avgSpend: 180,
      totalSessions: 14,
      lastAppointment: '2024-01-15',
      lastContacted: '2024-01-20',
      noShows: 1,
      status: 'Active'
    },
    {
      id: '2', 
      name: 'Michael Chen',
      phone: '+61 456 789 123',
      email: 'michael.chen@email.com',
      ltv: 1850,
      avgSpend: 165,
      totalSessions: 11,
      lastAppointment: '2023-12-08',
      lastContacted: '2024-01-10',
      noShows: 0,
      status: 'Dormant'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      phone: '+61 789 123 456',
      email: 'emma.wilson@email.com',
      ltv: 890,
      avgSpend: 145,
      totalSessions: 6,
      lastAppointment: '2023-11-22',
      lastContacted: '2023-12-15',
      noShows: 3,
      status: 'At-Risk'
    },
    {
      id: '4',
      name: 'James Rodriguez',
      phone: '+61 321 654 987',
      email: 'james.rodriguez@email.com',
      ltv: 3200,
      avgSpend: 200,
      totalSessions: 16,
      lastAppointment: '2024-01-18',
      lastContacted: '2024-01-22',
      noShows: 0,
      status: 'Active'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      phone: '+61 654 987 321',
      email: 'lisa.thompson@email.com',
      ltv: 1340,
      avgSpend: 155,
      totalSessions: 9,
      lastAppointment: '2023-10-30',
      lastContacted: '2023-11-28',
      noShows: 2,
      status: 'At-Risk'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
            Active
          </span>
        )
      case 'Dormant':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1"></div>
            Dormant
          </span>
        )
      case 'At-Risk':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
            At-Risk
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-routiq-cloud/20 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-routiq-core bg-routiq-cloud/20 p-2 rounded-lg" />
              <div>
                <div className="text-2xl font-bold text-routiq-core">247</div>
                <div className="text-sm text-routiq-blackberry/60">Total Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-routiq-cloud/20 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600 bg-green-100 p-2 rounded-lg" />
              <div>
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-routiq-blackberry/60">Active Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-routiq-cloud/20 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-amber-600 bg-amber-100 p-2 rounded-lg" />
              <div>
                <div className="text-2xl font-bold text-amber-600">23</div>
                <div className="text-sm text-routiq-blackberry/60">At Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-routiq-cloud/20 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="h-8 w-8 text-routiq-prompt bg-routiq-prompt/20 p-2 rounded-lg" />
              <div>
                <div className="text-2xl font-bold text-routiq-prompt">12</div>
                <div className="text-sm text-routiq-blackberry/60">Opportunities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-lg border border-routiq-cloud/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-routiq-blackberry/50 h-4 w-4" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={tableSearchTerm}
              onChange={(e) => setTableSearchTerm(e.target.value)}
              className="pl-10 w-80 border-routiq-cloud/30 focus:border-routiq-core"
            />
          </div>
          
          <Button variant="outline" className="border-routiq-cloud/30 hover:bg-routiq-cloud/10">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-routiq-cloud/30 rounded px-3 py-2 text-sm"
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          
          <Button variant="outline" size="sm" className="border-routiq-cloud/30">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button className="bg-routiq-core hover:bg-routiq-core/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Patient Data Table */}
      <Card className="border-routiq-cloud/20">
        <CardHeader className="border-b border-routiq-cloud/20 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-routiq-core flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient Database
            </CardTitle>
            <div className="text-sm text-routiq-blackberry/60">
              Showing {mockPatients.length} of {mockPatients.length} patients
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-routiq-cloud/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    LTV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Avg. Spend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Last Appt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    No-shows
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-routiq-blackberry/70 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-routiq-cloud/20">
                {mockPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-routiq-cloud/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-routiq-core to-routiq-energy flex items-center justify-center text-white font-semibold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-routiq-core">
                            {patient.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-routiq-blackberry/80">
                          <Phone className="h-3 w-3 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-routiq-blackberry/60">
                          <Mail className="h-3 w-3 mr-1" />
                          {patient.email}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-routiq-core">
                        {formatCurrency(patient.ltv)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-routiq-blackberry/80">
                        {formatCurrency(patient.avgSpend)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-routiq-blackberry/80">
                        {patient.totalSessions}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-routiq-blackberry/80">
                        {formatDate(patient.lastAppointment)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-routiq-blackberry/80">
                        {formatDate(patient.lastContacted)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-routiq-blackberry/80">
                        {patient.noShows}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(patient.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50/50 px-6 py-3 border-t border-routiq-cloud/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-routiq-blackberry/60">
                Showing 1 to {mockPatients.length} of {mockPatients.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="border-routiq-cloud/30">
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled className="border-routiq-cloud/30">
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