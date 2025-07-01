'use client'

import React, { useState, useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Target,
  Activity,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Zap,
  Loader2,
  ChevronDown,
  PhoneCall,
  Send,
  CalendarPlus,
} from "lucide-react"
import { PatientRiskData } from '@/lib/routiq-api'
import { formatDistanceToNow } from 'date-fns'

interface PatientRiskTableProps {
  data: PatientRiskData[]
  onPatientClick?: (phone: string) => void
  organizationId?: string  // Optional: for webhook integration
}

export function PatientRiskTable({ data, onPatientClick, organizationId: propOrgId }: PatientRiskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'risk_score', desc: true } // Default sort by risk score descending
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set())

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'No phone'
    const cleaned = phone.replace(/\D/g, '')
    
    // Handle different international formats
    if (cleaned.length === 10) {
      // US/Canada format: (123) 456-7890
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // US/Canada with country code: +1 (123) 456-7890
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    } else if (cleaned.length === 11 && cleaned.startsWith('61')) {
      // Australia: +61 4XX XXX XXX
      return `+61 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
    } else if (cleaned.length === 12 && cleaned.startsWith('971')) {
      // UAE: +971 XX XXX XXXX
      return `+971 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
    } else if (cleaned.length === 13 && cleaned.startsWith('62')) {
      // Indonesia: +62 XXX XXXX XXXX
      return `+62 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`
    } else if (cleaned.length === 12 && cleaned.startsWith('44')) {
      // UK: +44 XXXX XXX XXX
      return `+44 ${cleaned.slice(2, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
    } else if (cleaned.length >= 11) {
      // Generic international format: +XXX XXX XXX XXXX
      const countryCode = cleaned.slice(0, cleaned.length - 10)
      const number = cleaned.slice(-10)
      return `+${countryCode} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
    }
    
    // Fallback: add + and space every 3-4 digits
    if (cleaned.length > 10) {
      return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`
    }
    
    return phone
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'No data'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handlePatientAction = async (patient: PatientRiskData, actionType: string) => {
    const patientId = patient.patient_id
    // Hardcoded for testing - will replace with org context later
    const organizationId = "org_2xwiHJY6BaRUIX1DanXG6ZX7"
    
    // Add to loading set
    setLoadingActions(prev => new Set(prev).add(patientId))
    
    try {
      const response = await fetch(
        `https://routiq-backend-prod.up.railway.app/api/v1/webhooks/${organizationId}/trigger`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhook_type: actionType,
            patient_id: patient.patient_id,
            trigger_data: {
              patient_name: patient.patient_name,
              patient_email: patient.email,
              patient_phone: patient.phone,
              risk_level: patient.risk_level,
              engagement_status: patient.engagement_status,
              recommended_action: patient.recommended_action,
              action_priority: patient.action_priority,
              lifetime_value_aud: patient.lifetime_value_aud,
              triggered_from: 'patient_dashboard',
              description: `${actionType} for ${patient.patient_name}`
            },
            user_id: 'dashboard_user', // TODO: Get from auth context
            trigger_source: 'dashboard'
          })
        }
      )

      const data = await response.json()

      if (data.success) {
        console.log(`✅ ${actionType} triggered successfully for ${patient.patient_name} (${data.execution_time_ms}ms)`)
        console.log(`📋 Webhook Log ID: ${data.log_id}`)
        // TODO: Add success toast notification
      } else {
        console.error(`❌ Failed to trigger ${actionType}:`, data.error || 'Unknown error')
        // TODO: Add error toast notification
      }
    } catch (error) {
      console.error('🚨 Network error triggering webhook:', error)
      // TODO: Add error toast notification
    } finally {
      // Remove from loading set
      setLoadingActions(prev => {
        const next = new Set(prev)
        next.delete(patientId)
        return next
      })
    }
  }

  const actionOptions = [
    {
      id: 'patient_followup',
      label: 'Send Follow-up Campaign',
      icon: Send,
      description: '📧 Automated patient follow-up workflow',
      color: 'text-blue-600',
      status: '✅ Active'
    },
    {
      id: 'reengagement_campaign',
      label: 'Reengagement Campaign',
      icon: Zap,
      description: '🎯 Dormant patient reactivation workflow',
      color: 'text-orange-600',
      status: '⚙️ Setup Required'
    },
    {
      id: 'appointment_reminder',
      label: 'Appointment Reminder',
      icon: CalendarPlus,
      description: '📅 Automated appointment reminders',
      color: 'text-green-600',
      status: '⚙️ Setup Required'
    }
  ]

  const getRiskBadge = (riskLevel: string, engagementStatus: string, riskScore: number) => {
    const riskColors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    
    const engagementColors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      dormant: 'bg-orange-100 text-orange-800 border-orange-200',
      stale: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge className={`${riskColors[riskLevel as keyof typeof riskColors] || riskColors.low} text-xs font-medium`}>
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
          </Badge>
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
            {riskScore}/100
          </span>
        </div>
        <Badge className={`${engagementColors[engagementStatus as keyof typeof engagementColors] || engagementColors.stale} text-xs font-medium`}>
          {engagementStatus.charAt(0).toUpperCase() + engagementStatus.slice(1)}
        </Badge>
      </div>
    )
  }

  const columns = useMemo<ColumnDef<PatientRiskData>[]>(() => [
    {
      accessorKey: 'patient_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Patient
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[180px]">
          <div className="font-medium text-gray-900">{row.original.patient_name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {row.original.activity_status}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'risk_score',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Risk Level
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
             cell: ({ row }) => getRiskBadge(row.original.risk_level, row.original.engagement_status, row.original.risk_score),
      sortingFn: (rowA, rowB) => rowA.original.risk_score - rowB.original.risk_score,
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[200px]">
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3 text-blue-500" />
            <button 
              onClick={() => onPatientClick?.(row.original.phone)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {formatPhoneNumber(row.original.phone)}
            </button>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="truncate">{row.original.email || 'No email'}</span>
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'appointments',
      header: 'Appointments',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[120px]">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-blue-500" />
            <span>{row.original.upcoming_appointment_count} upcoming</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-3 w-3 text-orange-500" />
            <span>{row.original.recent_appointment_count} recent</span>
          </div>
          <div className="text-xs text-gray-500">
            Total: {row.original.total_appointment_count}
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'engagement',
      header: 'Engagement',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="flex items-center gap-1 text-sm">
            <MessageSquare className="h-3 w-3 text-purple-500" />
            <span>{row.original.conversations_90d} conversations</span>
          </div>
          {row.original.attendance_rate_percent !== null && (
            <div className="flex items-center gap-1 text-sm">
              <Target className="h-3 w-3 text-green-500" />
              <span>{row.original.attendance_rate_percent}% attendance</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            {row.original.engagement_benchmark.replace('_', ' ')}
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'lifetime_value_aud',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Lifetime Value
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[120px]">
          <div className="flex items-center gap-1 text-sm font-medium">
            <DollarSign className="h-3 w-3 text-green-500" />
            <span className="text-green-700">
              {formatCurrency(row.original.lifetime_value_aud)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Total revenue
          </div>
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const aValue = rowA.original.lifetime_value_aud || 0
        const bValue = rowB.original.lifetime_value_aud || 0
        return aValue - bValue
      },
    },
    {
      accessorKey: 'days_since_last_contact',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Last Contact
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[100px]">
          <div className="text-sm font-medium">
            {row.original.days_since_last_contact !== null 
              ? `${Math.round(row.original.days_since_last_contact)} days ago`
              : 'Never'
            }
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(row.original.last_communication_date)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'next_appointment_time',
      header: 'Next Appointment',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 min-w-[120px]">
          {row.original.next_appointment_time ? (
            <>
              <div className="text-sm">
                {row.original.days_to_next_appointment !== null
                  ? `In ${Math.round(row.original.days_to_next_appointment)} days`
                  : 'Scheduled'
                }
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(row.original.next_appointment_time)}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">None scheduled</div>
          )}
        </div>
      ),
      enableSorting: false,
    },

    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const patient = row.original
        const isLoading = loadingActions.has(patient.patient_id)
        
        // Only show action dropdown for high priority patients
        const shouldShowAction = patient.action_priority <= 2 || patient.risk_level === 'high'
        
        if (!shouldShowAction) {
          return <div className="text-sm text-gray-400">No action needed</div>
        }

        return (
          <div className="min-w-[160px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      n8n workflows
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {actionOptions.map((action) => {
                  const IconComponent = action.icon
                  const isAvailable = action.status?.includes('✅')
                  return (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={() => handlePatientAction(patient, action.id)}
                      className={`cursor-pointer hover:bg-gray-50 ${!isAvailable ? 'opacity-60' : ''}`}
                      disabled={!isAvailable}
                    >
                      <IconComponent className={`h-4 w-4 mr-2 ${action.color}`} />
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{action.label}</span>
                          <span className="text-xs">{action.status}</span>
                        </div>
                        <span className="text-xs text-gray-500">{action.description}</span>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
                <div className="border-t mt-1 pt-1">
                  <div className="px-2 py-1 text-xs text-gray-500">
                    🚀 Connected to N8N Workflows
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Priority {patient.action_priority}
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
  ], [onPatientClick, loadingActions, handlePatientAction, actionOptions])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 1000, // Show all patients - set high enough to display everything
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search patients..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <div className="text-sm text-gray-500">
            {table.getFilteredRowModel().rows.length} patients
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left py-3 px-4 font-medium text-gray-900 border-r last:border-r-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td 
                        key={cell.id} 
                        className="py-3 px-4 border-r last:border-r-0 align-top"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  )
} 