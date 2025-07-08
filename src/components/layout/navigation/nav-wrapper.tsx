"use client"

import dynamic from 'next/dynamic'
import { useMobileNavigationContext } from "@/components/providers/mobile-navigation-provider"
import { MobileNavDrawer, MobileNavItem } from "@/components/layout/mobile/mobile-nav-drawer"
import { DashboardNav } from "./nav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useOrganizationContext } from "@/hooks/useOrganizationContext"
import { RoutiqAPI } from "@/lib/routiq-api"
import { 
  BarChart3, 
  MessageSquare,
  Mail,
  TrendingUp,
  Settings,
  HelpCircle
} from "lucide-react"
import { ClerkOrganizationSwitcher } from "@/components/clerk-organization-switcher"

interface DashboardStats {
  conversations: {
    total: number
    label: string
  }
  activePatients: {
    total: number
    label: string
  }
  messages: {
    total: number
  }
  lastUpdated: string
}

const navigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: BarChart3, 
    roles: ["ADMIN", "USER"],
    description: "Dashboard analytics",
    badge: null
  },
  { 
    name: "Inbox", 
    href: "/dashboard/inbox", 
    icon: Mail, 
    roles: ["ADMIN", "USER"],
    description: "Traditional message inbox",
    badge: null
  },
  { 
    name: "Patient Overview", 
    href: "/dashboard/patient-insights", 
    icon: TrendingUp, 
    roles: ["ADMIN", "USER"],
    description: "Patient journey tracking",
    badge: null
  },
  { 
    name: "Settings", 
    href: "/dashboard/settings", 
    icon: Settings, 
    roles: ["ADMIN", "USER"],
    description: "System configuration",
    badge: null
  }
]

function ResponsiveDashboardNav() {
  const { isOpen, isMobile, close } = useMobileNavigationContext()
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Get organization context and fetch dashboard stats
  const { organizationId } = useOrganizationContext()

  useEffect(() => {
    const fetchStats = async () => {
      if (!organizationId) {
        setLoading(false)
        return
      }

      try {
        const api = new RoutiqAPI(organizationId)
        const dashboardData = await api.getDashboard(organizationId)
        
        // Transform backend data to match expected DashboardStats interface
        const transformedStats: DashboardStats = {
          conversations: {
            total: 0, // No conversation data yet
            label: "0"
          },
          activePatients: {
            total: dashboardData?.summary?.active_patients || 0,
            label: (dashboardData?.summary?.active_patients || 0).toString()
          },
          messages: {
            total: 0 // No message data yet
          },
          lastUpdated: dashboardData?.summary?.last_sync_time || new Date().toISOString()
        }
        
        setStats(transformedStats)
      } catch (error) {
        console.error('Failed to fetch navigation stats:', error)
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [organizationId])

  // Helper function to get dynamic badge value
  const getBadgeValue = (badgeConfig: string | null): string | null => {
    if (!badgeConfig || !badgeConfig.startsWith('dynamic:') || !stats) {
      return badgeConfig
    }

    const key = badgeConfig.replace('dynamic:', '') as keyof DashboardStats
    const statData = stats[key]
    
    if (statData && typeof statData === 'object' && 'label' in statData) {
      return statData.label
    }
    
    return null
  }

  // Handle help & support click
  const handleHelpClick = () => {
    window.open('https://help.routiq.com', '_blank')
    close() // Close mobile drawer after navigation
  }

  const handleNavClick = () => {
    close() // Close mobile drawer when a navigation item is clicked
  }

  if (!isLoaded) return null

  const userRole = (user?.publicMetadata?.role as string) || "USER"

  // Desktop Navigation (hidden on mobile)
  const DesktopNav = (
    <nav className={cn(
      "h-[calc(100vh-73px)] w-64 bg-white border-r border-routiq-prompt/20 flex flex-col",
      isMobile ? "hidden" : "flex"
    )}>
      <DashboardNav />
    </nav>
  )

  // Mobile Navigation Content
  const MobileNavContent = (
    <>
      {/* Organization Switcher Section */}
      <div className="mb-6 pb-4 border-b border-routiq-prompt/20">
        <p className="text-xs font-semibold text-routiq-core/60 uppercase tracking-wider mb-3">
          ORGANIZATION
        </p>
        <div className="bg-routiq-energy/30 rounded-lg p-3">
          <ClerkOrganizationSwitcher />
        </div>
      </div>

      {/* Main Navigation Section */}
      <div className="mb-6">
        
        <div className="space-y-1">
          {navigation
            .filter(item => item.roles.includes(userRole))
            .filter(item => !["Engagement Centre", "Inbox"].includes(item.name)) // Hide messaging features from mobile
            .map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              
              const badgeValue = getBadgeValue(item.badge)

              return (
                <Link key={item.name} href={item.href} onClick={handleNavClick}>
                  <MobileNavItem
                    isActive={isActive}
                    icon={<item.icon className="h-5 w-5" />}
                    className="mb-1"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate font-medium">{item.name}</span>
                        {badgeValue && (
                          <Badge 
                            variant={badgeValue === "New" ? "default" : "secondary"}
                            className={cn(
                              "text-xs h-5 px-2 ml-2",
                              badgeValue === "New" 
                                ? "bg-routiq-cloud text-white" 
                                : loading 
                                  ? "animate-pulse bg-routiq-energy" 
                                  : "bg-routiq-energy text-routiq-core"
                            )}
                          >
                            {loading ? "..." : badgeValue}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-routiq-core/60 mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                  </MobileNavItem>
                </Link>
              )
            })}
        </div>
      </div>

      {/* Help & Support */}
      <div className="border-t border-routiq-prompt/20 pt-4">
        <MobileNavItem
          onClick={handleHelpClick}
          icon={<HelpCircle className="h-5 w-5" />}
        >
          <div className="flex-1">
            <span className="font-medium">Help & Support</span>
            <p className="text-xs text-routiq-core/60 mt-0.5">
              Get help and documentation
            </p>
          </div>
        </MobileNavItem>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Navigation */}
      {DesktopNav}

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={isOpen && isMobile} 
        onClose={close}
        className="bg-white"
      >
        {MobileNavContent}
      </MobileNavDrawer>
    </>
  )
}

// Keep the original loading fallback
const LoadingNav = (
  <nav className="w-64 bg-gradient-to-b from-white via-routiq-cloud/20 to-white border-r border-routiq-cloud/50 min-h-screen">
    <div className="p-6">
      <div className="space-y-4">
        <div className="h-4 bg-routiq-cloud/60 rounded-full animate-pulse"></div>
        <div className="h-4 bg-routiq-cloud/40 rounded-full animate-pulse"></div>
        <div className="h-4 bg-routiq-cloud/60 rounded-full animate-pulse"></div>
        <div className="h-4 bg-routiq-cloud/40 rounded-full animate-pulse"></div>
      </div>
    </div>
  </nav>
)

// Dynamically import the responsive navigation
const DashboardNavWrapper = dynamic(
  () => Promise.resolve(ResponsiveDashboardNav),
  { 
    ssr: false,
    loading: () => LoadingNav
  }
)

export { DashboardNavWrapper as DashboardNav } 