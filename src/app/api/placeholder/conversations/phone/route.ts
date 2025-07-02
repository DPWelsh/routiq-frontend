import { NextRequest, NextResponse } from 'next/server'

// Live conversation data from n8n
const LIVE_CONVERSATIONS = [
  {
    phone: "+6287862502798",
    patient_name: "Griffin (via Uncle)",
    email: "griffin@example.com",
    patient_id: "pat_001", 
    conversation_id: "conv_001",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-07-01T04:04:45Z",
    total_messages: 3,
    last_message_time: "2025-07-01T04:04:45Z",
    last_message_content: "If Griffin wants to book in for an assessment while he's in Ulus, just let me know and I can check our availability for him!",
    last_message_sender: "agent",
    latest_conversation_date: "2025-07-01T04:04:45Z"
  },
  {
    phone: "+447817478312",
    patient_name: "Immy",
    email: "immy@example.com",
    patient_id: "pat_002",
    conversation_id: "conv_002", 
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T19:56:38Z",
    total_messages: 8,
    last_message_time: "2025-06-30T19:56:38Z",
    last_message_content: "So yes, it is worth booking an appointment, it isn't too early to learn how to treat and minimize it",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T19:56:38Z"
  },
  {
    phone: "+13109245014",
    patient_name: "Amanda Strum",
    email: "amanda.strum@example.com",
    patient_id: "pat_003",
    conversation_id: "conv_003",
    conversation_source: "whatsapp", 
    conversation_updated_at: "2025-06-30T16:59:14Z",
    total_messages: 15,
    last_message_time: "2025-06-30T16:59:14Z",
    last_message_content: "Perfect! Your appointment is confirmed 🙌 Today (Tuesday, July 1st) at 4:30pm with Alister at SurfRehab, 360 Move, Uluwatu. Given your worsening wrist/finger pain, this will give Alister a chance to reassess and adjust your treatment plan accordingly.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T16:59:14Z"
  },
  {
    phone: "+380987737958",
    patient_name: "Artem Melnychuk",
    email: "artem441@yahoo.com",
    patient_id: "pat_004",
    conversation_id: "conv_004",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-29T23:38:36Z", 
    total_messages: 15,
    last_message_time: "2025-06-29T23:38:36Z",
    last_message_content: "Perfect! Your appointment is confirmed: Tuesday, July 1st at 6:00pm with Alister at SurfRehab at 360 Move, Uluwatu. We're all set for your knee rehabilitation consultation tomorrow evening.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T23:38:36Z"
  },
  {
    phone: "+6281935454615",
    patient_name: "Teresa", 
    email: "teresa@example.com",
    patient_id: "pat_005",
    conversation_id: "conv_005",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T18:15:33Z",
    total_messages: 15,
    last_message_time: "2025-06-30T18:15:33Z", 
    last_message_content: "Actually nomsorry you are still on a package so it is covered in our package",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T18:15:33Z"
  },
  {
    phone: "+628113882556",
    patient_name: "Edd Wright",
    email: "edd.wright@example.com", 
    patient_id: "pat_006",
    conversation_id: "conv_006",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T16:58:57Z",
    total_messages: 13,
    last_message_time: "2025-06-30T16:58:57Z",
    last_message_content: "No worries at all, Edd! Your Thursday 8:30am appointment has been cancelled and Alister has been notified. Just reach out whenever you're ready to reschedule - we'll be here to help! 🙂",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T16:58:57Z"
  },
  {
    phone: "+6281529509431",
    patient_name: "Unknown Indonesian Speaker",
    email: "unknown@example.com",
    patient_id: "pat_007", 
    conversation_id: "conv_007",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T03:10:58Z",
    total_messages: 3,
    last_message_time: "2025-06-30T03:10:58Z",
    last_message_content: "No worries at all! This is SurfRehab physiotherapy reception at 360 Move, Uluwatu. If you ever need physiotherapy services, feel free to reach out 🙂",
    last_message_sender: "agent", 
    latest_conversation_date: "2025-06-30T03:10:58Z"
  }
]

// Message interface
interface PhoneMessage {
  id: number
  content: string
  sender_type: 'user' | 'agent' | 'system'
  timestamp: string
  metadata: Record<string, unknown> | null
  external_id: string
}

// Sample messages for each conversation
const CONVERSATION_MESSAGES: Record<string, PhoneMessage[]> = {
  "+6287862502798": [
    {
      id: 1,
      content: "ey brew, got my nephew in town and his shoulder is buggin him. Goina have Griffin hit you up while hes here in ulus",
      sender_type: "user",
      timestamp: "2025-07-01T04:04:42Z",
      metadata: null,
      external_id: "msg_001_1"
    },
    {
      id: 2, 
      content: "G'day! Thanks for reaching out about your nephew's shoulder. I've forwarded your message to our physiotherapist who'll be able to give Griffin proper guidance on his shoulder issue. They'll get back to you soon (we're on Bali time - GMT+8).",
      sender_type: "agent",
      timestamp: "2025-07-01T04:04:43Z",
      metadata: null,
      external_id: "msg_001_2"
    },
    {
      id: 3,
      content: "If Griffin wants to book in for an assessment while he's in Ulus, just let me know and I can check our availability for him!",
      sender_type: "agent", 
      timestamp: "2025-07-01T04:04:45Z",
      metadata: null,
      external_id: "msg_001_3"
    }
  ],
  "+447817478312": [
    {
      id: 1,
      content: "Hey I think I have costochrondritis it came on this morning. Is it worth coming to see you or is it too soon? I had it before didn't rest properly an took me a month to recover 🙈 Currently just resting, ice and ibuprofen. Let me know if I should book an appointment or wait a few days. Thank you 🫶",
      sender_type: "user",
      timestamp: "2025-06-30T19:23:58Z",
      metadata: null,
      external_id: "msg_002_1"
    },
    {
      id: 2,
      content: "Hi there! Thanks for reaching out about your costochondritis concerns. I've forwarded your message straight to our physiotherapist who will be able to give you proper guidance on whether it's best to come in now or wait a few days, especially given your previous experience with it.",
      sender_type: "agent",
      timestamp: "2025-06-30T19:24:02Z", 
      metadata: null,
      external_id: "msg_002_2"
    },
    {
      id: 3,
      content: "When I say came on this morning I mean during a surf session",
      sender_type: "user",
      timestamp: "2025-06-30T19:50:38Z",
      metadata: null,
      external_id: "msg_002_3"
    },
    {
      id: 4,
      content: "Thanks for clarifying that it happened during your surf session this morning! I've made sure to include that important detail when forwarding your message to our physiotherapist. They'll get back to you with expert guidance! 🏄‍♂️",
      sender_type: "agent",
      timestamp: "2025-06-30T19:50:41Z",
      metadata: null,
      external_id: "msg_002_4"
    },
    {
      id: 5,
      content: "Hi immy yes it happens quite often in surfers as you can imagine. Especially on the bottom of the ribs where it contacts the board. But there are some good things you can do and learn to relieve them and we can go through those management strategies so you can keep surfing with irritating it too much",  
      sender_type: "agent",
      timestamp: "2025-06-30T19:56:10Z",
      metadata: null,
      external_id: "msg_002_5"
    },
    {
      id: 6,
      content: "So yes, it is worth booking an appointment, it isn't too early to learn how to treat and minimize it",
      sender_type: "agent",
      timestamp: "2025-06-30T19:56:38Z",
      metadata: null,
      external_id: "msg_002_6"
    }
  ],
  "+13109245014": [
    {
      id: 1,
      content: "Hi, I'm dealing with worsening ulnar wrist/finger pain after a treatment I had yesterday. Can I please get back on the schedule for a gentle evaluation? 🙏🏽",
      sender_type: "user", 
      timestamp: "2025-06-30T15:55:04Z",
      metadata: null,
      external_id: "msg_003_1"
    },
    {
      id: 2,
      content: "Hi Amanda! I'm so sorry to hear your wrist/finger pain has worsened after yesterday's treatment. Let's definitely get you back in for a gentle evaluation with Alister.",
      sender_type: "agent",
      timestamp: "2025-06-30T15:55:08Z",
      metadata: null,
      external_id: "msg_003_2"
    },
    {
      id: 3,
      content: "Thank you! Is there anything tomorrow available?",
      sender_type: "user",
      timestamp: "2025-06-30T16:03:10Z", 
      metadata: null,
      external_id: "msg_003_3"
    },
    {
      id: 4,
      content: "Unfortunately tomorrow (Wednesday, July 2nd) is fully booked! Since your pain has worsened, the earliest we can get you in would be: Today (Tuesday, July 1st): 4:30pm, 6:45pm",
      sender_type: "agent",
      timestamp: "2025-06-30T16:03:15Z",
      metadata: null,
      external_id: "msg_003_4"
    },
    {
      id: 5,
      content: "Can I come at 4:30?",
      sender_type: "user",
      timestamp: "2025-06-30T16:59:10Z",
      metadata: null,
      external_id: "msg_003_5"
    },
    {
      id: 6,
      content: "Perfect! Your appointment is confirmed 🙌 Today (Tuesday, July 1st) at 4:30pm with Alister at SurfRehab, 360 Move, Uluwatu. Given your worsening wrist/finger pain, this will give Alister a chance to reassess and adjust your treatment plan accordingly.",
      sender_type: "agent",
      timestamp: "2025-06-30T16:59:14Z",
      metadata: null,
      external_id: "msg_003_6"
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    console.log('📡 API: Received request for phone:', phone)
    
    // If phone parameter is provided, return specific conversation
    if (phone) {
      const decodedPhone = decodeURIComponent(phone)
      console.log('📡 API: Decoded phone:', decodedPhone)
      
      const conversation = LIVE_CONVERSATIONS.find(conv => conv.phone === decodedPhone)
      const messages = CONVERSATION_MESSAGES[decodedPhone] || []
      
      console.log('📡 API: Found conversation:', !!conversation)
      console.log('📡 API: Found messages:', messages.length)
      
      if (!conversation) {
        return NextResponse.json({
          success: false,
          error: 'Conversation not found'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        conversation,
        messages
      })
    }
    
    // Return all conversations
    console.log('📡 API: Returning all conversations:', LIVE_CONVERSATIONS.length)
    return NextResponse.json({
      success: true,
      data: {
        conversations: LIVE_CONVERSATIONS
      }
    })
    
  } catch (error) {
    console.error('❌ API: Error in phone conversations endpoint:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 