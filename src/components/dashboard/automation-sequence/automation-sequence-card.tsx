'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Clock, Plus, X, Eye, Edit } from 'lucide-react'
import { PatientListModal } from './patient-list-modal'

interface AutomationStep {
  id: string
  title: string
  timing: string
  message: string
  type: string
  patientCount: number
}

interface AutomationSequence {
  id: string
  title: string
  definition: string
  goal: string
  status: string
  patientCount: number
  color: string
  steps: AutomationStep[]
}

interface AutomationSequenceCardProps {
  sequence: AutomationSequence
  getTypeIcon: (type: string) => JSX.Element
}

export function AutomationSequenceCard({ sequence, getTypeIcon }: AutomationSequenceCardProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)

  const mockPatients = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 (555) 123-4567', lastAppointment: '2024-01-15' },
    { id: '2', name: 'Michael Chen', email: 'm.chen@email.com', phone: '+1 (555) 234-5678', lastAppointment: '2024-01-10' },
    { id: '3', name: 'Emma Williams', email: 'emma.w@email.com', phone: '+1 (555) 345-6789', lastAppointment: '2024-01-08' },
    { id: '4', name: 'David Brown', email: 'd.brown@email.com', phone: '+1 (555) 456-7890', lastAppointment: '2024-01-05' },
    { id: '5', name: 'Lisa Davis', email: 'lisa.d@email.com', phone: '+1 (555) 567-8901', lastAppointment: '2024-01-03' }
  ]

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${sequence.color}`} />
              <div>
                <CardTitle className="text-lg">{sequence.title}</CardTitle>
                <CardDescription className="mt-1">{sequence.definition}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPatientModal(true)}
                className="hover:!bg-[#7BA2E0]/80 hover:!text-white hover:!border-[#7BA2E0]/80 transition-all duration-150 ease-out [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
              >
                <Users className="h-4 w-4 mr-2" />
                {sequence.patientCount} Patients
              </Button>
              <Button variant="outline" size="sm" className="hover:!bg-[#7BA2E0]/80 hover:!text-white hover:!border-[#7BA2E0]/80 transition-all duration-150 ease-out [backface-visibility:hidden] [transform:translate3d(0,0,0)]">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-routiq-core/80">
              <span className="font-medium">Goal:</span> {sequence.goal}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium text-routiq-core">Automation Workflow</h3>
            
            <div className="space-y-3">
              {sequence.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedStep === step.id 
                      ? 'border-routiq-cloud bg-blue-50' 
                      : 'border-routiq-prompt/20 hover:border-routiq-cloud/50'
                  }`}
                  onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                >
                  {/* Step connector line */}
                  {index < sequence.steps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-routiq-prompt/20" />
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {getTypeIcon(step.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-routiq-core">{step.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.timing}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {step.patientCount} patients
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-routiq-core/70 mb-3">
                        "{step.message}"
                      </p>
                      
                      {selectedStep === step.id && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-routiq-prompt/20">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-sm">Patients in this step</h5>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Patient
                            </Button>
                          </div>
                          
                          {step.patientCount > 0 ? (
                            <div className="space-y-2">
                              {mockPatients.slice(0, step.patientCount).map((patient) => (
                                <div 
                                  key={patient.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {patient.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{patient.name}</p>
                                      <p className="text-xs text-routiq-core/60">{patient.email}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              
                              {step.patientCount > 3 && (
                                <Button variant="ghost" size="sm" className="w-full hover:bg-[#7BA2E0]/80 hover:text-white transition-all duration-200">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View all {step.patientCount} patients
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-routiq-core/60">
                              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No patients in this step yet</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List Modal */}
      <PatientListModal 
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        sequence={sequence}
        patients={mockPatients}
      />
    </>
  )
}