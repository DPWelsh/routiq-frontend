import { useState, useEffect, useCallback } from 'react'
import { useClerkOrganization } from '@/hooks/useClerkOrganization'

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
    console.log('useOrganizationContext: fetchOrganizationContext called')
    console.log('useOrganizationContext: isClerkLoading:', isClerkLoading, 'user:', user?.id, 'clerkOrgId:', clerkOrgId)
    
    if (isClerkLoading || !user || !clerkOrgId) {
      console.log('useOrganizationContext: Missing required data, setting loading to false')
      setIsLoading(false)
      return
    }

    try {
      console.log('useOrganizationContext: Building organization context...')
      setIsLoading(true)
      setError(null)

      // Backend verification disabled - /api/v1/auth/verify endpoint not implemented yet
      // According to BACKEND_API_RESPONSE.md, only dashboard/patients/sync endpoints are ready
      // TODO: Re-enable when backend implements /api/v1/auth/verify endpoint
      // const api = new RoutiqAPI(clerkOrgId)
      // await api.verifyAuth(clerkOrgId)

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

      console.log('useOrganizationContext: Built context successfully:', context)
      setOrganizationContext(context)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('useOrganizationContext: Error building context:', err)
      setError(errorMessage)
      setOrganizationContext(null)
    } finally {
      setIsLoading(false)
    }
  }, [isClerkLoading, user, clerkOrgId, clerkOrgName, membershipRole])

  // Fetch organization context when Clerk data is available
  useEffect(() => {
    if (!isClerkLoading && user && clerkOrgId) {
      fetchOrganizationContext()
    }
  }, [isClerkLoading, user, clerkOrgId, fetchOrganizationContext])

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