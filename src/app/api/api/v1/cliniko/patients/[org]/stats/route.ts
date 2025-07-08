import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest, { params }: { params: { org: string } }) {
  try {
    // Check if user is authenticated
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { org } = params
    const searchParams = request.nextUrl.searchParams
    const includeDetails = searchParams.get('include_details') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Generate dummy patient data
    const generatePatients = (count: number) => {
      const patients = []
      const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jessica', 'William', 'Ashley']
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
      
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        
        patients.push({
          id: `patient_${i + 1}`,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          date_of_birth: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          status: Math.random() > 0.2 ? 'active' : 'inactive',
          last_appointment: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          next_appointment: Math.random() > 0.4 ? new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString() : null,
          total_appointments: Math.floor(Math.random() * 20) + 1,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      return patients
    }

    const patients = generatePatients(Math.min(limit, 50))
    
    const patientsData = {
      patients: includeDetails ? patients : patients.map(p => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        status: p.status,
        next_appointment: p.next_appointment
      })),
      total_count: 189,
      active_count: 156,
      inactive_count: 33,
      stats: {
        total_patients: 189,
        active_patients: 156,
        new_this_month: 23,
        with_upcoming_appointments: 78,
        overdue_appointments: 12,
        average_age: 45.2,
        retention_rate: 78.5
      },
      demographics: {
        age_groups: {
          '18-30': 34,
          '31-45': 67,
          '46-60': 58,
          '61+': 30
        },
        gender: {
          'male': 89,
          'female': 95,
          'other': 5
        }
      },
      organization_id: org,
      limit: limit,
      include_details: includeDetails,
      last_updated: new Date().toISOString()
    }

    return NextResponse.json(patientsData)
  } catch (error) {
    console.error('Cliniko patients stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients data' },
      { status: 500 }
    )
  }
} 