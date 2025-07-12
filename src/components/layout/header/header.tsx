"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, ChevronDown } from "lucide-react"
import Image from "next/image"
import { HamburgerMenu } from "@/components/layout/mobile/hamburger-menu"
import { useMobileNavigationContext } from "@/components/providers/mobile-navigation-provider"
import { ClerkOrganizationSwitcher } from "@/components/clerk-organization-switcher"
import { useOrganizationContext } from "@/hooks/useOrganizationContext"

export function DashboardHeader() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const pathname = usePathname()
  const { isOpen, isMobile, toggle } = useMobileNavigationContext()
  const { organizationName } = useOrganizationContext()

  console.log('🔍 HEADER: Rendering with state', { isOpen, isMobile, pathname })

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/sign-in' })
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback: redirect manually
      router.push('/sign-in')
    }
  }

  const handleProfileClick = () => {
    router.push('/dashboard/settings')
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
  }

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard Overview'
      case '/dashboard/conversations':
      case '/dashboard/conversations/phone':
        return 'Inbox'
      case '/dashboard/patients':
        return 'Patients'
      case '/dashboard/performance':
        return 'Performance Analytics'
      case '/dashboard/timing':
        return 'Timing Analysis'
      case '/dashboard/sentiment':
        return 'Sentiment Analysis'
      case '/dashboard/users':
        return 'User Management'
      case '/dashboard/settings':
        return 'Settings'
      default:
        // Handle dynamic routes like /dashboard/conversations/phone?phone=...
        if (pathname.startsWith('/dashboard/conversations/phone')) {
          return 'Inbox'
        }
        return 'Dashboard'
    }
  }

  const getPageDescription = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Healthcare analytics and patient engagement insights'
      case '/dashboard/conversations':
      case '/dashboard/conversations/phone':
        return 'Unified messaging center for patient communications'
      case '/dashboard/patients':
        return 'Patient management, churn analysis, and rebooking insights'
      case '/dashboard/performance':
        return 'Performance metrics and operational analytics'
      case '/dashboard/timing':
        return 'Response time analysis and efficiency metrics'
      case '/dashboard/sentiment':
        return 'Customer sentiment analysis and satisfaction tracking'
      case '/dashboard/users':
        return 'User roles, permissions, and account management'
      case '/dashboard/settings':
        return 'Application settings and configuration'
      default:
        // Handle dynamic routes like /dashboard/conversations/phone?phone=...
        if (pathname.startsWith('/dashboard/conversations/phone')) {
          return 'Unified messaging center for patient communications'
        }
        return 'Professional healthcare analytics platform'
    }
  }

  return (
    <header className="bg-[#ededeb] border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between md:justify-between">
          {/* Mobile Menu Button - Only on mobile */}
          <div className="md:hidden">
            <HamburgerMenu 
              isOpen={isOpen} 
              onClick={toggle}
              className=""
            />
          </div>

          {/* Logo Section - Centered on mobile, left-aligned on desktop */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-initial">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/logos/routiq_print_cmyk_routiq_primary%20logo_core.svg"
                  alt="Routiq"
                  width={160}
                  height={64}
                  className="h-10 w-auto"
                />
              </div>
            </div>
          </div>
          
          {/* Debug: Also show when isMobile is true (for testing) */}
          {isMobile && (
            <div className="hidden md:block text-xs text-red-500 p-1">
              Mobile detected
            </div>
          )}

          {/* Right Section - Organization Switcher, Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Organization Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Organization:</span>
              <ClerkOrganizationSwitcher />
            </div>
            
            {/* Mobile Organization Display */}
            {organizationName && (
              <div className="md:hidden">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                  {organizationName}
                </Badge>
              </div>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 px-3 rounded-xl hover:bg-gray-100 transition-colors duration-150">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                      {user?.imageUrl && (
                        <AvatarImage src={user.imageUrl} alt={user?.fullName || "User"} />
                      )}
                      <AvatarFallback className="bg-gray-200 text-gray-800 text-sm font-medium">
                        {user?.fullName ? getInitials(user.fullName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        <span className="md:hidden">
                          {user?.firstName || user?.fullName?.split(' ')[0] || 'User'}
                        </span>
                        <span className="hidden md:inline">
                          {user?.fullName || user?.firstName}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 leading-tight hidden md:block">
                        Healthcare Admin
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white border-gray-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {user?.imageUrl && (
                          <AvatarImage src={user.imageUrl} alt={user?.fullName || "User"} />
                        )}
                        <AvatarFallback className="bg-gray-200 text-gray-800">
                          {user?.fullName ? getInitials(user.fullName) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit text-xs bg-gray-100 text-gray-700 border-gray-200">
                      Healthcare Professional
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={handleProfileClick}
                  className="hover:bg-gray-50 focus:bg-gray-50"
                >
                  <User className="mr-3 h-4 w-4 text-gray-600" />
                  <span className="text-gray-800">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-red-600"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 