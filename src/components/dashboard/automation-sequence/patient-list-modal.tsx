'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, X, Mail, Phone } from 'lucide-react'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  lastAppointment: string
}

interface AutomationSequence {
  id: string
  title: string
  definition: string
  goal: string
  status: string
  patientCount: number
  color: string
  steps: any[]
}

interface PatientListModalProps {
  isOpen: boolean
  onClose: () => void
  sequence: AutomationSequence
  patients: Patient[]
}

export function PatientListModal({ isOpen, onClose, sequence, patients }: PatientListModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPatient = (patientId: string) => {
    setSelectedPatients(prev => [...prev, patientId])
  }

  const handleRemovePatient = (patientId: string) => {
    setSelectedPatients(prev => prev.filter(id => id !== patientId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${sequence.color}`} />
            {sequence.title} - Patient Management
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-routiq-core/60" />
            <Input
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Patients in Sequence */}
          <div className="bg-routiq-energy/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-routiq-core">
                Current Patients in Sequence ({sequence.patientCount})
              </h3>
              <Badge variant="secondary" className={sequence.color.replace('bg-', 'bg-') + '/20'}>
                {sequence.status}
              </Badge>
            </div>
            
            {sequence.patientCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {patients.slice(0, sequence.patientCount).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-routiq-prompt/20"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{patient.name}</p>
                        <div className="flex items-center gap-2 text-xs text-routiq-core/60">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-routiq-core/60">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePatient(patient.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-routiq-core/60">
                <p className="text-sm">No patients in this sequence yet</p>
              </div>
            )}
          </div>

          {/* Available Patients */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-routiq-core">
                Available Patients ({filteredPatients.length})
              </h3>
              <Button size="sm" className="bg-routiq-cloud hover:bg-routiq-cloud/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Selected ({selectedPatients.length})
              </Button>
            </div>

            <div className="overflow-y-auto max-h-64 space-y-2">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPatients.includes(patient.id)
                      ? 'border-routiq-cloud bg-routiq-cloud/5'
                      : 'border-routiq-prompt/20 hover:border-routiq-cloud/50'
                  }`}
                  onClick={() => 
                    selectedPatients.includes(patient.id) 
                      ? handleRemovePatient(patient.id)
                      : handleAddPatient(patient.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{patient.name}</p>
                      <div className="flex items-center gap-4 text-xs text-routiq-core/60">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                      </div>
                      <p className="text-xs text-routiq-core/60 mt-1">
                        Last appointment: {formatDate(patient.lastAppointment)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedPatients.includes(patient.id) && (
                      <Badge variant="secondary" className="bg-routiq-cloud/10 text-routiq-cloud">
                        Selected
                      </Badge>
                    )}
                    <Button
                      variant={selectedPatients.includes(patient.id) ? "secondary" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectedPatients.includes(patient.id) 
                          ? handleRemovePatient(patient.id)
                          : handleAddPatient(patient.id)
                      }}
                    >
                      {selectedPatients.includes(patient.id) ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                Export List
              </Button>
              <Button className="bg-routiq-cloud hover:bg-routiq-cloud/90">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}