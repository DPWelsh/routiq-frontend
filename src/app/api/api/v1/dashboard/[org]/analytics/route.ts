import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ org: string }> }) {
  try {
    // Check if user is authenticated
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { org } = await params
    const searchParams = request.nextUrl.searchParams
    const timeframe = searchParams.get('timeframe') || '30d'

    // Dummy analytics data for frontend development
    const analyticsData = {
      booking_metrics: {
        total_appointments: 127,
        confirmed_appointments: 98,
        cancelled_appointments: 15,
        no_show_appointments: 14,
        booking_rate: 77.2,
        cancellation_rate: 11.8,
        no_show_rate: 11.0
      },
      patient_metrics: {
        total_patients: 234,
        active_patients: 189,
        new_patients: 23,
        returning_patients: 166,
        patient_satisfaction: 4.6,
        retention_rate: 78.5
      },
      financial_metrics: {
        total_revenue: 24750.00,
        average_appointment_value: 195.67,
        revenue_per_patient: 130.85,
        outstanding_payments: 3420.00,
        payment_collection_rate: 94.2
      },
      automation_metrics: {
        automated_messages_sent: 456,
        response_rate: 68.4,
        automation_success_rate: 92.1,
        time_saved_hours: 18.5,
        cost_savings: 1250.00
      },
      organization_id: org,
      timeframe: timeframe,
      last_updated: new Date().toISOString()
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Dashboard analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
} 