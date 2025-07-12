"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

/**
 * Mobile Navigation Drawer Props
 */
interface MobileNavDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean
  /** Callback when drawer should close */
  onClose: () => void
  /** Navigation content to render inside drawer */
  children: React.ReactNode
  /** Additional CSS classes for the drawer */
  className?: string
}

/**
 * Simple Portal-based Mobile Navigation Drawer
 * Renders directly to document.body to avoid layout issues
 */
export function MobileNavDrawer({ 
  isOpen, 
  onClose, 
  children, 
  className 
}: MobileNavDrawerProps) {
  // Debug logging
  console.log('🔍 PORTAL DRAWER: Rendering with isOpen:', isOpen)
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    console.log('🔍 PORTAL DRAWER: useEffect triggered, isOpen:', isOpen)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      console.log('🔍 PORTAL DRAWER: Setting body overflow hidden')
    } else {
      document.body.style.overflow = ''
      console.log('🔍 PORTAL DRAWER: Restoring body overflow')
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    console.log('🔍 PORTAL DRAWER: Backdrop clicked')
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Only render if we're in the browser
  if (typeof window === 'undefined') {
    return null
  }

  const drawerContent = (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          display: isOpen ? 'block' : 'none',
        }}
      />

      {/* Navigation drawer */}
      <div
        id="mobile-nav-drawer"
        role="navigation"
        aria-label="Mobile navigation menu"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '320px',
          maxWidth: '85vw',
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgb(237, 237, 235)', // --routiq-energy
          boxShadow: '0 25px 50px -12px rgba(26, 28, 18, 0.15)', // --routiq-core shadow
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 200ms ease-out',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgb(237, 237, 235)', // --routiq-energy
          backgroundColor: 'rgb(237, 237, 235, 0.3)' // --routiq-energy/30
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logos/routiq_print_cmyk_routiq_primary%20logo_core.svg"
              alt="Routiq"
              width={120}
              height={48}
              style={{ height: '32px', width: 'auto' }}
              priority
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('🔍 DRAWER: Close button clicked')
              onClose()
            }}
            style={{
              padding: '0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '0.5rem'
            }}
          >
            <X className="h-4 w-4" style={{ color: 'rgb(26, 28, 18)' }} />
          </Button>
        </div>

        {/* Drawer content */}
        <div style={{
          padding: '1rem',
          height: 'calc(100vh - 73px)', // Subtract header height
          overflowY: 'auto'
        }}>
          {children}
        </div>
      </div>
    </>
  )

  // Render to document.body using portal
  return createPortal(drawerContent, document.body)
}

/**
 * Mobile Navigation Item
 * 
 * Touch-friendly navigation item component for use within MobileNavDrawer.
 * Provides consistent styling and touch targets.
 * 
 * @example
 * ```tsx
 * <MobileNavItem 
 *   href="/dashboard" 
 *   icon={<HomeIcon />}
 *   isActive={pathname === '/dashboard'}
 * >
 *   Dashboard
 * </MobileNavItem>
 * ```
 */
interface MobileNavItemProps {
  /** Navigation link href */
  href?: string
  /** Whether this nav item is currently active */
  isActive?: boolean
  /** Icon to display */
  icon?: React.ReactNode
  /** Click handler for non-link items */
  onClick?: () => void
  /** Navigation item content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export function MobileNavItem({
  href,
  isActive = false,
  icon,
  onClick,
  children,
  className
}: MobileNavItemProps) {
  const baseClasses = cn(
    // Touch-friendly sizing (48px minimum height)
    "flex items-center gap-3 rounded-lg px-4 py-3 min-h-[48px]",
    // Typography
    "text-sm font-medium transition-all duration-200",
    // Touch optimization
    "touch-manipulation",
    // Focus and hover states
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-routiq-cloud",
    // Active state with brand colors
    isActive
      ? "bg-routiq-cloud text-white shadow-sm" 
      : "text-routiq-core hover:bg-routiq-energy/50 hover:text-routiq-core",
    className
  )

  const content = (
    <>
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
    >
      {content}
    </button>
  )
} 