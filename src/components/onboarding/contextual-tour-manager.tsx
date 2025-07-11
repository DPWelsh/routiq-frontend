'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTour } from './tour-provider'
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  BarChart3, 
  Users, 
  Bot, 
  Zap, 
  Settings, 
  Mail,
  HelpCircle
} from 'lucide-react'

interface SectionInfo {
  path: string
  title: string
  description: string
  tourId: string
  icon: React.ComponentType<any>
  color: string
}

const sectionMappings: SectionInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard Analytics',
    description: 'Explore your practice performance metrics and insights',
    tourId: 'dashboard-contextual',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600'
  },
  {
    path: '/dashboard/patient-insights',
    title: 'Patient Journey Analytics',
    description: 'Discover patient engagement patterns and re-engagement opportunities',
    tourId: 'patient-insights-contextual',
    icon: Users,
    color: 'from-green-500 to-emerald-600'
  },
  {
    path: '/dashboard/inbox',
    title: 'Communication Hub',
    description: 'Master unified patient communications and smart filtering',
    tourId: 'inbox-contextual',
    icon: Mail,
    color: 'from-purple-500 to-violet-600'
  },
  {
    path: '/dashboard/automation-sequence',
    title: 'Automation Center',
    description: 'Build and manage patient re-engagement workflows',
    tourId: 'automation-contextual',
    icon: Bot,
    color: 'from-orange-500 to-red-600'
  },
  {
    path: '/dashboard/integrations',
    title: 'Connected Services',
    description: 'Set up and monitor your practice integrations',
    tourId: 'integrations-contextual',
    icon: Zap,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    path: '/dashboard/settings',
    title: 'Practice Configuration',
    description: 'Configure your clinic profile and team settings',
    tourId: 'settings-contextual',
    icon: Settings,
    color: 'from-gray-500 to-gray-600'
  }
]

export function ContextualTourManager() {
  const { user } = useUser()
  const { startTour, isActive } = useTour()
  const pathname = usePathname()
  const [showTourPrompt, setShowTourPrompt] = useState(false)
  const [currentSection, setCurrentSection] = useState<SectionInfo | null>(null)
  const [hasSeenPrompt, setHasSeenPrompt] = useState(false)

  useEffect(() => {
    if (!user || isActive) return

    // Find matching section
    const section = sectionMappings.find(s => pathname === s.path)
    if (!section) {
      setShowTourPrompt(false)
      return
    }

    // Check if user has seen tour for this section
    const userTourKey = `routiq-tour-seen-${user.id}-${section.tourId}`
    const hasSeenSectionTour = localStorage.getItem(userTourKey)

    // Check if we've already shown prompt for this session
    const sessionPromptKey = `session-prompt-${section.path}`
    const hasSeenSessionPrompt = sessionStorage.getItem(sessionPromptKey)

    if (!hasSeenSectionTour && !hasSeenSessionPrompt) {
      setCurrentSection(section)
      setHasSeenPrompt(false)
      
      // Small delay to let page load
      const timer = setTimeout(() => {
        setShowTourPrompt(true)
        // Mark as seen for this session
        sessionStorage.setItem(sessionPromptKey, 'true')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [pathname, user, isActive])

  const handleStartTour = () => {
    if (currentSection && user) {
      // Mark tour as seen for this user
      const userTourKey = `routiq-tour-seen-${user.id}-${currentSection.tourId}`
      localStorage.setItem(userTourKey, 'true')
      
      startTour(currentSection.tourId)
      setShowTourPrompt(false)
    }
  }

  const handleDismiss = () => {
    if (currentSection && user) {
      // Mark tour as seen (dismissed) for this user
      const userTourKey = `routiq-tour-seen-${user.id}-${currentSection.tourId}`
      localStorage.setItem(userTourKey, 'true')
    }
    setShowTourPrompt(false)
  }

  const handleMaybeLater = () => {
    setShowTourPrompt(false)
    // Don't mark as seen permanently, just for this session
  }

  if (!showTourPrompt || !currentSection || isActive) {
    return null
  }

  const Icon = currentSection.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <Card className="bg-white/95 backdrop-blur-sm border shadow-2xl">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${currentSection.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <Badge variant="secondary" className="bg-routiq-cloud/20 text-routiq-cloud mb-1">
                    New Section
                  </Badge>
                  <h3 className="font-semibold text-routiq-core text-sm">
                    {currentSection.title}
                  </h3>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-1 h-auto text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-routiq-core/80 text-sm leading-relaxed mb-3">
                {currentSection.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-routiq-core/60">
                <Sparkles className="h-3 w-3" />
                <span>Quick 3-minute walkthrough available</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStartTour}
                size="sm"
                className="flex-1 bg-routiq-cloud hover:bg-routiq-cloud/90 text-white"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Show Me Around
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMaybeLater}
                className="flex-shrink-0"
              >
                Later
              </Button>
            </div>

            {/* Footer hint */}
            <div className="mt-3 pt-3 border-t border-routiq-cloud/20">
              <div className="flex items-center gap-2 text-xs text-routiq-core/50">
                <HelpCircle className="h-3 w-3" />
                <span>You can replay tours anytime from the help menu</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}