/**
 * Active Patients Stats API - PRODUCTION READY
 * Fetches statistics from the Routiq backend API
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = 'https://routiq-backend-prod.up.railway.app'
const ORGANIZATION_ID = 'org_2xwHiNrj68eaRUlX10anlXGvzX7'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching active patients stats from backend', {
      organizationId: ORGANIZATION_ID
    })

    // Fetch stats from the real backend API
    const response = await fetch(`${BACKEND_API_URL}/api/v1/cliniko/active-patients/${ORGANIZATION_ID}/summary`, {
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
    
    console.log('Backend stats response:', {
      totalActivePatients: data.total_active_patients,
      patientsWithRecent: data.patients_with_recent_appointments,
      patientsWithUpcoming: data.patients_with_upcoming_appointments,
      organizationId: data.organization_id
    })
    
    // Transform the backend response to match the frontend expectations
    const transformedStats = {
      success: true,
      data: {
        overview: {
          totalPatients: data.total_active_patients || 0,
          activePatients: data.patients_with_recent_appointments || 0,
          inactivePatients: Math.max(0, (data.total_active_patients || 0) - (data.patients_with_recent_appointments || 0)),
          patientsWithRecentActivity: data.patients_with_recent_appointments || 0,
          activityRate: data.total_active_patients > 0 
            ? Math.round(((data.patients_with_recent_appointments || 0) / data.total_active_patients) * 100 * 10) / 10
            : 0
        },
        engagement: {
          totalConversations: 0, // Not available in current API
          averageConversationsPerPatient: 0, // Not available in current API
          patientsWithEscalations: 0, // Not available in current API
          escalationRate: 0 // Not available in current API
        },
        appointments: {
          averageRecentAppointments: data.avg_recent_appointments || 0,
          averageTotalAppointments: data.avg_total_appointments || 0,
          patientsWithUpcoming: data.patients_with_upcoming_appointments || 0,
          upcomingAppointmentRate: data.total_active_patients > 0 
            ? Math.round(((data.patients_with_upcoming_appointments || 0) / data.total_active_patients) * 100 * 10) / 10
            : 0
        },
        timeframe: {
          days: 45, // Standard timeframe for active patients
          includeInactive: false,
          lastSyncDate: data.last_sync_date,
          dataTimestamp: data.timestamp
        },
        meta: {
          organization_id: data.organization_id,
          timestamp: data.timestamp,
          source: 'cliniko_api'
        }
      }
    }

    return NextResponse.json(transformedStats)

  } catch (error) {
    console.error('Error fetching active patients stats:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch active patients statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'STATS_FETCH_ERROR'
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic' 