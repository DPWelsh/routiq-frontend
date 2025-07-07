'use client'

import React, { useState, useMemo, useCallback } from 'react'
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
  FileText,
  Eye,
  User,
  Stethoscope,
} from "lucide-react"
import { PatientRiskData } from '@/lib/routiq-api'
import { useLogOutreach } from '@/hooks/useReengagementData'
import { formatDistanceToNow } from 'date-fns'

// Move actionOptions outside component to prevent re-creation
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

interface PatientRiskTableProps {
  data: PatientRiskData[]
  onPatientClick?: (phone: string) => void
  organizationId?: string
}

export function PatientRiskTable({ data, onPatientClick, organizationId }: PatientRiskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set())
  const [selectedPatient, setSelectedPatient] = useState<PatientRiskData | null>(null)
  const [showNotes, setShowNotes] = useState<string | null>(null)

  // Outreach logging mutation
  const logOutreachMutation = useLogOutreach(organizationId || '')

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

  const handlePatientAction = useCallback(async (patient: PatientRiskData, actionType: string) => {
    const patientId = patient.id;
    
    try {
      setLoadingActions(prev => new Set(prev).add(patientId))
      
             // Determine the outreach method and log it
       let method: 'sms' | 'email' | 'phone' = 'phone'; // default
       const outcome: 'success' | 'no_response' | 'failed' = 'success'; // assume success for now
      
      switch (actionType) {
        case 'send_sms':
          method = 'sms';
          break;
        case 'send_email':
          method = 'email';
          break;
        case 'make_call':
          method = 'phone';
          break;
      }

      // Log the outreach attempt
      await logOutreachMutation.mutateAsync({
        patient_id: patientId,
        method,
        outcome,
        notes: `${actionType} initiated from dashboard`
      });

      console.log(`✅ ${actionType} action completed for patient ${patient.name} (${patientId})`);
      
    } catch (error) {
      console.error('🚨 Error triggering outreach:', error);
      // TODO: Add error toast notification
    } finally {
      setLoadingActions(prev => {
        const next = new Set(prev);
        next.delete(patientId);
        return next;
      });
    }
  }, [logOutreachMutation]);

  const getRiskBadge = (riskLevel: string, riskScore: number) => {
    const riskColors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      engaged: 'bg-green-100 text-green-800 border-green-200'
    }
    
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${riskColors[riskLevel as keyof typeof riskColors] || riskColors.low} text-xs font-medium`}>
          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
        </Badge>
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
          {riskScore}/100
        </span>
      </div>
    )
  }

  const columns: ColumnDef<PatientRiskData>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Patient
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">{patient.name}</div>
            <div className="text-sm text-gray-500">{patient.phone}</div>
            <div className="text-xs text-gray-400">{patient.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'risk_level',
      header: 'Risk Assessment',
      cell: ({ row }) => {
        const patient = row.original;
        return getRiskBadge(patient.risk_level, patient.risk_score);
      },
    },
    {
      accessorKey: 'days_since_last_contact',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Last Contact
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-3 w-3" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-3 w-3" />
          ) : (
            <ArrowUpDown className="ml-2 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const days = row.getValue('days_since_last_contact') as number;
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className={days > 30 ? 'text-red-600 font-medium' : days > 14 ? 'text-orange-600' : 'text-gray-600'}>
              {days} days ago
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'recommended_action',
      header: 'Recommended Action',
      cell: ({ row }) => {
        const action = row.getValue('recommended_action') as string;
        const priority = row.original.action_priority;
        
        const priorityColors = {
          1: 'text-red-600 bg-red-50',
          2: 'text-orange-600 bg-orange-50',
          3: 'text-yellow-600 bg-yellow-50',
          4: 'text-blue-600 bg-blue-50',
          5: 'text-green-600 bg-green-50'
        };
        
        return (
          <div className="space-y-1">
            <div className={`text-sm px-2 py-1 rounded ${priorityColors[priority as keyof typeof priorityColors] || priorityColors[3]}`}>
              {action}
            </div>
            <div className="text-xs text-gray-500">Priority: {priority}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'treatment_notes',
      header: 'Patient Notes',
      cell: ({ row }) => {
        const patient = row.original;
        const notesCount = patient.treatment_notes?.length || 0;
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(showNotes === patient.id ? null : patient.id)}
              className="h-8 px-2"
            >
              <FileText className="h-4 w-4" />
              <span className="ml-1">{notesCount} notes</span>
            </Button>
            {notesCount > 0 && (
              <Badge variant="outline" className="text-xs">
                Latest: {patient.treatment_notes?.[0]?.category || 'N/A'}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const patient = row.original;
        const isLoading = loadingActions.has(patient.id);
        
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePatientAction(patient, 'make_call')}
              disabled={isLoading}
              className="h-8 px-2"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <PhoneCall className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePatientAction(patient, 'send_sms')}
              disabled={isLoading}
              className="h-8 px-2"
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePatientAction(patient, 'send_email')}
              disabled={isLoading}
              className="h-8 px-2"
            >
              <Mail className="h-3 w-3" />
            </Button>

            {onPatientClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPatientClick(patient.phone)}
                className="h-8 px-2"
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

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
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize });
        setPageIndex(newPagination.pageIndex);
        setPageSize(newPagination.pageSize);
      }
    },
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search patients..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Total: {data.length} patients
          </Badge>
          <Badge variant="outline">
            Critical: {data.filter(p => p.risk_level === 'critical').length}
          </Badge>
          <Badge variant="outline">
            High Risk: {data.filter(p => p.risk_level === 'high').length}
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left p-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="border-b hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Expandable Notes Section */}
                  {showNotes === row.original.id && row.original.treatment_notes && (
                    <tr className="bg-blue-50 border-b">
                      <td colSpan={columns.length} className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-blue-900 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Treatment Notes for {row.original.name}
                          </h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {row.original.treatment_notes.map((note) => (
                              <div key={note.id} className="bg-white p-3 rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {note.category}
                                    </Badge>
                                    <span className="text-sm font-medium text-gray-700">
                                      {note.provider}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(note.date), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{note.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} 
          ({table.getFilteredRowModel().rows.length} total)
        </div>
      </div>
    </div>
  );
} 