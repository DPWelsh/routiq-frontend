'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Target,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Star,
  Zap
} from 'lucide-react'

interface AutomationState {
  currentSequence: string
  currentStage: string
  progress: number
  nextAction: string
  nextActionDate: string
  automationStatus: 'active' | 'paused' | 'priority' | 'completed'
}

interface PatientJourneyTrackerProps {
  patient: {
    id: string
    name: string
    automationState: AutomationState
    status: string
  }
  onActionTrigger?: (action: string) => void
}

// Define automation sequences and their stages
const automationSequences = {
  'Routine Care Maintenance': [
    { stage: 'Initial Assessment', icon: User, color: 'bg-blue-500' },
    { stage: 'Treatment Planning', icon: Target, color: 'bg-purple-500' },
    { stage: 'Active Treatment', icon: Zap, color: 'bg-green-500' },
    { stage: 'Follow-up Scheduled', icon: Calendar, color: 'bg-orange-500' },
    { stage: 'Maintenance Phase', icon: CheckCircle, color: 'bg-green-600' }
  ],
  'Reengagement Campaign': [
    { stage: 'Identify Dormant Patient', icon: AlertCircle, color: 'bg-yellow-500' },
    { stage: 'Email Sent - Awaiting Response', icon: Mail, color: 'bg-blue-500' },
    { stage: 'SMS Follow-up', icon: MessageSquare, color: 'bg-purple-500' },
    { stage: 'Phone Call Scheduled', icon: Phone, color: 'bg-orange-500' },
    { stage: 'Reengagement Successful', icon: CheckCircle, color: 'bg-green-500' }
  ],
  'High-Risk Intervention': [
    { stage: 'Risk Assessment', icon: AlertCircle, color: 'bg-red-500' },
    { stage: 'Priority Flagged', icon: Target, color: 'bg-orange-500' },
    { stage: 'Phone Call Scheduled', icon: Phone, color: 'bg-purple-500' },
    { stage: 'Personal Outreach', icon: User, color: 'bg-blue-500' },
    { stage: 'Intervention Complete', icon: CheckCircle, color: 'bg-green-500' }
  ],
  'VIP Care Journey': [
    { stage: 'VIP Identification', icon: Star, color: 'bg-yellow-500' },
    { stage: 'Personalized Treatment', icon: Target, color: 'bg-purple-500' },
    { stage: 'Premium Care Delivery', icon: Zap, color: 'bg-blue-500' },
    { stage: 'Satisfaction Survey Sent', icon: Mail, color: 'bg-green-500' },
    { stage: 'Loyalty Program Invite', icon: Star, color: 'bg-yellow-600' }
  ],
  'Win-Back Campaign': [
    { stage: 'Churned Patient Identified', icon: AlertCircle, color: 'bg-red-500' },
    { stage: 'Special Offer Sent', icon: Mail, color: 'bg-blue-500' },
    { stage: 'Paused - No Response', icon: Pause, color: 'bg-gray-500' },
    { stage: 'Review & Restart', icon: Target, color: 'bg-orange-500' },
    { stage: 'Win-Back Successful', icon: CheckCircle, color: 'bg-green-500' }
  ]
}

export function PatientJourneyTracker({ patient, onActionTrigger }: PatientJourneyTrackerProps) {
  const { automationState } = patient
  const sequenceStages = automationSequences[automationState.currentSequence as keyof typeof automationSequences] || []
  
  // Find current stage index
  const currentStageIndex = sequenceStages.findIndex(
    stage => stage.stage === automationState.currentStage
  )

  const getAutomationStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Play className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        )
      case 'priority':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Priority
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Unknown
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-routiq-core">
              {patient.name}&apos;s Automation Journey
            </CardTitle>
            <p className="text-sm text-routiq-blackberry/70 mt-1">
              {automationState.currentSequence}
            </p>
          </div>
          {getAutomationStatusDisplay(automationState.automationStatus)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-routiq-core">Overall Progress</span>
            <span className="text-sm text-routiq-blackberry/70">{automationState.progress}%</span>
          </div>
          <Progress value={automationState.progress} className="h-2" />
        </div>

        {/* Journey Stages */}
        <div className="space-y-4">
          <h4 className="font-medium text-routiq-core">Journey Stages</h4>
          <div className="space-y-3">
            {sequenceStages.map((stage, index) => {
              const isCompleted = index < currentStageIndex
              const isCurrent = index === currentStageIndex
              const isUpcoming = index > currentStageIndex
              
              const StageIcon = stage.icon
              
              return (
                <div
                  key={stage.stage}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    isCurrent 
                      ? 'border-routiq-core bg-routiq-core/5' 
                      : isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCurrent 
                      ? 'bg-routiq-core text-white' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StageIcon className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isCurrent 
                        ? 'text-routiq-core' 
                        : isCompleted 
                          ? 'text-green-700' 
                          : 'text-gray-600'
                    }`}>
                      {stage.stage}
                    </div>
                    {isCurrent && (
                      <div className="text-sm text-routiq-blackberry/70 mt-1">
                        Currently in progress
                      </div>
                    )}
                  </div>
                  
                  {isCurrent && (
                    <div className="flex items-center gap-1 text-sm text-routiq-core">
                      <div className="w-2 h-2 bg-routiq-core rounded-full animate-pulse"></div>
                      Current
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Next Action */}
        <div className="bg-routiq-cloud/10 rounded-lg p-4 border border-routiq-cloud/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-routiq-core" />
            <span className="font-medium text-routiq-core">Next Action</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-routiq-blackberry/80">
                {automationState.nextAction}
              </span>
              <ArrowRight className="w-4 h-4 text-routiq-blackberry/60" />
              <span className="text-sm font-medium text-routiq-core">
                {formatDate(automationState.nextActionDate)}
              </span>
            </div>
            {onActionTrigger && (
              <button
                onClick={() => onActionTrigger(automationState.nextAction)}
                className="mt-2 px-3 py-1 bg-routiq-core text-white text-sm rounded-lg hover:bg-routiq-core/90 transition-colors"
              >
                Trigger Now
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 