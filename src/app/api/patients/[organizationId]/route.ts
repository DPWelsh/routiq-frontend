import { NextRequest, NextResponse } from 'next/server'
import { RoutiqAPI } from '@/lib/routiq-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { organizationId } = params
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    const api = new RoutiqAPI(organizationId)
    const patientsData = await api.getPatients(organizationId)
    
    return NextResponse.json(patientsData)
  } catch (error) {
    console.error('Patients API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch patients data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 