/**
 * Routiq API Client
 * Integrates with Routiq Backend Production API
 */

// Production backend URL
const API_BASE = 'https://routiq-backend-prod.up.railway.app';

// Type declaration for Clerk global
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken(): Promise<string | null>;
      };
    };
  }
}

// Organization constants
export const ORGANIZATIONS = {
  SURF_REHAB: 'org_2xwHiNrj68eaRUlX10anlXGvzX7',
  TEST_ORG: 'org_2xwHiNrj68eaRUlX10anlXGvzX8'
} as const;

// Response types
export interface SyncTriggerResponse {
  success: boolean;
  message: string;
  sync_id: string;
  estimated_duration: string;
}

export interface SyncStatusResponse {
  clerk_api_connected: boolean;
  database_counts: {
    users: number;
    organizations: number;
    organization_members: number;
  };
  last_sync: string;
  sync_in_progress: boolean;
}

export interface SchedulerStatusResponse {
  organization_id: string;
  sync_running: boolean;           // ✅ Backend actual property name
  last_sync_time: string | null;   // ✅ Backend actual property name
  scheduler_active: boolean;
  message: string;
}

export interface DatabaseSummaryResponse {
  users: {
    total_users: number;
    users_last_7_days: number;
    users_with_login: number;
  };
  organizations: {
    total_organizations: number;
    orgs_last_7_days: number;
    active_organizations: number;
  };
  memberships: {
    total_memberships: number;
    active_memberships: number;
    orgs_with_members: number;
    users_with_orgs: number;
  };
  role_distribution: Array<{
    role: string;
    count: number;
  }>;
}

export interface ActivePatient {
  id: number;
  contact_id: string;
  contact_name?: string;
  contact_phone?: string;
  recent_appointment_count: number;
  upcoming_appointment_count: number;
  total_appointment_count: number;
  last_appointment_date?: string;
  recent_appointments?: unknown[];
  upcoming_appointments?: unknown[];
  created_at: string;
  updated_at: string;
}

export interface ActivePatientsResponse {
  organization_id: string;
  active_patients: ActivePatient[];
  total_count: number;
  timestamp: string;
}

export interface ActivePatientsSummaryResponse {
  organization_id: string;
  total_active_patients: number;
  patients_with_recent_appointments: number;
  patients_with_upcoming_appointments: number;
  last_sync_date?: string;
  avg_recent_appointments: number;
  avg_total_appointments: number;
  timestamp: string;
}

export interface SyncDashboardResponse {
  organization_id: string;
  dashboard_generated_at: string;
  contact_metrics: {
    total_contacts: number;
    cliniko_linked: number;
    unlinked: number;
    link_percentage: number;
  };
  active_patient_metrics: {
    total_active: number;
    avg_recent_appointments: number;
    avg_total_appointments: number;
    most_recent_appointment?: string;
    last_sync?: string;
  };
  service_status: {
    cliniko_configured: boolean;
    sync_enabled: boolean;
    is_active: boolean;
    last_service_sync?: string;
  };
  health_indicators: {
    has_contacts: boolean;
    has_active_patients: boolean;
    recent_sync: boolean;
    high_link_rate: boolean;
  };
}

// Reengagement API Types
export interface ReengagementDashboard {
  organization_id: string;
  summary: {
    total_patients: number;
    risk_breakdown: {
      critical: { count: number; avg_score: number };
      high: { count: number; avg_score: number };
      medium: { count: number; avg_score: number };
      low: { count: number; avg_score: number };
      engaged: { count: number; avg_score: number };
    };
    immediate_actions_needed: number;
  };
  top_priority_patients: Array<{
    id: string;
    name: string;
    risk_level: 'critical' | 'high' | 'medium' | 'low' | 'engaged';
    risk_score: number;
    action: string;
    days_since_contact: number;
  }>;
  last_updated: string;
}

export interface RiskMetricsResponse {
  organization_id: string;
  risk_summary: {
    critical: number;    // 45+ days no contact
    high: number;        // 30-44 days no contact  
    medium: number;      // 14-29 days no contact
    low: number;         // 7-13 days no contact
    engaged: number;     // Recent contact
  };
  alerts: {
    missed_appointments_14d: number;
    failed_communications: number;
    no_future_appointments: number;
  };
  immediate_actions_required: number;
  last_updated: string;
}

export interface PerformanceMetricsResponse {
  timeframe: string;
  reengagement_metrics: {
    outreach_attempts: number;
    successful_contacts: number;
    contact_success_rate: number;
    appointments_scheduled: number;
    conversion_rate: number;
    avg_days_to_reengage: number;
  };
  communication_channels: {
    sms: {
      sent: number;
      delivered: number;
      responded: number;
      response_rate: number;
    };
    email: {
      sent: number;
      opened: number;
      responded: number;
      response_rate: number;
    };
    phone: {
      attempted: number;
      connected: number;
      appointment_booked: number;
      conversion_rate: number;
    };
  };
  benchmark_comparison: {
    industry_avg_contact_rate: number;
    industry_avg_conversion: number;
    our_performance: 'above_average' | 'at_average' | 'below_average';
  };
}

export interface PrioritizedPatientsResponse {
  patients: PatientRiskData[];
  summary: {
    total_returned: number;
    filters_applied: {
      risk_level?: string;
      limit?: number;
    };
  };
  timestamp: string;
}

export interface TrendsResponse {
  period: string;
  daily_trends: Array<{
    date: string;
    new_at_risk: number;
    reengaged_successfully: number;
    outreach_attempts: number;
    appointments_scheduled: number;
  }>;
  channel_performance_trends: {
    sms: { success_rate_trend: string; change_pct: number };
    email: { success_rate_trend: string; change_pct: number };
    phone: { success_rate_trend: string; change_pct: number };
  };
  risk_distribution_changes: {
    critical_trend: string;
    high_trend: string;
    overall_improvement: boolean;
  };
  current_risk_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    engaged: number;
  };
}

export interface OutreachLogRequest {
  patient_id: string;
  method: 'sms' | 'email' | 'phone';
  outcome: 'success' | 'no_response' | 'failed';
  notes?: string;
}

export interface PatientRiskData {
  id: string;
  name: string;
  phone: string;
  email: string;
  risk_level: 'critical' | 'high' | 'medium' | 'low' | 'engaged';
  risk_score: number;
  days_since_last_contact: number;
  last_appointment_date: string | null;
  next_scheduled_appointment: string | null;
  recommended_action: string;
  action_priority: number;
  previous_response_rate: number;
  total_lifetime_appointments: number;
  missed_appointments_last_90d: number;
  
  // Patient Notes - NEW
  treatment_notes: Array<{
    id: string;
    date: string;
    note: string;
    provider: string;
    category: 'treatment' | 'communication' | 'scheduling' | 'insurance' | 'other';
  }>;
  
  // Enhanced metrics
  engagement_status: 'active' | 'dormant' | 'stale';
  attendance_rate_percent: number | null;
  conversations_90d: number;
  last_conversation_sentiment: string;
  contact_success_prediction: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  lifetime_value_aud: number | null;
}

// Legacy interfaces for backward compatibility
export interface PatientAtRisk {
  patient_id: string;
  patient_name: string;
  email?: string;
  phone?: string;
  risk_score: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  days_since_last_contact: number;
  action_priority: number;
  recommended_action: string;
  contact_success_prediction: 'high' | 'medium' | 'low';
  upcoming_appointments: number;
}

export interface PatientsAtRiskResponse {
  organization_id: string;
  patients: PatientAtRisk[];
  message?: string;
  timestamp: string;
}

export class RoutiqAPI {
  private baseUrl: string;
  private organizationId?: string;

  constructor(organizationId?: string) {
    this.baseUrl = API_BASE;
    this.organizationId = organizationId;
  }

  /**
   * Get authentication headers with Clerk JWT token
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    try {
      // Get Clerk session token (client-side)
      if (typeof window !== 'undefined' && window.Clerk) {
        const token = await window.Clerk.session?.getToken();
        return {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(this.organizationId && { 'x-organization-id': this.organizationId })
        };
      }
      
      // Server-side: headers should be provided by middleware or manually
      console.warn('Clerk session not available. Ensure proper authentication setup.');
      return {
        'Content-Type': 'application/json',
        ...(this.organizationId && { 'x-organization-id': this.organizationId })
      };
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return {
        'Content-Type': 'application/json',
        ...(this.organizationId && { 'x-organization-id': this.organizationId })
      };
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retries = 2): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const authHeaders = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: { ...authHeaders, ...options.headers }
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          // Handle specific error types from backend
          if (response.status === 401) {
            throw new Error('Authentication failed. Please sign in again.');
          }
          if (response.status === 403) {
            throw new Error('Access denied. Check organization permissions.');
          }
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            throw new Error(`Rate limited. Try again in ${retryAfter || '60'} seconds.`);
          }
          
          // Check if this is a connection error that might be retryable
          if (response.status === 500 && errorText.includes('connection already closed') && attempt < retries) {
            console.warn(`Backend connection error on attempt ${attempt + 1}, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
            continue;
          }
          
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        return response.json();
      } catch (error) {
        // If it's a network error and we have retries left, try again
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (attempt < retries && (error instanceof TypeError || errorMessage.includes('fetch'))) {
          console.warn(`Network error on attempt ${attempt + 1}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        console.error(`API request failed: ${endpoint}`, error);
        throw error;
      }
    }
    
    throw new Error('All retry attempts failed');
  }

  // ========================================
  // WORKING ENDPOINTS (Available Now)
  // ========================================

  /**
   * Trigger manual sync for organization
   * Uses backend sync trigger endpoint
   */
  async triggerSync(organizationId: string): Promise<SyncTriggerResponse> {
    // Create instance with organization context if not already set
    const api = this.organizationId ? this : new RoutiqAPI(organizationId);
    return api.request('/api/v1/sync/trigger', {
      method: 'POST'
    });
  }

  /**
   * Trigger Cliniko comprehensive sync for organization
   * Uses dedicated Cliniko sync endpoint
   */
  async triggerClinikoSync(organizationId: string, mode: 'comprehensive' | 'basic' | 'patients-only' = 'comprehensive'): Promise<SyncTriggerResponse> {
    return this.request(`/api/v1/cliniko/sync/${organizationId}?mode=${mode}`, {
      method: 'POST'
    });
  }

  /**
   * Get sync scheduler status for organization
   * Returns current sync status and last sync time - Updated to match backend
   */
  async getSyncStatus(organizationId?: string): Promise<SchedulerStatusResponse> {
    const api = organizationId ? new RoutiqAPI(organizationId) : this;
    return api.request('/api/v1/sync-manager/scheduler/status');
  }

  /**
   * Get Cliniko sync status for organization
   * Uses Next.js API proxy to avoid CORS issues
   */
  async getClinikoStatus(organizationId: string): Promise<{
    organization_id: string;
    last_sync_time?: string;
    total_contacts: number;
    active_patients: number;
    upcoming_appointments: number;
    message: string;
  }> {
    return this.request(`/api/cliniko/status/${organizationId}`);
  }

  /**
   * Verify authentication with backend
   * Tests if current JWT token and organization access are valid
   */
  async verifyAuth(organizationId?: string): Promise<{
    authenticated: boolean;
    organization_id: string;
    message: string;
  }> {
    const api = organizationId ? new RoutiqAPI(organizationId) : this;
    return api.request('/api/v1/auth/verify');
  }

  /**
   * Get dashboard summary for organization
   * Returns comprehensive dashboard metrics and recent activity
   */
  async getDashboard(organizationId: string): Promise<{
    success: boolean;
    organization_id: string;
    summary: {
      total_patients: number;
      active_patients: number;
      patients_with_upcoming: number;
      patients_with_recent: number;
      engagement_rate: number;
      last_sync_time: string;
      integration_status: string;
    };
    recent_activity: Array<{
      id: string;
      operation_type: string;
      status: string;
      started_at: string;
      completed_at: string;
    }>;
  }> {
    return this.request(`/api/v1/dashboard/${organizationId}`);
  }

  /**
   * Get patients statistics for organization
   * Returns active patient stats and optionally detailed patient data
   */
  async getPatients(organizationId: string, params?: {
    include_details?: boolean;
    limit?: number;
    with_appointments_only?: boolean;
  }): Promise<{
    total_active_patients: number;
    avg_recent_appointments: number;
    avg_upcoming_appointments: number;
    avg_total_appointments: number;
    organization_id: string;
    filters: {
      with_appointments_only: boolean;
      include_details: boolean;
    };
    timestamp: string;
    patient_details?: Array<{
      id: string;
      name: string;
      phone: string;
      email: string;
      cliniko_patient_id: string;
      is_active: boolean;
      recent_appointment_count: number;
      upcoming_appointment_count: number;
      total_appointment_count: number;
      next_appointment_time?: string;
      last_appointment_date?: string;
    }>;
    patient_details_count?: number;
  }> {
    let url = `/api/v1/cliniko/patients/${organizationId}/stats`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.include_details !== undefined) searchParams.append('include_details', params.include_details.toString());
      if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
      if (params.with_appointments_only !== undefined) searchParams.append('with_appointments_only', params.with_appointments_only.toString());
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    return this.request(url);
  }

  /**
   * Basic health check
   * Tests backend connectivity
   */
  async getHealth(): Promise<{ 
    status: string; 
    timestamp: string;
    version: string;
    environment: object;
  }> {
    return this.request('/health');
  }

  // ========================================
  // FUTURE ENDPOINTS (Need Environment Variables)
  // ========================================

  /**
   * Get active patients list for organization
   * Uses direct backend API call
   */
  async getActivePatients(organizationId: string, params?: {
    page?: number;
    page_size?: number;
    search_name?: string;
    min_recent_appointments?: number;
    has_upcoming?: boolean;
  }): Promise<{
    organization_id: string;
    patients: ActivePatient[];
    total_count: number;
    timestamp: string;
  }> {
    let url = `/api/v1/cliniko/patients/${organizationId}/active`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.page_size) searchParams.append('page_size', params.page_size.toString());
      if (params.search_name) searchParams.append('search_name', params.search_name);
      if (params.min_recent_appointments) searchParams.append('min_recent_appointments', params.min_recent_appointments.toString());
      if (params.has_upcoming !== undefined) searchParams.append('has_upcoming', params.has_upcoming.toString());
      if (searchParams.toString()) url += `?${searchParams.toString()}`;
    }
    
    const response = await this.request(url);
    return response as {
      organization_id: string;
      patients: ActivePatient[];
      total_count: number;
      timestamp: string;
    };
  }

  /**
   * Get active patients summary for organization
   * Uses direct backend API call
   */
  async getActivePatientsummary(organizationId: string): Promise<{
    organization_id: string;
    total_active_patients: number;
    patients_with_recent_appointments: number;
    patients_with_upcoming_appointments: number;
    last_sync_date: string | null;
    timestamp: string;
  }> {
    const response = await this.request(`/api/v1/cliniko/patients/${organizationId}/active/summary`);
    return response as {
      organization_id: string;
      total_active_patients: number;
      patients_with_recent_appointments: number;
      patients_with_upcoming_appointments: number;
      last_sync_date: string | null;
      timestamp: string;
    };
  }

  /**
   * Get comprehensive sync dashboard
   * Available when backend environment is configured
   */
  async getSyncDashboard(organizationId: string): Promise<SyncDashboardResponse> {
    return this.request(`/api/v1/cliniko/sync/dashboard/${organizationId}`);
  }

  /**
   * Get contacts with appointments
   * Available when backend environment is configured
   */
  async getContactsWithAppointments(organizationId: string): Promise<unknown> {
    return this.request(`/api/v1/cliniko/contacts/${organizationId}/with-appointments`);
  }

  /**
   * Force sync through scheduler (with duplicate prevention)
   * Available when backend environment is configured
   */
  async scheduleSync(organizationId: string): Promise<SyncTriggerResponse> {
    return this.request(`/api/v1/cliniko/sync/schedule/${organizationId}`, {
      method: 'POST'
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Test if advanced endpoints are available
   */
  async testAdvancedEndpoints(organizationId: string): Promise<boolean> {
    try {
      await this.getActivePatientsummary(organizationId);
      return true;
    } catch (_error) {
      console.log('Advanced endpoints not yet available:', _error);
      return false;
    }
  }

  /**
   * Get available features based on what endpoints work
   */
  async getAvailableFeatures(organizationId: string): Promise<{
    basic_sync: boolean;
    active_patients: boolean;
    dashboard: boolean;
  }> {
    const features = {
      basic_sync: false,
      active_patients: false,
      dashboard: false
    };

    try {
      await this.getSyncStatus();
      features.basic_sync = true;
    } catch (_error) {
      console.log('Basic sync not available');
    }

    try {
      await this.getActivePatientsummary(organizationId);
      features.active_patients = true;
      features.dashboard = true;
    } catch (_error) {
      console.log('Advanced features not yet available');
    }

    return features;
  }

  // ========================================
  // REENGAGEMENT ENDPOINTS - Updated to match new API
  // ========================================

  /**
   * Get risk metrics summary for dashboard cards
   * Priority 1: Risk Dashboard
   */
  async getRiskMetrics(organizationId: string): Promise<RiskMetricsResponse> {
    return this.request(`/api/v1/reengagement/${organizationId}/risk-metrics`);
  }

  /**
   * Get reengagement performance metrics
   * Priority 2: Performance Tracking
   */
  async getPerformanceMetrics(organizationId: string, timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days' = 'last_30_days'): Promise<PerformanceMetricsResponse> {
    return this.request(`/api/v1/reengagement/${organizationId}/performance?timeframe=${timeframe}`);
  }

  /**
   * Get prioritized patient list with risk scores and recommendations
   * Priority 3: Prioritized Patient List
   */
  async getPrioritizedPatients(organizationId: string, options?: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low' | 'engaged' | 'all';
    limit?: number;
  }): Promise<PrioritizedPatientsResponse> {
    const params = new URLSearchParams();
    if (options?.risk_level && options.risk_level !== 'all') {
      params.append('risk_level', options.risk_level);
    }
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/v1/reengagement/${organizationId}/prioritized${query}`);
  }

  /**
   * Get reengagement trends over time
   * Priority 4: Trends & Analytics
   */
  async getReengagementTrends(organizationId: string, options?: {
    period?: '7d' | '30d' | '90d' | '6m' | '1y';
    metrics?: 'risk_levels' | 'success_rates' | 'channel_performance';
  }): Promise<TrendsResponse> {
    const params = new URLSearchParams();
    if (options?.period) params.append('period', options.period);
    if (options?.metrics) params.append('metrics', options.metrics);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/v1/reengagement/${organizationId}/trends${query}`);
  }

  /**
   * Log outreach attempt for performance tracking
   */
  async logOutreachAttempt(organizationId: string, request: OutreachLogRequest): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/v1/reengagement/${organizationId}/log-outreach`, {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Get comprehensive dashboard data (single endpoint)
   * Complete Dashboard Integration
   */
  async getReengagementDashboard(organizationId: string): Promise<ReengagementDashboard> {
    return this.request(`/api/v1/reengagement/${organizationId}/dashboard`);
  }

  // Legacy methods for backward compatibility
  /**
   * @deprecated Use getPrioritizedPatients instead
   */
  async getPatientsAtRisk(organizationId: string, options?: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low' | 'all';
    limit?: number;
    action_required?: string;
  }): Promise<PatientsAtRiskResponse> {
    const params = new URLSearchParams();
    if (options?.risk_level) params.append('risk_level', options.risk_level);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.action_required) params.append('action_required', options.action_required);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/v1/reengagement/${organizationId}/patients/at-risk${query}`);
  }

  /**
   * Get database summary - Clerk admin endpoint
   */
  async getDatabaseSummary(): Promise<DatabaseSummaryResponse> {
    return this.request('/api/v1/clerk-admin/database-summary');
  }
}

// Default API instance for Surf Rehab
export const api = new RoutiqAPI(ORGANIZATIONS.SURF_REHAB);

// Utility function to create organization-specific API instance
export const createOrgAPI = (organizationId: string) => new RoutiqAPI(organizationId); 