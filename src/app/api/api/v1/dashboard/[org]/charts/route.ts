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

    // Generate chart data based on timeframe
    const generateTimeframeData = (timeframe: string) => {
      const now = new Date()
      const data = []
      
      switch (timeframe) {
        case '7d':
          // Generate 7 days of data
          for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            data.push({
              date: date.toISOString().split('T')[0],
              appointments: Math.floor(Math.random() * 15) + 5,
              patients: Math.floor(Math.random() * 12) + 3,
              revenue: Math.floor(Math.random() * 3000) + 500,
              messages: Math.floor(Math.random() * 25) + 10,
              satisfaction: Math.random() * 2 + 3
            })
          }
          break
        
        case '30d':
          // Generate 30 days of data
          for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            data.push({
              date: date.toISOString().split('T')[0],
              appointments: Math.floor(Math.random() * 15) + 5,
              patients: Math.floor(Math.random() * 12) + 3,
              revenue: Math.floor(Math.random() * 3000) + 500,
              messages: Math.floor(Math.random() * 25) + 10,
              satisfaction: Math.random() * 2 + 3
            })
          }
          break
        
        case '90d':
          // Generate 13 weeks of data (weekly aggregation)
          for (let i = 12; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
            data.push({
              date: date.toISOString().split('T')[0],
              appointments: Math.floor(Math.random() * 80) + 40, // Weekly totals
              patients: Math.floor(Math.random() * 60) + 20,
              revenue: Math.floor(Math.random() * 15000) + 5000,
              messages: Math.floor(Math.random() * 150) + 50,
              satisfaction: Math.random() * 2 + 3
            })
          }
          break
        
        case '1y':
          // Generate 12 months of data
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            data.push({
              date: date.toISOString().split('T')[0],
              appointments: Math.floor(Math.random() * 300) + 150, // Monthly totals
              patients: Math.floor(Math.random() * 200) + 100,
              revenue: Math.floor(Math.random() * 50000) + 20000,
              messages: Math.floor(Math.random() * 600) + 200,
              satisfaction: Math.random() * 2 + 3
            })
          }
          break
        
        default:
          // Default to 30 days
          for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            data.push({
              date: date.toISOString().split('T')[0],
              appointments: Math.floor(Math.random() * 15) + 5,
              patients: Math.floor(Math.random() * 12) + 3,
              revenue: Math.floor(Math.random() * 3000) + 500,
              messages: Math.floor(Math.random() * 25) + 10,
              satisfaction: Math.random() * 2 + 3
            })
          }
      }
      
      return data
    }

    const timeframeData = generateTimeframeData(timeframe)
    
    const chartData = {
      appointment_trends: {
        daily_data: timeframeData,
        total_appointments: 347,
        average_per_day: 11.6,
        trend_percentage: 12.3,
        trend_direction: 'up'
      },
      patient_flow: {
        daily_data: timeframeData,
        total_patients: 189,
        new_patients: 23,
        returning_patients: 166,
        patient_retention: 78.5
      },
      revenue_trends: {
        daily_data: timeframeData,
        total_revenue: 67340.00,
        average_per_day: 2244.67,
        trend_percentage: 8.7,
        trend_direction: 'up'
      },
      satisfaction_scores: {
        daily_data: timeframeData,
        average_score: 4.6,
        total_responses: 156,
        distribution: {
          '5': 89,
          '4': 43,
          '3': 18,
          '2': 4,
          '1': 2
        }
      },
      appointment_types: [
        { name: 'Consultation', value: 45, color: '#3B82F6' },
        { name: 'Follow-up', value: 32, color: '#10B981' },
        { name: 'Treatment', value: 18, color: '#F59E0B' },
        { name: 'Emergency', value: 5, color: '#EF4444' }
      ],
      peak_hours: [
        { hour: 8, appointments: 12 },
        { hour: 9, appointments: 18 },
        { hour: 10, appointments: 22 },
        { hour: 11, appointments: 25 },
        { hour: 12, appointments: 15 },
        { hour: 13, appointments: 8 },
        { hour: 14, appointments: 20 },
        { hour: 15, appointments: 23 },
        { hour: 16, appointments: 19 },
        { hour: 17, appointments: 14 }
      ],
      organization_id: org,
      timeframe: timeframe,
      last_updated: new Date().toISOString()
    }

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Dashboard charts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch charts data' },
      { status: 500 }
    )
  }
} 