import { NextRequest, NextResponse } from 'next/server'
import { RoutiqAPI } from '@/lib/routiq-api'

export async function POST(
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
    const syncData = await api.triggerSync(organizationId)
    
    return NextResponse.json(syncData)
  } catch (error) {
    console.error('Sync API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to trigger sync',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 