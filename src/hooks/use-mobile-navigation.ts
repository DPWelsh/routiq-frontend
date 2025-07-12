import { useState, useEffect, useCallback } from 'react'

/**
 * Detect if device is mobile based on User-Agent (SSR-safe)
 * This provides a good initial value to prevent hydration mismatches
 */
function getInitialMobileState(): boolean {
  // On server-side, assume mobile-first to be safe
  if (typeof window === 'undefined') {
    return true
  }
  
  // Check User-Agent for mobile indicators
  const userAgent = navigator.userAgent || ''
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
  const isMobileUserAgent = mobileRegex.test(userAgent)
  
  // Also check screen width as backup
  const hasSmallScreen = window.innerWidth < 768
  
  // Return true if either User-Agent indicates mobile OR screen is small
  return isMobileUserAgent || hasSmallScreen
}

/**
 * Mobile Navigation State Interface
 * 
 * Manages mobile navigation drawer state and responsive breakpoint detection.
 * Used for hamburger menu and mobile navigation drawer functionality.
 */
export interface MobileNavigationState {
  /** Whether the mobile navigation drawer is currently open */
  isOpen: boolean
  /** Whether the current viewport is considered mobile (< 768px) */
  isMobile: boolean
  /** Toggle the navigation drawer open/closed */
  toggle: () => void
  /** Close the navigation drawer */
  close: () => void
  /** Open the navigation drawer */
  open: () => void
}

/**
 * Mobile Navigation Hook
 * 
 * ⚠️  CRITICAL: This hook manages mobile-only navigation state
 * 
 * - Detects mobile breakpoint (< 768px) following Tailwind's `md` breakpoint
 * - Manages drawer open/close state with proper cleanup
 * - Provides smooth interactions with <150ms response times
 * - Handles keyboard accessibility (Escape key closes drawer)
 * - Automatically closes drawer when switching to desktop view
 * 
 * @returns {MobileNavigationState} Navigation state and control functions
 * 
 * @example
 * ```tsx
 * const { isOpen, isMobile, toggle, close } = useMobileNavigation()
 * 
 * // Show hamburger only on mobile
 * {isMobile && <HamburgerButton onClick={toggle} />}
 * 
 * // Show drawer when open
 * <MobileNavDrawer isOpen={isOpen} onClose={close} />
 * ```
 */
export function useMobileNavigation(): MobileNavigationState {
  const [isOpen, setIsOpen] = useState(false)
  // Use initial mobile state to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState(() => getInitialMobileState())
  const [hasMounted, setHasMounted] = useState(false)

  // Track when component has mounted to prevent hydration issues
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Detect mobile breakpoint (< 768px = Tailwind's md breakpoint)
  useEffect(() => {
    if (!hasMounted) return // Wait until mounted to avoid hydration issues

    function checkIsMobile() {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Auto-close drawer when switching to desktop
      if (!mobile && isOpen) {
        setIsOpen(false)
      }
    }

    // Initial check after mount
    checkIsMobile()

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [isOpen, hasMounted])

  // Handle Escape key to close drawer
  useEffect(() => {
    if (!hasMounted) return // Wait until mounted

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, hasMounted])

  // Control functions with useCallback for performance
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  return {
    isOpen,
    isMobile,
    toggle,
    close,
    open
  }
}

/**
 * Hook for detecting responsive breakpoints
 * 
 * Utility hook for detecting Tailwind CSS breakpoints in JavaScript.
 * Useful for conditional rendering based on screen size.
 * 
 * @param breakpoint - Tailwind breakpoint ('sm' | 'md' | 'lg' | 'xl' | '2xl')
 * @returns {boolean} True if viewport is below the breakpoint (mobile-first)
 * 
 * @example
 * ```tsx
 * const isMobile = useBreakpoint('md')  // true if < 768px
 * const isTablet = useBreakpoint('lg')  // true if < 1024px
 * ```
 */
export function useBreakpoint(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): boolean {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }

  // Get initial state based on user agent and screen size
  const getInitialBreakpointState = (): boolean => {
    if (typeof window === 'undefined') {
      // On server, assume mobile-first for smaller breakpoints
      return breakpoint === 'sm' || breakpoint === 'md'
    }
    return window.innerWidth < breakpoints[breakpoint]
  }

  const [isBelow, setIsBelow] = useState(() => getInitialBreakpointState())
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    function checkBreakpoint() {
      setIsBelow(window.innerWidth < breakpoints[breakpoint])
    }

    // Initial check after mount
    checkBreakpoint()

    // Listen for resize
    window.addEventListener('resize', checkBreakpoint)
    
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [breakpoint, hasMounted, breakpoints])

  return isBelow
} 