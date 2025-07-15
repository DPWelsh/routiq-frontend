'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Users, Clock, Mail, MessageSquare, Phone } from 'lucide-react'
import { AutomationSequenceCard } from '@/components/dashboard/automation-sequence/automation-sequence-card'

export default function AutomationSequencePage() {
  const [selectedSequence, setSelectedSequence] = useState<string | null>('active-routine-care')

  const automationSequences = [
    {
      id: 'active-routine-care',
      title: 'Active – Routine Care',
      definition: 'Has an upcoming appointment',
      goal: 'Ensure smooth appointment experience + continued care',
      status: 'active',
      patientCount: 12,
      color: 'bg-green-500',
      steps: [
        {
          id: 'pre-session-reminder',
          title: 'Pre-Session Reminder',
          timing: '1–2 days before',
          message: 'Reminder: You\'re booked in for [date/time], please confirm your session',
          type: 'email',
          patientCount: 8
        },
        {
          id: 'post-session-checkin',
          title: 'Post-Session Check-In',
          timing: '2–3 days after session',
          message: 'How did your session go? + link to feedback/NPS',
          type: 'email',
          patientCount: 5
        },
        {
          id: 'next-booking-prompt',
          title: 'Prompt for Next Booking',
          timing: '7–10 days after (if no rebook)',
          message: 'Want to lock in your next session?',
          type: 'sms',
          patientCount: 3
        }
      ]
    },
    {
      id: 'dormant-reengagement',
      title: 'Dormant – Re-engagement Campaign',
      definition: 'No appointment in the last 1 month',
      goal: 'Win back casual patients who have drifted',
      status: 'planned',
      patientCount: 0,
      color: 'bg-orange-500',
      steps: [
        {
          id: 'miss-you-email',
          title: '"We Miss You" Email',
          timing: 'Immediate',
          message: 'Noticed it\'s been a while – how\'s everything going?',
          type: 'email',
          patientCount: 0
        },
        {
          id: 'sms-followup',
          title: 'SMS Follow-Up',
          timing: '3 days later',
          message: 'Need help getting back on track? Let us know.',
          type: 'sms',
          patientCount: 0
        },
        {
          id: 'booking-offer',
          title: 'Booking CTA + Offer',
          timing: '1 week later',
          message: 'Discount or incentive to nudge rebooking',
          type: 'email',
          patientCount: 0
        }
      ]
    },
    {
      id: 'at-risk-intervention',
      title: 'At-Risk - High-Risk Intervention',
      definition: 'No appointment scheduled for over 1 month',
      goal: 'Intervene early before full drop-off',
      status: 'planned',
      patientCount: 0,
      color: 'bg-red-500',
      steps: [
        {
          id: 'personalized-checkin',
          title: 'Personalised Check-In Email',
          timing: 'Immediate',
          message: 'Just noticed you don\'t have a session booked – everything okay?',
          type: 'email',
          patientCount: 0
        },
        {
          id: 'phone-call-task',
          title: 'Task Creation: Phone Call Prompt',
          timing: 'Same day',
          message: 'Reach out to [Patient Name] – no booking in 30+ days.',
          type: 'task',
          patientCount: 0
        },
        {
          id: 'sms-followup-atrisk',
          title: 'SMS Follow-Up',
          timing: '3–5 days after',
          message: 'Let us know if you need help finding a time that works.',
          type: 'sms',
          patientCount: 0
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'planned': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'task': return <Phone className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 automation-sequence-page">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-routiq-core">Automation Sequences</h1>
              <p className="text-routiq-blackberry/70 text-base md:text-lg">Manage patient communication workflows and automation sequences</p>
            </div>
            <Button className="hidden md:flex bg-routiq-core hover:bg-routiq-core/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Sequence
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sequence List */}
          <div className="lg:col-span-1 space-y-4">
            {automationSequences.map((sequence, index) => (
              <div key={sequence.id}>
                <Card 
                  className={`cursor-pointer transition-all bg-white border-gray-200 ${
                    selectedSequence === sequence.id 
                      ? 'ring-2 ring-routiq-cloud shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedSequence(sequence.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${sequence.color}`} />
                        <div>
                          <CardTitle className="text-sm font-medium">{sequence.title}</CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(sequence.status)}`}
                        >
                          {sequence.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-routiq-core/60">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{sequence.patientCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-routiq-core/60">{sequence.definition}</p>
                    <p className="text-xs text-routiq-core/80 mt-1 font-medium">
                      Goal: {sequence.goal}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Add Sequence Button - Mobile Only (after At-Risk sequence) */}
                {sequence.id === 'at-risk-intervention' && (
                  <div className="md:hidden mt-4">
                    <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sequence
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sequence Details */}
          <div className="lg:col-span-2">
            {selectedSequence && (
              <AutomationSequenceCard 
                sequence={automationSequences.find(s => s.id === selectedSequence)!}
                getTypeIcon={getTypeIcon}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}