'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Bot, 
  Zap, 
  Mail,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Users,
  MessageSquare,
  Clock,
  Target
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{className?: string}>
  features: string[]
  gradient: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Routiq',
    description: 'Smart patient management with churn analysis and rebooking automation for healthcare providers',
    icon: Sparkles,
    features: [
      'Real-time dashboard analytics',
      'Patient journey tracking',
      'Automated engagement workflows',
      'Integrated healthcare tools'
    ],
    gradient: 'bg-blue-50'
  },
  {
    id: 'dashboard',
    title: 'Dashboard Analytics',
    description: 'Get real-time insights into your practice performance with comprehensive analytics',
    icon: BarChart3,
    features: [
      'Booking metrics & trends',
      'Patient volume tracking',
      'Revenue analytics',
      'Performance indicators'
    ],
    gradient: 'bg-blue-50'
  },
  {
    id: 'insights',
    title: 'Patient Insights',
    description: 'Track patient journeys and sentiment to improve engagement and reduce churn',
    icon: TrendingUp,
    features: [
      'Patient journey mapping',
      'Sentiment analysis',
      'Churn risk scoring',
      'Engagement metrics'
    ],
    gradient: 'bg-green-50'
  },
  {
    id: 'automation',
    title: 'Automation Centre',
    description: 'Set up automated workflows to re-engage patients and boost rebooking rates',
    icon: Bot,
    features: [
      'Automated follow-ups',
      'Rebooking sequences',
      'Personalized messaging',
      'ROI tracking'
    ],
    gradient: 'bg-purple-50'
  },
  {
    id: 'integrations',
    title: 'Connected Integrations',
    description: 'Seamlessly connect with your existing practice management and communication tools',
    icon: Zap,
    features: [
      'Practice management systems',
      'Messaging platforms',
      'Calendar integrations',
      'Data synchronization'
    ],
    gradient: 'bg-orange-50'
  }
]

interface WelcomeOnboardingProps {
  onComplete: () => void
  onSkip: () => void
  onStartInteractiveTour?: () => void
}

export function WelcomeOnboarding({ onComplete, onSkip, onStartInteractiveTour }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = onboardingSteps.length

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / totalSteps) * 100
  const step = onboardingSteps[currentStep]

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-routiq-core">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onSkip}
                className="text-routiq-core/60 hover:text-routiq-core touch-manipulation"
              >
                Skip tour
              </Button>
            </div>
            {/* Simple, reliable progress bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card className={`p-6 md:p-8 ${step.gradient} border-routiq-core/10`}>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                  {/* Content */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-white/80 shadow-sm">
                          <step.icon className="h-6 w-6 text-routiq-core" />
                        </div>
                        <Badge variant="secondary" className="bg-white/60">
                          {step.id === 'welcome' ? 'Getting Started' : 'Feature'}
                        </Badge>
                      </div>
                      
                      <h1 className="text-2xl md:text-3xl font-bold text-routiq-core">
                        {step.title}
                      </h1>
                      
                      <p className="text-base md:text-lg text-routiq-core/80 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                      {step.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-routiq-core/90 text-sm md:text-base">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-white/20"
                    >
                      {currentStep === 0 && <WelcomePreview />}
                      {currentStep === 1 && <DashboardPreview />}
                      {currentStep === 2 && <InsightsPreview />}
                      {currentStep === 3 && <AutomationPreview />}
                      {currentStep === 4 && <IntegrationsPreview />}
                    </motion.div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="bg-white/60 border-white/40 hover:bg-white/80 touch-manipulation min-h-[44px] px-4"
                  >
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {onboardingSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-6 md:w-8 rounded-full transition-all duration-300 ${
                          index <= currentStep 
                            ? 'bg-routiq-cloud' 
                            : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  {currentStep === totalSteps - 1 ? (
                    <div className="flex gap-2">
                      {onStartInteractiveTour && (
                        <Button
                          variant="outline"
                          onClick={onStartInteractiveTour}
                          className="bg-white/60 border-white/40 hover:bg-white/80 touch-manipulation min-h-[44px] px-4 hidden md:flex"
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Interactive Tour
                        </Button>
                      )}
                      <Button
                        onClick={handleNext}
                        className="bg-routiq-cloud hover:bg-routiq-cloud/90 text-white shadow-lg touch-manipulation min-h-[44px] px-6"
                      >
                        Get Started
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-routiq-cloud hover:bg-routiq-cloud/90 text-white shadow-lg touch-manipulation min-h-[44px] px-6"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Preview components for each step
function WelcomePreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-8 rounded bg-routiq-cloud/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-routiq-cloud" />
        </div>
        <span className="font-semibold text-routiq-core">Routiq Dashboard</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>
        <div className="h-16 bg-green-500/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-green-600" />
        </div>
        <div className="h-16 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Bot className="h-6 w-6 text-purple-600" />
        </div>
        <div className="h-16 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Zap className="h-6 w-6 text-orange-600" />
        </div>
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-routiq-core">Analytics Overview</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-routiq-core">Active Patients</span>
          <span className="font-bold text-blue-600">1,247</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm text-routiq-core">Monthly Revenue</span>
          <span className="font-bold text-green-600">$47,320</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-sm text-routiq-core">Conversion Rate</span>
          <span className="font-bold text-purple-600">89.4%</span>
        </div>
      </div>
    </div>
  )
}

function InsightsPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <span className="font-medium text-routiq-core">Patient Journey</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <Users className="h-4 w-4 text-green-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-routiq-core">High Engagement</div>
            <div className="text-xs text-routiq-core/60">847 patients</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
          <Clock className="h-4 w-4 text-yellow-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-routiq-core">At Risk</div>
            <div className="text-xs text-routiq-core/60">156 patients</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
          <Target className="h-4 w-4 text-red-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-routiq-core">Needs Attention</div>
            <div className="text-xs text-routiq-core/60">43 patients</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AutomationPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-purple-600" />
        <span className="font-medium text-routiq-core">Active Workflows</span>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-routiq-core">Follow-up Sequence</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
          </div>
          <div className="text-xs text-routiq-core/60">89% success rate</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-routiq-core">Rebooking Campaign</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
          </div>
          <div className="text-xs text-routiq-core/60">67% response rate</div>
        </div>
      </div>
    </div>
  )
}

function IntegrationsPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-orange-600" />
        <span className="font-medium text-routiq-core">Connected Services</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-routiq-core">Practice Management</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-routiq-core">Messaging Platform</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-routiq-core/60">Calendar Sync</span>
        </div>
      </div>
    </div>
  )
}