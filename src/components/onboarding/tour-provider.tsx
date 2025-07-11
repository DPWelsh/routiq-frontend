'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { TourOverlay } from './tour-overlay'
import { 
  dashboardTourSteps, 
  navigationTourSteps, 
  patientInsightsTourSteps,
  automationTourSteps,
  quickFeatureTourSteps,
  appWideTourSteps,
  focusedTourConfigs
} from './tour-configs'
import {
  dashboardContextualTour,
  patientInsightsContextualTour,
  inboxContextualTour,
  automationContextualTour,
  integrationsContextualTour,
  settingsContextualTour,
  navigationDiscoveryTour
} from './contextual-tours'
import { TourStep } from './tour-overlay'

interface TourContextType {
  isActive: boolean
  currentTour: string | null
  currentStep: number
  startTour: (tourName: string) => void
  stopTour: () => void
  nextStep: () => void
  previousStep: () => void
  skipTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: ReactNode
}

const tourConfigs: Record<string, TourStep[]> = {
  // Original tours
  dashboard: dashboardTourSteps,
  navigation: navigationTourSteps,
  'patient-insights': patientInsightsTourSteps,
  automation: automationTourSteps,
  'quick-feature': quickFeatureTourSteps,
  'app-wide': appWideTourSteps,
  'patient-management': focusedTourConfigs['patient-management'] || [],
  'automation-focus': focusedTourConfigs['automation-focus'] || [],
  'communications-focus': focusedTourConfigs['communications-focus'] || [],
  
  // New contextual tours
  'dashboard-contextual': dashboardContextualTour,
  'patient-insights-contextual': patientInsightsContextualTour,
  'inbox-contextual': inboxContextualTour,
  'automation-contextual': automationContextualTour,
  'integrations-contextual': integrationsContextualTour,
  'settings-contextual': settingsContextualTour,
  'navigation-discovery': navigationDiscoveryTour,
}

export function TourProvider({ children }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentTour, setCurrentTour] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const startTour = useCallback((tourName: string) => {
    if (tourConfigs[tourName]) {
      setCurrentTour(tourName)
      setCurrentStep(0)
      setIsActive(true)
      
      // Store tour state for persistence
      localStorage.setItem('routiq-active-tour', JSON.stringify({
        tourName,
        step: 0,
        timestamp: Date.now()
      }))
    } else {
      console.warn(`Tour "${tourName}" not found`)
    }
  }, [])

  const stopTour = useCallback(() => {
    setIsActive(false)
    setCurrentTour(null)
    setCurrentStep(0)
    localStorage.removeItem('routiq-active-tour')
  }, [])

  const nextStep = useCallback(() => {
    if (!currentTour) return
    
    const steps = tourConfigs[currentTour]
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      
      // Update stored state
      localStorage.setItem('routiq-active-tour', JSON.stringify({
        tourName: currentTour,
        step: newStep,
        timestamp: Date.now()
      }))
    } else {
      stopTour()
    }
  }, [currentTour, currentStep, stopTour])

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      
      // Update stored state
      if (currentTour) {
        localStorage.setItem('routiq-active-tour', JSON.stringify({
          tourName: currentTour,
          step: newStep,
          timestamp: Date.now()
        }))
      }
    }
  }, [currentStep, currentTour])

  const skipTour = useCallback(() => {
    // Mark tour as skipped for analytics
    if (currentTour) {
      localStorage.setItem('routiq-tour-skipped', JSON.stringify({
        tourName: currentTour,
        step: currentStep,
        timestamp: Date.now()
      }))
    }
    stopTour()
  }, [currentTour, currentStep, stopTour])

  const getCurrentSteps = () => {
    return currentTour ? tourConfigs[currentTour] || [] : []
  }

  // Keyboard shortcuts for demo purposes
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+Shift+O for Overview tour (navigation discovery)
      if (event.ctrlKey && event.shiftKey && event.key === 'O') {
        event.preventDefault()
        startTour('navigation-discovery')
      }
      // Ctrl+Shift+D to start dashboard contextual tour
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault()
        startTour('dashboard-contextual')
      }
      // Ctrl+Shift+P for patient insights contextual tour
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault()
        startTour('patient-insights-contextual')
      }
      // Ctrl+Shift+A for automation contextual tour
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        startTour('automation-contextual')
      }
      // Escape to stop tour
      if (event.key === 'Escape' && isActive) {
        event.preventDefault()
        stopTour()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [startTour, stopTour, isActive])

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentTour,
        currentStep,
        startTour,
        stopTour,
        nextStep,
        previousStep,
        skipTour,
      }}
    >
      {children}
      
      {/* Tour Overlay */}
      <TourOverlay
        steps={getCurrentSteps()}
        isActive={isActive}
        currentStep={currentStep}
        onComplete={stopTour}
        onSkip={skipTour}
        onStepChange={setCurrentStep}
      />
    </TourContext.Provider>
  )
}