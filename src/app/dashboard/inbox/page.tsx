"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePatientProfileByPhone } from '@/hooks/usePatientProfileByPhone'
import { 
  MessageCircle, 
  Search, 
  Send, 
  Phone, 
  Mail, 
  MoreVertical, 
  Bot, 
  User, 
  Clock, 
  FileText,
  Filter,
  Zap,
  TrendingUp,
  AlertTriangle,
  ChevronDown
} from 'lucide-react'
import { LoadingSpinner } from "@/components/magicui"

interface PhoneConversation {
  phone: string
  patient_name: string
  email: string
  conversation_id?: string
  conversation_source?: string
  conversation_start?: string
  conversation_last_activity?: string
  latest_conversation_date?: string
  last_message_time?: string
  last_message_content?: string
  last_message_sender?: string
  total_messages?: number
  bot_messages?: number
  user_messages?: number
  patient_status?: string
  conversation_updated_at?: string
}

interface PhoneMessage {
  id?: string
  content: string
  timestamp: string
  sender_type: 'user' | 'agent' | 'system'
  conversation_id?: string
  phone?: string
}

interface ChatData {
  conversation: PhoneConversation
  messages: PhoneMessage[]
}

/**
 * Advanced Patient Profile type with expanded clinical data
 */
interface AdvancedPatientProfile {
  patient_id: string
  patient_name: string
  phone: string
  email?: string
  
  // Clinical Information
  last_treatment_note?: string
  treatment_summary?: string
  next_appointment?: string
  last_appointment?: string
  
  // Engagement Metrics
  total_conversations: number
  last_contact_date: string
  response_rate: number
  
  // Risk Assessment
  risk_score: number
  risk_factors: string[]
  
  // Patient Journey
  patient_stage: 'new' | 'active' | 'returning' | 'at-risk' | 'lost'
  journey_milestones: string[]
}

/**
 * 🎯 CRITICAL: Patient Profile Display Panel
 * 
 * Shows comprehensive patient information including:
 * - Basic demographics (name, phone, email)
 * - Clinical notes and treatment summary  
 * - Engagement metrics and response patterns
 * - Risk assessment and patient journey stage
 * - Smart conversation insights
 * 
 * This replaces the basic conversation performance panel with rich patient context.
 * Used in the conversation detail view to provide clinical context for staff.
 */
function ConversationPerformancePanel({ 
  conversation, 
  messages 
}: { 
  conversation: PhoneConversation | undefined
  messages: PhoneMessage[] 
}) {
  
  // 🔍 Fetch expanded patient profile using phone number
  const { 
    data: patientProfile, 
    isLoading: profileLoading, 
    error: profileError 
  } = usePatientProfileByPhone(conversation?.phone || '')

  if (!conversation) {
    return (
      <div className="p-6 text-center text-routiq-blackberry/60">
        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-routiq-blackberry/40" />
        <p className="text-sm">Select a conversation to view details</p>
      </div>
    )
  }

  // Calculate conversation sentiment based on message content
  const getConversationSentiment = () => {
    if (messages.length === 0) return { sentiment: 'Unknown', color: 'text-gray-500' }
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['thank', 'great', 'good', 'excellent', 'better', 'improved', 'happy']
    const negativeWords = ['pain', 'hurt', 'bad', 'worse', 'terrible', 'cancel', 'disappointed', 'frustrated']
    
    let positiveCount = 0
    let negativeCount = 0
    
    messages.forEach(message => {
      const content = message.content?.toLowerCase() || ''
      positiveWords.forEach(word => {
        if (content.includes(word)) positiveCount++
      })
      negativeWords.forEach(word => {
        if (content.includes(word)) negativeCount++
      })
    })
    
    if (positiveCount > negativeCount) {
      return { sentiment: 'Positive', color: 'text-green-600' }
    } else if (negativeCount > positiveCount) {
      return { sentiment: 'Negative', color: 'text-red-600' }
    } else {
      return { sentiment: 'Neutral', color: 'text-gray-600' }
    }
  }

  const sentimentInfo = getConversationSentiment()

  // Get patient-specific data based on conversation
  const getPatientData = () => {
    if (!conversation) {
      return {
        lifetime_value: '$0',
        session_count: 0,
        risk_level: 'Unknown',
        risk_color: 'gray',
        next_appointment: 'TBD',
        channel: 'Unknown',
        last_contact: 'Unknown',
        suggested_action: 'Review',
        clinical_note: 'No information available',
        treatment_plan: 'To be determined',
        ai_insight: 'Please select a conversation to view insights.'
      }
    }
    
    // Get patient-specific metrics based on conversation content
    const getLifetimeValue = () => {
      const values: { [key: string]: number } = {
        'sarah mitchell': 850,
        'michael chen': 680,
        'emma rodriguez': 1250,
        'david thompson': 450,
        'jessica park': 2100,
        'robert wilson': 320,
        'lisa anderson': 780,
        'kevin o\'brien': 1650,
        'michelle lee': 920,
        'tom sullivan': 2200,
        'james watson': 1100,
        'corporate health services': 4500,
        'sydney runner': 650
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return values[name] || 1200
    }

    const getSessionCount = () => {
      const sessions: { [key: string]: number } = {
        'sarah mitchell': 1,
        'michael chen': 0,
        'emma rodriguez': 4,
        'david thompson': 0,
        'jessica park': 12,
        'robert wilson': 2,
        'lisa anderson': 3,
        'kevin o\'brien': 8,
        'michelle lee': 2,
        'tom sullivan': 6,
        'james watson': 0,
        'corporate health services': 15,
        'sydney runner': 1
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return sessions[name] || 3
    }

    const getNextAppointment = () => {
      const appointments: { [key: string]: string } = {
        'sarah mitchell': 'Jul 22',  // Recent inquiry (Jul 15) - booked for this week
        'michael chen': 'TBD',       // Pricing inquiry (Jul 12) - still deciding
        'emma rodriguez': 'Jul 25',  // Follow-up (Jul 8) - scheduled for this week  
        'david thompson': 'Jul 19',  // Urgent care (Jul 5) - booked soon after
        'jessica park': 'Aug 2',     // ACL rehab (Jun 28) - regular sessions
        'robert wilson': 'Aug 5',    // Pilates inquiry (Jun 25) - group class start
        'lisa anderson': 'Jul 28',   // Running injury (Jun 22) - follow-up session
        'kevin o\'brien': 'Jul 30',  // Chronic pain (Jun 18) - ongoing management
        'michelle lee': 'Aug 8',     // Netball injury (Jun 12) - return to sport check
        'tom sullivan': 'Complete',  // Hip replacement (Jun 5) - rehab finished
        'james watson': 'TBD',       // Email inquiry (Jun 15) - assessment pending
        'corporate health services': 'Ongoing', // Corporate program (Jun 8) - monthly reviews
        'sydney runner': 'Jul 26'    // Instagram inquiry (Jun 2) - marathon prep session
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return appointments[name] || 'TBD'
    }

    const getRiskLevel = () => {
      const risks: { [key: string]: { level: string; color: string } } = {
        'sarah mitchell': { level: 'Low', color: 'green' },
        'michael chen': { level: 'Low', color: 'green' },
        'emma rodriguez': { level: 'Low', color: 'green' },
        'david thompson': { level: 'Medium', color: 'orange' },
        'jessica park': { level: 'Low', color: 'green' },
        'robert wilson': { level: 'Low', color: 'green' },
        'lisa anderson': { level: 'Medium', color: 'orange' },
        'kevin o\'brien': { level: 'High', color: 'red' },
        'michelle lee': { level: 'Medium', color: 'orange' },
        'tom sullivan': { level: 'Low', color: 'green' },
        'james watson': { level: 'Low', color: 'green' },
        'corporate health services': { level: 'Low', color: 'green' },
        'sydney runner': { level: 'Medium', color: 'orange' }
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return risks[name] || { level: 'Low', color: 'green' }
    }

    const getClinicalNote = () => {
      const notes: { [key: string]: string } = {
        'sarah mitchell': 'Lower back strain from gym exercise',
        'michael chen': 'Tennis elbow assessment pending',
        'emma rodriguez': 'Shoulder rehab showing excellent progress',
        'david thompson': 'Computer-related neck strain, urgent care',
        'jessica park': 'ACL reconstruction rehab on track',
        'robert wilson': 'Interested in group pilates classes',
        'lisa anderson': 'Shin splints from running training',
        'kevin o\'brien': 'Chronic lower back pain management',
        'michelle lee': 'Netball ankle injury follow-up',
        'tom sullivan': 'Hip replacement rehab completed',
        'james watson': 'Corporate ergonomic assessment request',
        'corporate health services': 'Workplace injury prevention program',
        'sydney runner': 'Marathon training injury prevention'
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return notes[name] || 'General physiotherapy consultation'
    }

    const getTreatmentPlan = () => {
      const plans: { [key: string]: string } = {
        'sarah mitchell': 'Lower Back Strengthening Protocol',
        'michael chen': 'Tennis Elbow Treatment Plan',
        'emma rodriguez': 'Progressive Shoulder Rehabilitation',
        'david thompson': 'Workplace Ergonomics & Neck Care',
        'jessica park': 'Post-ACL Surgery Recovery',
        'robert wilson': 'Group Exercise Integration',
        'lisa anderson': 'Running Biomechanics Program',
        'kevin o\'brien': 'Chronic Pain Management Plan',
        'michelle lee': 'Sports Injury Recovery',
        'tom sullivan': 'Completed Rehab Program',
        'james watson': 'Corporate Wellness Assessment',
        'corporate health services': 'Workplace Health Program',
        'sydney runner': 'Marathon Training Support'
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return plans[name] || 'Standard Treatment Protocol'
    }

    const getAIInsight = () => {
      const insights: { [key: string]: string } = {
        'sarah mitchell': 'Patient shows good understanding of exercise form - recommend home program.',
        'michael chen': 'Cost-conscious patient - emphasize insurance benefits and value.',
        'emma rodriguez': 'Highly compliant patient - excellent candidate for advanced exercises.',
        'david thompson': 'Work-stress related injury - ergonomic assessment critical.',
        'jessica park': 'Post-surgical patient progressing well - continue current plan.',
        'robert wilson': 'Social fitness preference - group classes ideal motivation.',
        'lisa anderson': 'Dedicated runner - focus on injury prevention strategies.',
        'kevin o\'brien': 'Chronic pain frustration evident - requires empathetic approach.',
        'michelle lee': 'Young athlete - emphasize return to sport timeline.',
        'tom sullivan': 'Grateful patient - good candidate for testimonial/referrals.',
        'james watson': 'Professional inquiry - opportunity for corporate contracts.',
        'corporate health services': 'Large scale opportunity - prioritize relationship building.',
        'sydney runner': 'Prevention focused - ideal for wellness programs.'
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return insights[name] || 'Monitor patient response and adjust treatment accordingly.'
    }

    const getChannel = () => {
      const source = conversation.conversation_source || 'whatsapp'
      const channelMap: { [key: string]: string } = {
        'whatsapp': 'WhatsApp',
        'sms': 'SMS',
        'email': 'Email',
        'instagram': 'Instagram'
      }
      return channelMap[source] || 'WhatsApp'
    }

    const getLastContact = () => {
      // For demo purposes, using static values that align with July 2025 timeline
      const lastContacts: { [key: string]: string } = {
        'sarah mitchell': 'Today',         // Jul 15 conversation - most recent
        'michael chen': 'Today',           // Jul 12 conversation - recent 
        'emma rodriguez': 'Today',         // Jul 8 conversation - recent
        'david thompson': '12 days ago',   // Jul 5 conversation
        'jessica park': '19 days ago',     // Jun 28 conversation
        'robert wilson': '22 days ago',    // Jun 25 conversation
        'lisa anderson': '25 days ago',    // Jun 22 conversation
        'kevin o\'brien': '29 days ago',   // Jun 18 conversation
        'michelle lee': '35 days ago',     // Jun 12 conversation
        'tom sullivan': '42 days ago',     // Jun 5 conversation
        'james watson': '32 days ago',     // Jun 15 conversation
        'corporate health services': '39 days ago', // Jun 8 conversation
        'sydney runner': '45 days ago'     // Jun 2 conversation
      }
      const name = conversation.patient_name?.toLowerCase() || ''
      return lastContacts[name] || 'Recently'
    }

    const getSuggestedAction = () => {
      const nextAppt = getNextAppointment()
      if (nextAppt === 'TBD') return 'Book appointment'
      if (nextAppt === 'Complete') return 'Follow-up care'
      if (nextAppt === 'Ongoing') return 'Program review'
      return 'Confirm appointment'
    }

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-AU', { 
        style: 'currency', 
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }

    const riskData = getRiskLevel()
    
    return {
      lifetime_value: formatCurrency(getLifetimeValue()),
      session_count: getSessionCount(),
      risk_level: riskData.level,
      risk_color: riskData.color,
      next_appointment: getNextAppointment(),
      channel: getChannel(),
      last_contact: getLastContact(),
      suggested_action: getSuggestedAction(),
      clinical_note: getClinicalNote(),
      treatment_plan: getTreatmentPlan(),
      ai_insight: getAIInsight()
    }
  }

  const patientData = getPatientData()

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* 1. Patient Health Snapshot */}
      <Card className="border-routiq-cloud/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-routiq-core flex items-center gap-2">
            <User className="h-4 w-4" />
            Patient Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Patient Name & Status */}
          <div className="p-2.5 rounded-lg border border-routiq-cloud/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-routiq-blackberry">{conversation?.patient_name || 'Unknown Patient'}</h3>
                <p className="text-sm text-routiq-blackberry/60">{conversation?.phone}</p>
              </div>
              <Badge className="text-green-600 border-green-300 bg-green-50" variant="outline">
                Active
              </Badge>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg border border-routiq-cloud/30 text-center">
              <div className="text-lg font-bold text-green-600">{patientData.lifetime_value}</div>
              <div className="text-xs text-routiq-blackberry/60">LTV</div>
            </div>
            <div className="p-2.5 rounded-lg border border-routiq-cloud/30 text-center">
              <div className="text-lg font-bold text-routiq-core">{patientData.session_count}</div>
              <div className="text-xs text-routiq-blackberry/60">Sessions</div>
            </div>
            <div className="p-2.5 rounded-lg border border-routiq-cloud/30 text-center">
              <div className="text-sm font-bold text-green-600">
                {patientData.next_appointment}
              </div>
              <div className="text-xs text-routiq-blackberry/60">Upcoming</div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="p-2.5 rounded-lg border border-routiq-cloud/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-routiq-blackberry/70">Risk Level</span>
              <Badge 
                className={`${
                  patientData.risk_color === 'green' ? 'text-green-600 border-green-300 bg-green-50' :
                  patientData.risk_color === 'orange' ? 'text-orange-600 border-orange-300 bg-orange-50' :
                  patientData.risk_color === 'red' ? 'text-red-600 border-red-300 bg-red-50' :
                  'text-gray-600 border-gray-300 bg-gray-50'
                }`} 
                variant="outline"
              >
                {patientData.risk_level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Engagement & Communication */}
      <Card className="border-routiq-cloud/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-routiq-core flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Engagement & Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-routiq-blackberry/70">Channel Used Most</span>
            <span className="text-sm font-medium text-routiq-core">{patientData.channel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-routiq-blackberry/70">Last Contact</span>
            <span className="text-sm font-medium text-routiq-blackberry">{patientData.last_contact}</span>
          </div>
          <div className="pt-2 border-t border-routiq-cloud/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-routiq-blackberry/70">Next Suggested Action</span>
              <Badge className="text-blue-600 border-blue-300 bg-blue-50" variant="outline">
                {patientData.suggested_action}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Clinical Summary */}
      <Card className="border-routiq-energy/30 bg-routiq-energy/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-routiq-core flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Clinical Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-sm font-medium text-blue-800">Latest Note</span>
            <p className="text-sm text-routiq-blackberry mt-1">{patientData.clinical_note}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">
            <span className="text-sm font-medium text-green-800">Treatment Plan</span>
            <p className="text-sm text-blue-600 underline cursor-pointer mt-1">
              {patientData.treatment_plan}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-routiq-energy rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="text-sm font-medium text-purple-800">AI Insight</span>
                <p className="text-sm text-routiq-blackberry mt-1">
                  {patientData.ai_insight}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InboxPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPhone = searchParams.get('phone')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState<PhoneConversation[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatLoading, setChatLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'whatsapp' | 'sms' | 'email' | 'instagram'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs-followup' | 'unread'>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedPhone && conversations.length > 0) {
      const conversation = conversations.find(c => c.phone === selectedPhone)
      if (conversation) {
        fetchChatMessages(selectedPhone)
      }
    }
  }, [selectedPhone, conversations])

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  /**
   * ⚠️  CRITICAL: Fetches conversation list from phone-centric API
   * 
   * MUST USE encodeURIComponent for phone parameters - contains special characters.
   * Response structure varies by service layer evolution:
   * - New service structure: data.data.conversations (array)
   * - Legacy structure: data.conversations (array)
   * - Direct array format: data (array)
   */
  const fetchConversations = async () => {
    try {
      setLoading(true)
      console.log('🔄 Frontend: Starting fetchConversations...')
      
      // TODO: Replace with RoutiqAPI call when phone conversation endpoints are available
      const response = await fetch('/api/placeholder/conversations/phone', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('📡 Frontend: API Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      console.log('📋 Frontend: Full API response data:', data)
      console.log('📋 Frontend: data.success:', data.success)
      console.log('📋 Frontend: data.data:', data.data)
      console.log('📋 Frontend: data.data.conversations:', data.data?.conversations)
      console.log('📋 Frontend: data.data.conversations length:', data.data?.conversations?.length)
      console.log('📋 Frontend: data.data.conversations type:', typeof data.data?.conversations)
      console.log('📋 Frontend: data.data.conversations array check:', Array.isArray(data.data?.conversations))

      // ⚠️  CRITICAL: Handle different possible response structures
      // DO NOT simplify this - it handles API evolution and prevents breakage
      let conversationsArray = []
      
      if (data.data?.conversations && Array.isArray(data.data.conversations)) {
        // New service-based API structure: data.data.conversations
        conversationsArray = data.data.conversations
        console.log('✅ Frontend: Using data.data.conversations structure')
      } else if (data.conversations && Array.isArray(data.conversations)) {
        // Legacy structure: data.conversations
        conversationsArray = data.conversations
        console.log('✅ Frontend: Using data.conversations structure')
      } else if (Array.isArray(data)) {
        // Direct array response
        conversationsArray = data
        console.log('✅ Frontend: Using direct array structure')
      } else {
        console.log('❌ Frontend: No valid conversations array found in response')
        console.log('📋 Frontend: Available keys in data:', Object.keys(data))
        conversationsArray = []
      }

      console.log('✅ Frontend: Setting conversations array:', conversationsArray)
      console.log('✅ Frontend: Array length:', conversationsArray.length)
      
      setConversations(conversationsArray)
    } catch (error) {
      console.error('❌ Frontend: Error fetching conversations:', error)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * ⚠️  CRITICAL: Fetches messages for a specific phone conversation
   * 
   * MUST USE encodeURIComponent for phone parameters - contains special characters like +.
   * Response structure expected: { success: boolean, data: { conversation, messages } }
   */
  const fetchChatMessages = async (phone: string) => {
    if (!phone) return
    
    try {
      setChatLoading(true)
      console.log('🔄 Frontend: Fetching messages for phone:', phone)
      
      // TODO: Replace with RoutiqAPI call when phone conversation endpoints are available
      const response = await fetch(`/api/placeholder/conversations/phone?phone=${encodeURIComponent(phone)}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages')
      }

      const data = await response.json()
      console.log('📋 Frontend: Chat messages response:', data)
      
      if (data.success && data.data) {
        setSelectedChat(data.data)
      } else {
        console.error('❌ Frontend: Invalid chat messages response structure')
        setSelectedChat(null)
      }
    } catch (error) {
      console.error('❌ Frontend: Error fetching chat messages:', error)
      setSelectedChat(null)
    } finally {
      setChatLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleConversationSelect = (phone: string) => {
    router.push(`/dashboard/inbox?phone=${encodeURIComponent(phone)}`)
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (timestamp: string) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
  }

  // Helper function to determine conversation status
  const getConversationStatus = (conversation: PhoneConversation): string[] => {
    const statuses: string[] = []
    
    // Mock logic for demonstration - in real implementation, this would be based on actual data
    const lastMessageTime = new Date(conversation.last_message_time || conversation.latest_conversation_date || '')
    const hoursSinceLastMessage = (Date.now() - lastMessageTime.getTime()) / (1000 * 60 * 60)
    
    // Needs follow-up: last message was from patient more than 4 hours ago
    if (conversation.last_message_sender === 'user' && hoursSinceLastMessage > 4) {
      statuses.push('needs-followup')
    }
    
    // Unread: patient sent a message and we haven't responded (mock logic)
    if (conversation.last_message_sender === 'user' && hoursSinceLastMessage < 1) {
      statuses.push('unread')
    }
    
    return statuses
  }

  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      (conv.patient_name || '').toLowerCase().includes(searchLower) ||
      (conv.phone || '').toLowerCase().includes(searchLower) ||
      (conv.email || '').toLowerCase().includes(searchLower)
    )
    
    const matchesSource = sourceFilter === 'all' || conv.conversation_source === sourceFilter
    
    // Status filter logic
    const conversationStatuses = getConversationStatus(conv)
    const matchesStatus = statusFilter === 'all' || conversationStatuses.includes(statusFilter)
    
    return matchesSearch && matchesSource && matchesStatus
  })

  // Only log when conversations change, not on every render
  useEffect(() => {
    if (conversations.length > 0) {
      console.log('🔍 Frontend: Conversations loaded:', conversations.length)
      console.log('🔍 Frontend: Sample conversation:', conversations[0])
      console.log('🔍 Frontend: Date fields check:', {
        latest_conversation_date: conversations[0].latest_conversation_date,
        last_message_time: conversations[0].last_message_time,
        conversation_updated_at: conversations[0].conversation_updated_at
      })
    }
  }, [conversations.length])
  
  const getSenderBubbleStyle = (senderType: string) => {
    switch (senderType) {
      case 'user':
        // Patient messages - on the left with grey background like Facebook
        return 'bg-gray-200/80 text-gray-800 mr-auto max-w-[70%] rounded-r-2xl rounded-tl-2xl rounded-bl-md'
      case 'agent':
        // Bot/Our messages - on the right with brand blue at 50%
        return 'bg-routiq-cloud/50 text-routiq-core ml-auto max-w-[70%] rounded-l-2xl rounded-tr-2xl rounded-br-md'
      case 'system':
        return 'bg-gray-100/80 text-gray-600 mx-auto max-w-[80%] rounded-xl text-center text-sm'
      default:
        return 'bg-gray-200/80 text-gray-800 mr-auto max-w-[70%] rounded-r-2xl rounded-tl-2xl rounded-bl-md'
    }
  }

  // Test patient integration
  const testPatientIntegration = async () => {
    const testPhone = '+6287862502798'
    console.log('🧪 Testing patient integration for phone:', testPhone)
    
    try {
      const response = await fetch(`/api/api/v1/reengagement/org_2xwHiNrj68eaRUlX10anlXGvzX7/patient-profiles?limit=10&search=${encodeURIComponent(testPhone)}`)
      const data = await response.json()
      console.log('🧪 Patient integration test result:', data)
    } catch (error) {
      console.error('🧪 Patient integration test error:', error)
    }
  }

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 60px)' }}>
        <LoadingSpinner text="Loading conversations..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-routiq-blackberry/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-routiq-core mb-2">Unable to load conversations</h2>
          <p className="text-routiq-blackberry/70 mb-4">{error}</p>
          <Button onClick={fetchConversations} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Sidebar - Conversation List */}
      <div className="w-[500px] bg-white border-r border-routiq-cloud/30 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-routiq-cloud/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-routiq-core">Inbox</h1>
          </div>
          
          {/* Platform Filter Buttons */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-3 w-3 text-routiq-blackberry/50" />
              <span className="text-xs text-routiq-blackberry/60 font-medium">Platform</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={sourceFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSourceFilter('all')}
                className={`text-xs h-7 ${
                  sourceFilter === 'all' 
                    ? '' 
                    : 'hover:text-routiq-core'
                }`}
              >
                All ({conversations.length})
              </Button>
              <Button
                variant={sourceFilter === 'whatsapp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSourceFilter('whatsapp')}
                className={`text-xs h-7 ${
                  sourceFilter === 'whatsapp' 
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white' 
                    : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-600'
                }`}
              >
                WhatsApp ({conversations.filter(c => c.conversation_source === 'whatsapp').length})
              </Button>
              <Button
                variant={sourceFilter === 'sms' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSourceFilter('sms')}
                className={`text-xs h-7 ${
                  sourceFilter === 'sms' 
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:text-white' 
                    : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                SMS ({conversations.filter(c => c.conversation_source === 'sms').length})
              </Button>
              <Button
                variant={sourceFilter === 'email' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSourceFilter('email')}
                className={`text-xs h-7 ${
                  sourceFilter === 'email' 
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:text-white' 
                    : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:text-orange-600'
                }`}
              >
                Email ({conversations.filter(c => c.conversation_source === 'email').length})
              </Button>
              <Button
                variant={sourceFilter === 'instagram' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSourceFilter('instagram')}
                className={`text-xs h-7 ${
                  sourceFilter === 'instagram' 
                    ? 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600 hover:text-white' 
                    : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-600'
                }`}
              >
                Instagram ({conversations.filter(c => c.conversation_source === 'instagram').length})
              </Button>
            </div>
          </div>

          {/* Status Filter Dropdown */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3 w-3 text-routiq-blackberry/50" />
              <span className="text-xs text-routiq-blackberry/60 font-medium">Urgency</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1 justify-between min-w-[120px] hover:text-routiq-core"
                >
                  <div className="flex items-center gap-1">
                    {statusFilter === 'all' && (
                      <>
                        <Filter className="h-3 w-3" />
                        All
                      </>
                    )}
                    {statusFilter === 'needs-followup' && (
                      <>
                        <Clock className="h-3 w-3" />
                        Follow-up ({conversations.filter(c => getConversationStatus(c).includes('needs-followup')).length})
                      </>
                    )}
                    {statusFilter === 'unread' && (
                      <>
                        <Mail className="h-3 w-3" />
                        Unread ({conversations.filter(c => getConversationStatus(c).includes('unread')).length})
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('all')}
                  className="gap-2"
                >
                  <Filter className="h-3 w-3" />
                  All
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('needs-followup')}
                  className="gap-2"
                >
                  <Clock className="h-3 w-3" />
                  Follow-up ({conversations.filter(c => getConversationStatus(c).includes('needs-followup')).length})
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('unread')}
                  className="gap-2"
                >
                  <Mail className="h-3 w-3" />
                  Unread ({conversations.filter(c => getConversationStatus(c).includes('unread')).length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-routiq-blackberry/50 h-4 w-4" />
            <Input
              placeholder="Search inbox..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-200 rounded-full"
            />
          </div>
        </div>

        {/* Conversation List - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.phone}
              onClick={() => handleConversationSelect(conversation.phone)}
              className={`p-3 border-b border-routiq-cloud/20 cursor-pointer hover:bg-routiq-cloud/20 transition-colors ${
                selectedPhone === conversation.phone ? 'bg-routiq-prompt/10 border-r-2 border-r-routiq-prompt' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-routiq-cloud/20 text-routiq-cloud font-semibold text-sm">
                      {getInitials(conversation.patient_name)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.patient_status === 'active' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-routiq-core truncate text-sm">
                      {conversation.patient_name || 'Unknown'}
                    </h3>
                    <span className="text-xs text-routiq-blackberry/60">
                      {formatTime(conversation.last_message_time || conversation.latest_conversation_date || '')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      {conversation.last_message_sender === 'user' && (
                        <User className="h-3 w-3 text-routiq-blackberry/50 flex-shrink-0" />
                      )}
                      {conversation.last_message_sender === 'agent' && (
                        <Bot className="h-3 w-3 text-routiq-cloud flex-shrink-0" />
                      )}
                      <p className="text-xs text-routiq-blackberry/70 truncate">
                        {conversation.last_message_content || conversation.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {/* Status Indicators */}
                      {getConversationStatus(conversation).includes('needs-followup') && (
                        <Badge 
                          variant="outline" 
                          className="text-xs h-4 px-1 bg-yellow-50 text-yellow-700 border-yellow-200"
                          title="Needs follow-up"
                        >
                          ⚠️
                        </Badge>
                      )}
                      {getConversationStatus(conversation).includes('unread') && (
                        <Badge 
                          variant="outline" 
                          className="text-xs h-4 px-1 bg-red-50 text-red-700 border-red-200"
                          title="Unread"
                        >
                          🔴
                        </Badge>
                      )}
                      
                      {/* Platform Badge */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs h-4 px-1 ${
                          conversation.conversation_source === 'whatsapp' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : conversation.conversation_source === 'sms'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : conversation.conversation_source === 'email'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : conversation.conversation_source === 'instagram'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {conversation.conversation_source === 'whatsapp' ? 'WA' : 
                         conversation.conversation_source === 'sms' ? 'SMS' :
                         conversation.conversation_source === 'email' ? 'EMAIL' :
                         conversation.conversation_source === 'instagram' ? 'IG' : 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-routiq-blackberry/40 mx-auto mb-2" />
                <p className="text-sm text-routiq-blackberry/60">No conversations found</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-routiq-cloud/30 bg-white flex-shrink-0">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-routiq-cloud/20 text-routiq-cloud font-semibold text-sm">
                      {getInitials(selectedChat.conversation?.patient_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-routiq-core">
                      {selectedChat.conversation?.patient_name || 'Unknown Patient'}
                    </h2>
                    <p className="text-xs text-routiq-blackberry/60">
                      {selectedChat.conversation?.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right text-xs text-routiq-blackberry/70">
                    <div>{selectedChat?.conversation?.total_messages || 0} messages</div>
                    <div className="text-xs">
                      {selectedChat?.conversation?.bot_messages || 0} bot • {selectedChat?.conversation?.user_messages || 0} user
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 bg-routiq-cloud/5 min-h-0">
              {chatLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner text="Loading messages..." />
                </div>
              ) : (
                <div className="space-y-3 max-w-4xl mx-auto">
                  {selectedChat.messages
                    .filter(message => message.sender_type !== 'system')
                    .map((message, index) => (
                    <div key={message.id || index} className="flex flex-col">
                      <div className={`p-2 ${getSenderBubbleStyle(message.sender_type)}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content || 'No content'}
                        </p>
                      </div>
                      <div className={`text-xs text-routiq-blackberry/50 mt-1 ${
                        message.sender_type === 'agent' ? 'text-right ml-auto' : 'text-left mr-auto'
                      }`}>
                        <div className="flex items-center gap-1">
                          {message.sender_type === 'agent' && <Bot className="h-3 w-3" />}
                          {message.sender_type === 'user' && <User className="h-3 w-3" />}
                          <span>
                            {message.sender_type === 'agent' ? 'Bot' : 'Patient'} • 
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input (Disabled - Read Only) */}
            <div className="p-3 border-t border-routiq-cloud/30 bg-white flex-shrink-0">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    placeholder="This is a read-only conversation view..."
                    disabled
                    className="pr-12 bg-routiq-cloud/20 border-routiq-cloud/30"
                  />
                  <Button 
                    size="sm" 
                    disabled
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-routiq-cloud/5">
            <div className="text-center space-y-4">
              <MessageCircle className="h-16 w-16 text-routiq-blackberry/40 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-routiq-core mb-2">
                  Select a conversation
                </h3>
                <p className="text-routiq-blackberry/70">
                  Choose a phone conversation from the list to view the chat history
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Patient Info */}
      {selectedChat && selectedChat.conversation && (
        <div className="w-96 bg-white border-l border-routiq-cloud/30 flex flex-col h-full">
          <ConversationPerformancePanel 
            conversation={selectedChat.conversation}
            messages={selectedChat.messages}
          />
        </div>
      )}
    </div>
  )
} 