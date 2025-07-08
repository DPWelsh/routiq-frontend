import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// JSON data structure interfaces
interface TranscriptMessage {
  speaker: 'patient' | 'staff'
  timestamp: string
  text: string
}

interface ConversationData {
  id: string
  phone_number: string
  patient_name: string
  patient_id: string
  date: string
  conversation_type: string
  status: string
  sentiment: string
  priority: string
  transcript: TranscriptMessage[]
}

interface JsonConversationsData {
  conversations: ConversationData[]
}

// Helper function to determine conversation source based on phone format
const getConversationSource = (phoneNumber: string): string => {
  return phoneNumber.startsWith('@') ? 'instagram' : 'whatsapp'
}

// Message interface
interface PhoneMessage {
  id: number
  content: string
  sender_type: 'user' | 'agent' | 'system'
  timestamp: string
  metadata: Record<string, unknown> | null
  external_id: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    // Read the JSON file with actual conversation data
    const jsonFilePath = path.join(process.cwd(), 'live_conversation_data.json')
    
    if (!fs.existsSync(jsonFilePath)) {
      return NextResponse.json({
        success: false,
        error: 'Conversation data file not found'
      }, { status: 404 })
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
    
    // If phone parameter is provided, return individual conversation data
    if (phone) {
      const conversation = (jsonData as JsonConversationsData).conversations.find((conv: ConversationData) => 
        conv.phone_number === phone
      )
      
      if (!conversation) {
        return NextResponse.json({
          success: false,
          error: 'Conversation not found',
          debug: { requestedPhone: phone, availablePhones: jsonData.conversations.map((c: ConversationData) => c.phone_number) }
        }, { status: 404 })
      }
      
      // Convert the JSON format to the expected API format
      const conversationDetail = {
        phone: conversation.phone_number,
        patient_name: conversation.patient_name,
        email: `${conversation.patient_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        conversation_id: conversation.id,
        conversation_start: conversation.date,
        conversation_last_activity: conversation.date,
        total_messages: conversation.transcript?.length || 0,
        first_message_time: conversation.transcript?.[0]?.timestamp || conversation.date,
        last_message_time: conversation.transcript?.[conversation.transcript.length - 1]?.timestamp || conversation.date
      }
      
      // Convert transcript to messages format with proper timestamps
      const messages = conversation.transcript?.map((msg: TranscriptMessage, index: number) => {
        // Calculate proper timestamps based on conversation date and message order
        const baseDate = new Date(conversation.date)
        const messageDate = new Date(baseDate.getTime() + (index * 120000)) // 2 minutes apart
        
        return {
          id: index + 1,
          content: msg.text,
          sender_type: msg.speaker === 'patient' ? 'user' : 'agent',
          timestamp: messageDate.toISOString(),
          metadata: {
            original_timestamp: msg.timestamp,
            conversation_type: conversation.conversation_type,
            sentiment: conversation.sentiment,
            priority: conversation.priority
          },
          external_id: `${conversation.id}_msg_${index + 1}`
        }
      }) || []
      
      return NextResponse.json({
        success: true,
        data: {
          conversation: conversationDetail,
          messages: messages
        }
      })
    }
    
    // If no phone parameter, return the list of conversations from JSON file
    const conversations = (jsonData as JsonConversationsData).conversations.map(conv => ({
      phone: conv.phone_number,
      patient_name: conv.patient_name,
      email: `${conv.patient_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      patient_id: conv.patient_id,
      conversation_id: conv.id,
      conversation_source: getConversationSource(conv.phone_number),
      conversation_updated_at: conv.date,
      total_messages: conv.transcript?.length || 0,
      last_message_time: conv.date,
      last_message_content: conv.transcript?.[conv.transcript.length - 1]?.text || 'No messages',
      last_message_sender: conv.transcript?.[conv.transcript.length - 1]?.speaker === 'patient' ? 'user' : 'agent',
      latest_conversation_date: conv.date,
      unread_messages: Math.floor(Math.random() * 3), // Random for demo
      clinical_priority: (conv.transcript?.length || 0) > 10 ? 'high' : 'medium',
      last_activity: conv.date,
      patient_status: 'active',
      conversation_summary: (conv.transcript?.[conv.transcript.length - 1]?.text || 'No messages').substring(0, 100) + '...'
    }))

    return NextResponse.json({
      success: true,
      data: {
        conversations: conversations
      }
    })
  } catch (error) {
    console.error('Phone conversations API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch conversations',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 