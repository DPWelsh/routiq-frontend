"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from "@/components/layout/navigation/nav-wrapper"
import { DashboardHeader } from "@/components/layout/header/header-wrapper"
import { MobileNavigationProvider } from "@/components/providers/mobile-navigation-provider"
import { LoadingSpinner } from '@/components/magicui'

interface ClientDashboardLayoutProps {
  children: React.ReactNode
}

export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const pathname = usePathname()
  
  // Check if this is a full-height page (like phone conversations or inbox)
  const isFullHeightPage = pathname?.includes('/conversations/phone') || pathname?.includes('/inbox')
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (!hasMounted) {
    console.log('🔄 CLIENT DASHBOARD LAYOUT: Showing loading spinner - Component not mounted yet')
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }
  
  return (
    <MobileNavigationProvider>
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <DashboardHeader />
        </div>
        
        {/* Main Content Area with top margin for fixed header */}
        <div className="flex pt-16 min-h-screen">
          {/* Fixed Sidebar - Hidden on mobile */}
          <div className="fixed left-0 top-16 bottom-0 z-40 hidden md:block">
            <DashboardNav />
          </div>
          
          {/* Main Content with left margin for fixed sidebar on desktop */}
          {isFullHeightPage ? (
            <main className="flex-1 md:ml-64 overflow-hidden bg-white">
              {children}
            </main>
          ) : (
            <main className="flex-1 md:ml-64 overflow-auto h-full">
              {children}
            </main>
          )}
        </div>
      </div>
    </MobileNavigationProvider>
  )
} 