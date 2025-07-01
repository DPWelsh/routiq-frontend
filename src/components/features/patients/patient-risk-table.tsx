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
} from "lucide-react"
import { PatientRiskData } from '@/lib/routiq-api'
import { formatDistanceToNow } from 'date-fns'

interface PatientRiskTableProps {
  data: PatientRiskData[]
  onPatientClick?: (phone: string) => void
}

export function PatientRiskTable({ data, onPatientClick }: PatientRiskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'risk_score', desc: true } // Default sort by risk score descending
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

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
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

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
      accessorKey: 'recommended_action',
      header: 'Recommended Action',
      cell: ({ row }) => (
        <div className="min-w-[280px] max-w-[320px]">
          <div className="text-sm font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
            {row.original.recommended_action}
          </div>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              Priority {row.original.action_priority}
            </Badge>
            {row.original.contact_success_prediction && (
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {row.original.contact_success_prediction.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
      ),
      enableSorting: false,
    },
  ], [onPatientClick])

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
        pageSize: 20,
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
        
        <div className="flex items-center space-x-2">
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

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} patients
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  )
} 