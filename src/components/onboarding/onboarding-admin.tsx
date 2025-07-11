'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@clerk/nextjs'
import { 
  RefreshCw, 
  Users, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

export function OnboardingAdmin() {
  const { user } = useUser()
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Only show to admin users (you can customize this check)
  const isAdmin = user?.publicMetadata?.role === 'ADMIN' || user?.emailAddresses[0]?.emailAddress.includes('admin')

  if (!isAdmin) return null

  const resetAllOnboarding = () => {
    try {
      // Find all onboarding-related keys in localStorage
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('routiq-onboarding-completed-')) {
          keysToRemove.push(key)
        }
      }

      // Remove all onboarding completion flags
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })

      // Also remove legacy key if it exists
      localStorage.removeItem('routiq-onboarding-completed')

      setResetStatus('success')
      setTimeout(() => setResetStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to reset onboarding:', error)
      setResetStatus('error')
      setTimeout(() => setResetStatus('idle'), 3000)
    }
  }

  const getCurrentOnboardingUsers = () => {
    const users: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('routiq-onboarding-completed-')) {
        const userId = key.replace('routiq-onboarding-completed-', '')
        users.push(userId)
      }
    }
    return users
  }

  const onboardedUsers = getCurrentOnboardingUsers()

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-900">Onboarding Admin</CardTitle>
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
            Admin Only
          </Badge>
        </div>
        <CardDescription className="text-orange-700">
          Manage onboarding state for demo and testing purposes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
          <div>
            <h4 className="font-medium text-orange-900">Users with completed onboarding</h4>
            <p className="text-sm text-orange-700">
              {onboardedUsers.length} user{onboardedUsers.length !== 1 ? 's' : ''} have completed onboarding
            </p>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {onboardedUsers.length}
          </Badge>
        </div>

        {/* Reset Actions */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-900 mb-1">Reset All Onboarding</h4>
              <p className="text-sm text-orange-700 mb-3">
                Clear onboarding completion for all users. Next time anyone visits, they'll see the welcome tour.
              </p>
              <Button
                onClick={resetAllOnboarding}
                variant="outline"
                size="sm"
                disabled={resetStatus === 'success'}
                className="bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200"
              >
                {resetStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reset Complete
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All Users
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
            <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-900 mb-1">Reset Current User</h4>
              <p className="text-sm text-orange-700 mb-3">
                Clear onboarding completion for just the current user.
              </p>
              <Button
                onClick={() => {
                  if (user) {
                    const userOnboardingKey = `routiq-onboarding-completed-${user.id}`
                    localStorage.removeItem(userOnboardingKey)
                    window.location.href = '/onboarding'
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset & Restart Tour
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Tour Triggers */}
        <div className="pt-3 border-t border-orange-200">
          <h4 className="font-medium text-orange-900 mb-2">Smart Tour System</h4>
          <p className="text-sm text-orange-700 mb-3">Contextual tours appear automatically when users visit sections:</p>
          <div className="space-y-1 text-xs bg-white p-3 rounded border border-orange-200">
            <div className="text-orange-800 font-semibold">Automatic contextual prompts:</div>
            <div className="text-orange-600 ml-2">• Dashboard → Analytics tour (3 min)</div>
            <div className="text-orange-600 ml-2">• Patient Insights → Engagement tour (3 min)</div>
            <div className="text-orange-600 ml-2">• Inbox → Communication tour (3 min)</div>
            <div className="text-orange-600 ml-2">• Automation → Workflow tour (3 min)</div>
            <div className="text-orange-600 ml-2">• Integrations → Setup tour (3 min)</div>
          </div>
          
          <div className="mt-3 space-y-1 text-xs font-mono bg-white p-3 rounded border border-orange-200">
            <div className="text-orange-800 font-semibold">Force tour URLs:</div>
            <div className="text-orange-800">/dashboard?tour=navigation-discovery</div>
            <div className="text-orange-800">/dashboard?tour=dashboard-contextual</div>
          </div>
          
          <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800">
            <strong>New approach:</strong> No overwhelming 15-min tours! Smart, contextual 3-min guides when needed.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}