'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTour } from './tour-provider'
import { useUser } from '@clerk/nextjs'
import { 
  Play, 
  Route, 
  Sparkles, 
  HelpCircle, 
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface TourOption {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  duration: string
}

const tourOptions: TourOption[] = [
  {
    id: 'app-wide',
    name: 'Complete App Tour',
    description: 'Comprehensive walkthrough of ALL features',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-routiq-cloud to-routiq-energy',
    duration: '15 min'
  },
  {
    id: 'navigation',
    name: 'Navigation Tour',
    description: 'Learn about the main navigation and features',
    icon: Route,
    color: 'bg-blue-500',
    duration: '3 min'
  },
  {
    id: 'dashboard',
    name: 'Dashboard Features',
    description: 'Explore analytics and key metrics',
    icon: Play,
    color: 'bg-green-500',
    duration: '4 min'
  },
  {
    id: 'quick-feature',
    name: 'Quick Overview',
    description: 'Brief tour of main features',
    icon: HelpCircle,
    color: 'bg-purple-500',
    duration: '2 min'
  }
]

export function TourLauncher() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { startTour, isActive } = useTour()
  const { user } = useUser()

  // Don't show if a tour is already active
  if (isActive) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4"
          >
            <Card className="w-80 bg-white/95 backdrop-blur-sm border shadow-xl">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-routiq-cloud" />
                    <h3 className="font-semibold text-routiq-core">Interactive Tours</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="p-1 h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {tourOptions.map((tour) => {
                    const Icon = tour.icon
                    return (
                      <button
                        key={tour.id}
                        onClick={() => {
                          startTour(tour.id)
                          setIsExpanded(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-routiq-cloud/10 transition-colors text-left"
                      >
                        <div className={`p-2 rounded-lg ${tour.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-routiq-core">{tour.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {tour.duration}
                            </Badge>
                          </div>
                          <p className="text-sm text-routiq-core/70">{tour.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-routiq-cloud/20">
                  <button
                    onClick={() => {
                      if (user) {
                        // Clear onboarding and restart for this specific user
                        const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
                        localStorage.removeItem(userOnboardingKey)
                        window.location.href = '/onboarding'
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 text-sm text-routiq-core/70 hover:text-routiq-core transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Restart Welcome Tour
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-14 w-14 rounded-full bg-routiq-cloud hover:bg-routiq-cloud/90 text-white shadow-lg"
        >
          {isExpanded ? (
            <ChevronDown className="h-6 w-6" />
          ) : (
            <ChevronUp className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </div>
  )
}