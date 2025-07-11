'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Target,
  MousePointer,
  Sparkles,
  CheckCircle
} from 'lucide-react'

export interface TourStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: 'click' | 'hover' | 'none'
  actionText?: string
  offset?: { x: number; y: number }
}

interface TourOverlayProps {
  steps: TourStep[]
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
  currentStep?: number
  onStepChange?: (step: number) => void
}

interface TargetPosition {
  top: number
  left: number
  width: number
  height: number
}

export function TourOverlay({ 
  steps, 
  isActive, 
  onComplete, 
  onSkip, 
  currentStep = 0,
  onStepChange 
}: TourOverlayProps) {
  const [step, setStep] = useState(currentStep)
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentTourStep = steps[step]

  // Update position when step changes or component mounts
  useEffect(() => {
    if (!isActive || !currentTourStep) return

    const updateTargetPosition = () => {
      const targetElement = document.querySelector(currentTourStep.target)
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        
        setTargetPosition({
          top: rect.top + scrollTop,
          left: rect.left + scrollLeft,
          width: rect.width,
          height: rect.height
        })
        setIsVisible(true)

        // Scroll element into view smoothly
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        })
      } else {
        console.warn(`Tour target not found: ${currentTourStep.target}`)
        setIsVisible(false)
      }
    }

    // Slight delay to ensure DOM is ready
    const timer = setTimeout(updateTargetPosition, 100)
    
    // Update position on window resize
    window.addEventListener('resize', updateTargetPosition)
    window.addEventListener('scroll', updateTargetPosition)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateTargetPosition)
      window.removeEventListener('scroll', updateTargetPosition)
    }
  }, [step, isActive, currentTourStep])

  // Sync with external step control
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step)
    }
  }, [step, onStepChange])

  useEffect(() => {
    setStep(currentStep)
  }, [currentStep])

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip()
  }

  const getTooltipPosition = () => {
    if (!targetPosition) return { top: 0, left: 0 }

    const offset = currentTourStep.offset || { x: 0, y: 0 }
    const tooltipWidth = 320
    const tooltipHeight = 200
    const padding = 20

    switch (currentTourStep.position) {
      case 'top':
        return {
          top: targetPosition.top - tooltipHeight - padding + offset.y,
          left: targetPosition.left + (targetPosition.width / 2) - (tooltipWidth / 2) + offset.x
        }
      case 'bottom':
        return {
          top: targetPosition.top + targetPosition.height + padding + offset.y,
          left: targetPosition.left + (targetPosition.width / 2) - (tooltipWidth / 2) + offset.x
        }
      case 'left':
        return {
          top: targetPosition.top + (targetPosition.height / 2) - (tooltipHeight / 2) + offset.y,
          left: targetPosition.left - tooltipWidth - padding + offset.x
        }
      case 'right':
        return {
          top: targetPosition.top + (targetPosition.height / 2) - (tooltipHeight / 2) + offset.y,
          left: targetPosition.left + targetPosition.width + padding + offset.x
        }
      case 'center':
      default:
        return {
          top: window.innerHeight / 2 - tooltipHeight / 2 + offset.y,
          left: window.innerWidth / 2 - tooltipWidth / 2 + offset.x
        }
    }
  }

  if (!isActive || !isVisible || !targetPosition || !currentTourStep) {
    return null
  }

  const tooltipPosition = getTooltipPosition()

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Dark overlay with spotlight cutout */}
        <div className="absolute inset-0 bg-black/60">
          {/* Spotlight cutout using clip-path */}
          <div 
            className="absolute inset-0 bg-black/80"
            style={{
              clipPath: `polygon(
                0% 0%, 
                0% 100%, 
                ${targetPosition.left}px 100%, 
                ${targetPosition.left}px ${targetPosition.top}px, 
                ${targetPosition.left + targetPosition.width}px ${targetPosition.top}px, 
                ${targetPosition.left + targetPosition.width}px ${targetPosition.top + targetPosition.height}px, 
                ${targetPosition.left}px ${targetPosition.top + targetPosition.height}px, 
                ${targetPosition.left}px 100%, 
                100% 100%, 
                100% 0%
              )`
            }}
          />
          
          {/* Glowing spotlight effect */}
          <div
            className="absolute border-4 border-routiq-cloud rounded-lg shadow-2xl"
            style={{
              top: targetPosition.top - 4,
              left: targetPosition.left - 4,
              width: targetPosition.width + 8,
              height: targetPosition.height + 8,
              boxShadow: `
                0 0 0 4px rgba(59, 130, 246, 0.3),
                0 0 20px rgba(59, 130, 246, 0.5),
                0 0 40px rgba(59, 130, 246, 0.3)
              `,
              animation: 'pulse 2s infinite'
            }}
          />
          
          {/* Pulsing target indicator */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: targetPosition.top + targetPosition.height / 2 - 12,
              left: targetPosition.left + targetPosition.width / 2 - 12,
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Target className="h-6 w-6 text-routiq-cloud" />
          </motion.div>
        </div>

        {/* Tooltip card */}
        <motion.div
          className="absolute pointer-events-auto"
          style={{
            top: Math.max(10, Math.min(window.innerHeight - 220, tooltipPosition.top)),
            left: Math.max(10, Math.min(window.innerWidth - 330, tooltipPosition.left)),
          }}
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            y: currentTourStep.position === 'top' ? 20 : currentTourStep.position === 'bottom' ? -20 : 0,
            x: currentTourStep.position === 'left' ? 20 : currentTourStep.position === 'right' ? -20 : 0
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            x: 0
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="w-80 bg-white/95 backdrop-blur-sm border-routiq-cloud/30 shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-routiq-cloud/20 text-routiq-cloud">
                    Step {step + 1} of {steps.length}
                  </Badge>
                  {currentTourStep.action && (
                    <Badge variant="outline" className="text-xs">
                      {currentTourStep.action === 'click' && <MousePointer className="h-3 w-3 mr-1" />}
                      {currentTourStep.actionText || currentTourStep.action}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-semibold text-routiq-core">
                  {currentTourStep.title}
                </h3>
                <p className="text-routiq-core/80 text-sm leading-relaxed">
                  {currentTourStep.description}
                </p>
              </div>

              {/* Progress indicators */}
              <div className="flex gap-1 mb-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      index <= step 
                        ? 'bg-routiq-cloud' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 0}
                  size="sm"
                  className="text-routiq-core border-routiq-cloud/30"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  size="sm"
                  className="bg-routiq-cloud hover:bg-routiq-cloud/90 text-white"
                >
                  {step === steps.length - 1 ? (
                    <>
                      Complete
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Skip button in top-right corner */}
        <motion.div
          className="absolute top-4 right-4 pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={handleSkip}
            className="bg-white/90 backdrop-blur-sm border-white/40 text-routiq-core hover:bg-white"
          >
            Skip Tour
          </Button>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </AnimatePresence>
  )
}