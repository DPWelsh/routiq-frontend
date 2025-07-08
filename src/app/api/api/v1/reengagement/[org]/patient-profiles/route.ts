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
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // Generate dummy patient profiles for reengagement
    const generatePatientProfiles = (count: number) => {
      const profiles = []
      const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Emily', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']
      const lastNames = ['Anderson', 'Baker', 'Clark', 'Davis', 'Evans', 'Fisher', 'Green', 'Hall', 'Ivy', 'Jackson']
      const conditions = ['Back Pain', 'Knee Injury', 'Shoulder Issues', 'Neck Pain', 'Hip Problems', 'Ankle Sprain']
      const riskLevels = ['low', 'medium', 'high']
      
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
        
        // If there's a search term, make some profiles match it
        const matchesSearch = search === '' || 
                             phone.includes(search) ||
                             firstName.toLowerCase().includes(search.toLowerCase()) ||
                             lastName.toLowerCase().includes(search.toLowerCase())
        
        if (search !== '' && !matchesSearch && Math.random() > 0.3) {
          continue // Skip this profile if it doesn't match search (with some randomness)
        }
        
        profiles.push({
          patient_id: `patient_${i + 1}`,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          last_appointment: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
          days_since_last_visit: Math.floor(Math.random() * 90) + 30,
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
          engagement_score: Math.floor(Math.random() * 100),
          communication_preferences: {
            email: Math.random() > 0.5,
            sms: Math.random() > 0.3,
            phone: Math.random() > 0.7
          },
          reengagement_attempts: Math.floor(Math.random() * 5),
          last_contact: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString() : null,
          response_rate: Math.floor(Math.random() * 100),
          preferred_contact_time: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)],
          notes: `Patient with ${conditions[Math.floor(Math.random() * conditions.length)]}. Last seen ${Math.floor(Math.random() * 90) + 30} days ago.`,
          tags: ['needs_follow_up', 'high_priority', 'returning_patient'].filter(() => Math.random() > 0.6),
          created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      return profiles
    }

    const patientProfiles = generatePatientProfiles(limit)
    
    const reengagementData = {
      patient_profiles: patientProfiles,
      total_count: search ? patientProfiles.length : 156,
      filtered_count: patientProfiles.length,
      search_query: search,
      summary: {
        high_risk_patients: patientProfiles.filter(p => p.risk_level === 'high').length,
        medium_risk_patients: patientProfiles.filter(p => p.risk_level === 'medium').length,
        low_risk_patients: patientProfiles.filter(p => p.risk_level === 'low').length,
        avg_days_since_visit: Math.round(patientProfiles.reduce((sum, p) => sum + p.days_since_last_visit, 0) / patientProfiles.length),
        avg_engagement_score: Math.round(patientProfiles.reduce((sum, p) => sum + p.engagement_score, 0) / patientProfiles.length),
        total_reengagement_attempts: patientProfiles.reduce((sum, p) => sum + p.reengagement_attempts, 0)
      },
      filters: {
        risk_levels: ['low', 'medium', 'high'],
        conditions: ['Back Pain', 'Knee Injury', 'Shoulder Issues', 'Neck Pain', 'Hip Problems', 'Ankle Sprain'],
        contact_preferences: ['email', 'sms', 'phone'],
        time_ranges: ['last_30_days', 'last_60_days', 'last_90_days', 'over_90_days']
      },
      organization_id: org,
      limit: limit,
      last_updated: new Date().toISOString()
    }

    return NextResponse.json(reengagementData)
  } catch (error) {
    console.error('Reengagement patient profiles error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient profiles' },
      { status: 500 }
    )
  }
} 