import { useState, useEffect, useCallback } from 'react'
import { useClerkOrganization } from '@/hooks/useClerkOrganization'
import { RoutiqAPI } from '@/lib/routiq-api'

export interface ClientOrganizationContext {
  organizationId: string
  organizationName: string
  organizationSlug: string | null
  userRole: 'admin' | 'member' | null
  userStatus: 'active' | 'inactive'
  organizationStatus: 'active' | 'inactive'
  clerkUserId: string
  permissions: Record<string, unknown>
}

export interface UseOrganizationContextResult {
  organizationContext: ClientOrganizationContext | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  
  // Convenience accessors
  organizationId: string | null
  organizationName: string | null
  userRole: 'admin' | 'member' | null
  isAdmin: boolean
  isOwner: boolean
  canManageUsers: boolean
}

/**
 * Hook to access organization context from Clerk and backend
 * Uses Clerk for organization info and backend for verification
 */
export function useOrganizationContext(): UseOrganizationContextResult {
  const { 
    user, 
    organizationId: clerkOrgId, 
    organizationName: clerkOrgName, 
    membershipRole, 
    isLoading: isClerkLoading 
  } = useClerkOrganization()
  
  const [organizationContext, setOrganizationContext] = useState<ClientOrganizationContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizationContext = useCallback(async (): Promise<void> => {
    if (isClerkLoading || !user || !clerkOrgId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Backend verification now enabled - endpoints are ready!
      const api = new RoutiqAPI(clerkOrgId)
      await api.verifyAuth(clerkOrgId)

      // Build context from Clerk data
      const context: ClientOrganizationContext = {
        organizationId: clerkOrgId,
        organizationName: clerkOrgName || '',
        organizationSlug: null,
        userRole: membershipRole as 'admin' | 'member' | null,
        userStatus: 'active',
        organizationStatus: 'active',
        clerkUserId: user.id,
        permissions: {},
      }

      setOrganizationContext(context)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Failed to build organization context:', err)
      setOrganizationContext(null)
    } finally {
      setIsLoading(false)
    }
  }, [isClerkLoading, user, clerkOrgId, clerkOrgName, membershipRole])

  // Fetch organization context when Clerk data is available
  useEffect(() => {
    fetchOrganizationContext()
  }, [fetchOrganizationContext])

  // Computed values for convenience
  const organizationId = organizationContext?.organizationId || null
  const organizationName = organizationContext?.organizationName || null
  const userRole = organizationContext?.userRole || null
  const isAdmin = userRole === 'admin'
  const isOwner = userRole === 'admin' // Clerk doesn't have owner role, treat admin as owner
  const canManageUsers = isAdmin

  return {
    organizationContext,
    isLoading: isLoading || isClerkLoading,
    error,
    refetch: fetchOrganizationContext,
    
    // Convenience accessors
    organizationId,
    organizationName,
    userRole,
    isAdmin,
    isOwner,
    canManageUsers,
  }
}

/**
 * Hook for organization permissions (wrapper around useOrganizationContext)
 */
export function useOrganizationPermissions() {
  const { userRole, isAdmin, isOwner, canManageUsers } = useOrganizationContext()
  
  return {
    userRole,
    isAdmin,
    isOwner,
    canManageUsers,
    canViewPatients: userRole !== null,
    canEditPatients: userRole === 'admin',
    canViewConversations: userRole !== null,
    canEditConversations: userRole === 'admin',
    canViewAnalytics: isAdmin,
    canManageOrganization: isOwner,
  }
} 