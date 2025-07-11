'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
  CheckCircle,
  Navigation
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
  page?: string // Optional: page to navigate to for this step
  waitForElement?: boolean // Wait for element to appear after navigation
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
  const [isNavigating, setIsNavigating] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const currentTourStep = steps[step]

  // Handle page navigation and element positioning
  useEffect(() => {
    if (!isActive || !currentTourStep) return

    const handleStepNavigation = async () => {
      // Check if we need to navigate to a different page
      if (currentTourStep.page && pathname !== currentTourStep.page) {
        setIsNavigating(true)
        setIsVisible(false)
        router.push(currentTourStep.page)
        return
      }

      // Update target position
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
          setIsNavigating(false)

          // Scroll element into view with better positioning
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })

          // Add a small delay after scrolling to ensure position is stable
          setTimeout(() => {
            const updatedRect = targetElement.getBoundingClientRect()
            const updatedScrollTop = window.pageYOffset || document.documentElement.scrollTop
            const updatedScrollLeft = window.pageXOffset || document.documentElement.scrollLeft
            
            setTargetPosition({
              top: updatedRect.top + updatedScrollTop,
              left: updatedRect.left + updatedScrollLeft,
              width: updatedRect.width,
              height: updatedRect.height
            })
          }, 300)
        } else if (currentTourStep.waitForElement) {
          // Keep trying to find the element after navigation
          setTimeout(updateTargetPosition, 500)
        } else {
          console.warn(`Tour target not found: ${currentTourStep.target}`)
          setIsVisible(false)
          setIsNavigating(false)
        }
      }

      // Delay to ensure DOM is ready (longer delay after navigation)
      const delay = isNavigating ? 1000 : 100
      const timer = setTimeout(updateTargetPosition, delay)
      
      // Update position on window resize and scroll
      window.addEventListener('resize', updateTargetPosition)
      
      // More responsive scroll handling
      const handleScroll = () => {
        if (targetPosition) {
          updateTargetPosition()
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', updateTargetPosition)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    handleStepNavigation()
  }, [step, isActive, currentTourStep, pathname, router, isNavigating])

  // Reset navigation state when pathname changes
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating])

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

    // Get viewport dimensions first
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const offset = currentTourStep.offset || { x: 0, y: 0 }
    const tooltipWidth = Math.min(320, viewportWidth - 40) // Responsive width
    const tooltipHeight = 280 // Increased to match min-height
    const padding = 20
    const margin = 10 // Margin from viewport edges

    let position = { top: 0, left: 0 }

    // Calculate initial position based on preferred placement
    switch (currentTourStep.position) {
      case 'top':
        position = {
          top: targetPosition.top - tooltipHeight - padding + offset.y,
          left: targetPosition.left + (targetPosition.width / 2) - (tooltipWidth / 2) + offset.x
        }
        break
      case 'bottom':
        position = {
          top: targetPosition.top + targetPosition.height + padding + offset.y,
          left: targetPosition.left + (targetPosition.width / 2) - (tooltipWidth / 2) + offset.x
        }
        break
      case 'left':
        position = {
          top: targetPosition.top + (targetPosition.height / 2) - (tooltipHeight / 2) + offset.y,
          left: targetPosition.left - tooltipWidth - padding + offset.x
        }
        break
      case 'right':
        position = {
          top: targetPosition.top + (targetPosition.height / 2) - (tooltipHeight / 2) + offset.y,
          left: targetPosition.left + targetPosition.width + padding + offset.x
        }
        break
      case 'center':
      default:
        position = {
          top: scrollTop + viewportHeight / 2 - tooltipHeight / 2 + offset.y,
          left: viewportWidth / 2 - tooltipWidth / 2 + offset.x
        }
        break
    }

    // Adjust position to stay within viewport bounds
    
    // Horizontal bounds checking
    if (position.left < margin) {
      position.left = margin
    } else if (position.left + tooltipWidth > viewportWidth - margin) {
      position.left = viewportWidth - tooltipWidth - margin
    }

    // Vertical bounds checking
    const minTop = scrollTop + margin
    const maxTop = scrollTop + viewportHeight - tooltipHeight - margin

    if (position.top < minTop) {
      position.top = minTop
    } else if (position.top > maxTop) {
      position.top = maxTop
    }

    // For elements that are very close to viewport edges, prefer center positioning
    const targetCenterY = targetPosition.top + targetPosition.height / 2
    const targetCenterX = targetPosition.left + targetPosition.width / 2
    
    // If target is near edges and tooltip would be cut off, use center position
    if (currentTourStep.position !== 'center') {
      const isNearTopEdge = targetCenterY - scrollTop < tooltipHeight + padding * 2
      const isNearBottomEdge = scrollTop + viewportHeight - targetCenterY < tooltipHeight + padding * 2
      const isNearLeftEdge = targetCenterX < tooltipWidth + padding * 2
      const isNearRightEdge = viewportWidth - targetCenterX < tooltipWidth + padding * 2

      if ((isNearTopEdge && isNearBottomEdge) || (isNearLeftEdge && isNearRightEdge)) {
        // Use center position when near multiple edges
        position = {
          top: scrollTop + viewportHeight / 2 - tooltipHeight / 2,
          left: viewportWidth / 2 - tooltipWidth / 2
        }
      }
    }

    return position
  }

  // Show navigation indicator while navigating between pages
  if (!isActive) {
    return null
  }

  if (isNavigating) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="w-80 bg-white/95 backdrop-blur-sm border-routiq-cloud/30 shadow-2xl">
          <div className="p-6 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <Navigation className="w-12 h-12 text-routiq-cloud" />
            </motion.div>
            <h3 className="text-lg font-semibold text-routiq-core mb-2">
              Navigating to Next Feature
            </h3>
            <p className="text-routiq-core/70 text-sm">
              Taking you to <strong>{currentTourStep?.title}</strong>...
            </p>
            <div className="mt-4 flex gap-1 justify-center">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    index <= step 
                      ? 'bg-routiq-cloud' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  if (!isVisible || !targetPosition || !currentTourStep) {
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
          className="absolute pointer-events-auto z-10"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: '90vw', // Ensure tooltip doesn't exceed viewport
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
          <Card className="w-80 min-h-[280px] bg-white/95 backdrop-blur-sm border-routiq-cloud/30 shadow-2xl">
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