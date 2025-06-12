/**
 * Active Patients API Proxy - PRODUCTION READY
 * Proxies requests to the Routiq backend API
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = 'https://routiq-backend-prod.up.railway.app'
const ORGANIZATION_ID = 'org_2xwHiNrj68eaRUlX10anlXGvzX7'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    
    console.log('Fetching active patients from backend', {
      organizationId: ORGANIZATION_ID,
      filter
    })

    // Fetch active patients from the real backend API
    const response = await fetch(`${BACKEND_API_URL}/api/v1/cliniko/active-patients/${ORGANIZATION_ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('Backend response:', {
      totalCount: data.total_count,
      patientsCount: data.active_patients?.length || 0,
      organizationId: data.organization_id
    })
    
    // Transform the backend response to match the frontend expectations
    const transformedPatients = data.active_patients?.map((patient: any, index: number) => ({
      id: patient.id || patient.cliniko_id || index + 1,
      name: patient.contact_name || `Patient ${patient.id || index + 1}`,
      email: patient.contact_email || 'No email available',
      phone: patient.contact_phone || 'No phone available',
      last_appointment_date: patient.last_appointment_date,
      total_appointment_count: patient.total_appointment_count || 0,
      upcoming_appointment_count: patient.upcoming_appointment_count || 0,
      days_since_last_appointment: calculateDaysSince(patient.last_appointment_date),
      rebooking_priority: determinePriority(patient),
      churn_risk: determineChurnRisk(patient),
      patient_segment: determineSegment(patient)
    })) || []

    // Apply frontend filtering
    const filteredPatients = applyFilter(transformedPatients, filter)

    return NextResponse.json({
      success: true,
      data: filteredPatients,
      meta: {
        total_count: data.total_count || 0,
        organization_id: data.organization_id,
        timestamp: data.timestamp,
        filter_applied: filter,
        filtered_count: filteredPatients.length
      }
    })

  } catch (error) {
    console.error('Error fetching active patients:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch active patients',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'PATIENTS_FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

function calculateDaysSince(dateString: string | null): number {
  if (!dateString) return 999
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  } catch {
    return 999
  }
}

function determinePriority(patient: any): 'high' | 'medium' | 'low' {
  const daysSince = calculateDaysSince(patient.last_appointment_date)
  const totalAppointments = patient.total_appointment_count || 0
  
  if (daysSince > 45 && totalAppointments > 3) return 'high'
  if (daysSince > 30 || (totalAppointments > 5 && daysSince > 14)) return 'medium'
  return 'low'
}

function determineChurnRisk(patient: any): 'high' | 'medium' | 'low' {
  const daysSince = calculateDaysSince(patient.last_appointment_date)
  const upcomingAppointments = patient.upcoming_appointment_count || 0
  
  if (daysSince > 60 && upcomingAppointments === 0) return 'high'
  if (daysSince > 30 && upcomingAppointments === 0) return 'medium'
  return 'low'
}

function determineSegment(patient: any): 'vip' | 'regular' | 'new' | 'at_risk' {
  const totalAppointments = patient.total_appointment_count || 0
  const daysSince = calculateDaysSince(patient.last_appointment_date)
  
  if (daysSince > 45) return 'at_risk'
  if (totalAppointments >= 10) return 'vip'
  if (totalAppointments <= 2) return 'new'
  return 'regular'
}

function applyFilter(patients: any[], filter: string) {
  switch (filter) {
    case 'high':
      return patients.filter(p => p.rebooking_priority === 'high')
    case 'medium':
      return patients.filter(p => p.rebooking_priority === 'medium')
    case 'low':
      return patients.filter(p => p.rebooking_priority === 'low')
    case 'active':
      return patients.filter(p => p.days_since_last_appointment <= 30)
    case 'upcoming':
      return patients.filter(p => p.upcoming_appointment_count > 0)
    case 'at_risk':
      return patients.filter(p => p.churn_risk === 'high')
    default:
      return patients
  }
}

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic' 