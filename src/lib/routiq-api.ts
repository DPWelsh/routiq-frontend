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
  organization_id: string;
  timeframe: string;
  performance_metrics: {
    total_patients: number;
    engagement_health: {
      currently_active: number;
      currently_dormant: number;
      currently_stale: number;
    };
    risk_assessment: {
      high_risk: number;
      critical_risk: number;
      urgent_actions: number;
    };
    contact_metrics: {
      avg_contact_success_score: number;
      contact_rate_percent: number;
      success_prediction_breakdown: {
        very_high: number;
        high: number;
        medium: number;
        low: number;
      };
    };
    appointment_metrics: {
      upcoming_appointments: number;
      avg_attendance_rate: number;
    };
    financial_metrics: {
      total_lifetime_value: number;
      avg_lifetime_value: number;
    };
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

// NEW: Patient Profiles API interfaces (Backend API structure)
export interface PatientProfile {
  patient_id: string;
  organization_id: string;
  patient_name: string;
  email: string | null;
  phone: string | null;
  cliniko_patient_id: string;
  is_active: boolean;
  activity_status: 'active' | 'inactive' | 'recently_active';
  contact_type: string;
  treatment_summary: string | null;
  last_treatment_note: string | null;
  patient_status: string;
  medical_record_number: string | null;
  
  // Appointment data
  total_appointment_count: number;
  recent_appointment_count: number;
  upcoming_appointment_count: number;
  first_appointment_date: string | null;
  last_appointment_date: string | null;
  next_appointment_time: string | null;
  next_appointment_type: string | null;
  primary_appointment_type: string | null;
  treatment_notes: string | null;
  current_appointment_type: string | null;
  current_appointment_status: string | null;
  current_appointment_notes: string | null;
  next_appointment_date: string | null;
  next_appointment_status: string | null;
  next_appointment_notes: string | null;
  
  // Conversation data
  total_conversations: number;
  active_conversations: number;
  last_conversation_date: string | null;
  days_since_last_conversation: number | null;
  overall_sentiment: string | null;
  avg_sentiment_score: number | null;
  escalation_count: number;
  quality_rating_avg: number | null;
  
  // Message data
  total_messages: number;
  patient_messages: number;
  agent_messages: number;
  last_message_date: string | null;
  last_message_sentiment: string | null;
  avg_message_sentiment: string | null;
  days_since_last_message: number | null;
  
  // Outreach data
  total_outreach_attempts: number;
  successful_outreach: number;
  last_outreach_date: string | null;
  last_outreach_method: string | null;
  last_outreach_outcome: string | null;
  outreach_success_rate: number;
  days_since_last_outreach: number | null;
  
  // Engagement metrics
  engagement_level: 'highly_engaged' | 'moderately_engaged' | 'low_engagement' | 'disengaged';
  churn_risk: 'critical' | 'high' | 'medium' | 'low';
  estimated_lifetime_value: number;
  contact_success_prediction: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  action_priority: 1 | 2 | 3 | 4 | 5;
  
  // Date calculations
  days_since_last_appointment: number | null;
  days_until_next_appointment: number | null;
  days_until_next_appointment_detailed: number | null;
  
  // Metadata
  patient_created_at: string;
  patient_updated_at: string;
  last_synced_at: string;
  view_generated_at: string;
}

export interface PatientProfilesResponse {
  success: boolean;
  organization_id: string;
  patient_profiles: PatientProfile[];
  count: number;
  timestamp: string;
}

export interface SinglePatientProfileResponse {
  success: boolean;
  organization_id: string;
  patient_id: string;
  profile: PatientProfile;
  timestamp: string;
}

export interface PatientProfilesSummaryResponse {
  success: boolean;
  organization_id: string;
  summary: {
    total_patients: number;
    highly_engaged: number;
    moderately_engaged: number;
    low_engagement: number;
    disengaged: number;
    critical_risk: number;
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  };
  timestamp: string;
}

// Field mapping functions
export function mapPatientProfileToRiskData(profile: PatientProfile): PatientRiskData {
  return {
    id: profile.patient_id,
    name: profile.patient_name,
    phone: profile.phone || '',
    email: profile.email || '',
    risk_level: profile.churn_risk === 'critical' ? 'critical' : 
               profile.churn_risk === 'high' ? 'high' :
               profile.churn_risk === 'medium' ? 'medium' :
               profile.churn_risk === 'low' ? 'low' : 'engaged',
    risk_score: profile.action_priority * 20, // Convert 1-5 scale to 0-100
    days_since_last_contact: profile.days_since_last_conversation || 
                            profile.days_since_last_appointment || 0,
    last_appointment_date: profile.last_appointment_date || null,
    next_scheduled_appointment: profile.next_appointment_time,
    recommended_action: getRecommendedAction(profile),
    action_priority: profile.action_priority,
    previous_response_rate: profile.outreach_success_rate || 0,
    total_lifetime_appointments: profile.total_appointment_count,
    missed_appointments_last_90d: 0, // Not available in new API
    
    // Patient Notes - Create from available treatment data
    treatment_notes: profile.treatment_notes || profile.last_treatment_note ? 
      [{
        id: `${profile.patient_id}-treatment`,
        date: profile.last_appointment_date || profile.patient_updated_at,
        note: profile.treatment_notes || profile.last_treatment_note || '',
        provider: 'System',
        category: 'treatment' as const
      }] : [],
    
    // Enhanced metrics
    engagement_status: profile.activity_status === 'active' ? 'active' : 
                      profile.activity_status === 'recently_active' ? 'active' : 'dormant',
    attendance_rate_percent: null, // Not available in new API
    conversations_90d: profile.total_conversations,
    last_conversation_sentiment: profile.overall_sentiment || 'neutral',
    contact_success_prediction: profile.contact_success_prediction,
    lifetime_value_aud: profile.estimated_lifetime_value
  };
}

function getRecommendedAction(profile: PatientProfile): string {
  if (profile.churn_risk === 'critical') {
    return 'Immediate contact required - Critical risk';
  }
  if (profile.churn_risk === 'high') {
    return 'Contact within 24h - High risk';
  }
  if (profile.days_since_last_appointment && profile.days_since_last_appointment > 30) {
    return 'Schedule follow-up appointment';
  }
  if (profile.upcoming_appointment_count === 0) {
    return 'Book next appointment';
  }
  return `Priority ${profile.action_priority} - ${profile.engagement_level}`;
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

// Dashboard Analytics API Types (based on backend test results)
export interface DashboardAnalyticsResponse {
  booking_metrics: {
    total_bookings: number;
    period_comparison: number;
    bookings_via_ai: number;
  };
  patient_metrics: {
    total_patients: number;
    active_patients: number;
    new_patients: number;
  };
  financial_metrics: {
    total_revenue: number;
    avg_revenue_per_patient: number;
  };
  automation_metrics: {
    total_roi: number;
    automation_bookings: number;
    efficiency_score: number;
  };
  timeframe: string;
  last_updated: string;
}

export interface DashboardChartsResponse {
  booking_trends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  patient_satisfaction_trend: Array<{
    date: string;
    satisfaction_score: number;
    response_count: number;
  }>;
  automation_performance: Array<{
    date: string;
    ai_bookings: number;
    total_bookings: number;
    efficiency: number;
  }>;
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
   * 
   * UPDATED: Now uses new patient-profiles API with field mapping
   */
  async getPrioritizedPatients(organizationId: string, options?: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low' | 'engaged' | 'all';
    limit?: number;
  }): Promise<PrioritizedPatientsResponse> {
    // Use new patient profiles API method
    return this.getPrioritizedPatientsFromProfiles(organizationId, options);
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

  // ========================================
  // NEW: Patient Profiles API (Backend Team's Latest API)
  // ========================================

  /**
   * Get patient profiles with search and pagination
   * No authentication required - uses dashboard pattern
   */
  async getPatientProfiles(organizationId: string, options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<PatientProfilesResponse> {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());
    if (options?.search) params.set('search', options.search);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    // Direct fetch without authentication headers for patient profiles
    const response = await fetch(
      `${this.baseUrl}/api/v1/reengagement/${organizationId}/patient-profiles${queryString}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Patient Profiles API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  }

  /**
   * Get individual patient profile by ID
   * No authentication required - uses dashboard pattern
   */
  async getPatientProfile(organizationId: string, patientId: string): Promise<SinglePatientProfileResponse> {
    // Direct fetch without authentication headers
    const response = await fetch(
      `${this.baseUrl}/api/v1/reengagement/${organizationId}/patient-profiles/${patientId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Patient Profile API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  }

  /**
   * Get patient profiles summary statistics
   * No authentication required - uses dashboard pattern
   */
  async getPatientProfilesSummary(organizationId: string): Promise<PatientProfilesSummaryResponse> {
    // Direct fetch without authentication headers
    const response = await fetch(
      `${this.baseUrl}/api/v1/reengagement/${organizationId}/patient-profiles/summary`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Patient Profiles Summary API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  }

  /**
   * Get debug patient profiles (5 sample patients)
   * No authentication required - uses dashboard pattern
   */
  async getPatientProfilesDebug(organizationId: string): Promise<PatientProfilesResponse> {
    // Direct fetch without authentication headers
    const response = await fetch(
      `${this.baseUrl}/api/v1/reengagement/${organizationId}/patient-profiles/debug`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Patient Profiles Debug API Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Debug endpoint returns debug_profiles, convert to standard format
    return {
      success: data.success,
      organization_id: data.organization_id,
      patient_profiles: data.debug_profiles || data.patient_profiles, // Handle both formats
      count: data.count,
      timestamp: data.timestamp
    };
  }

  /**
   * Get patient profiles with automatic mapping to PatientRiskData format
   * This provides backward compatibility with existing frontend code
   */
  async getPrioritizedPatientsFromProfiles(organizationId: string, options?: {
    risk_level?: 'critical' | 'high' | 'medium' | 'low' | 'engaged' | 'all';
    limit?: number;
    search?: string;
  }): Promise<PrioritizedPatientsResponse> {
    // Get data from new patient profiles API
    const profilesResponse = await this.getPatientProfiles(organizationId, {
      limit: options?.limit,
      search: options?.search
    });

    // Map backend data to frontend format
    let patients = profilesResponse.patient_profiles.map(mapPatientProfileToRiskData);

    // Apply risk level filtering
    if (options?.risk_level && options.risk_level !== 'all') {
      patients = patients.filter(patient => patient.risk_level === options.risk_level);
    }

    return {
      patients,
      summary: {
        total_returned: patients.length,
        filters_applied: {
          risk_level: options?.risk_level,
          limit: options?.limit
        }
      },
      timestamp: profilesResponse.timestamp
    };
  }

  // Legacy methods for backward compatibility
  /**
   * @deprecated Use getPrioritizedPatientsFromProfiles instead
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

  /**
   * Get dashboard analytics data with timeframe filtering
   */
  async getDashboardAnalytics(organizationId: string, timeframe: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<DashboardAnalyticsResponse> {
    const params = new URLSearchParams({ timeframe });
    return this.request<DashboardAnalyticsResponse>(
      `/api/v1/dashboard/${organizationId}/analytics?${params.toString()}`
    );
  }

  /**
   * Get dashboard charts data for visualizations
   */
  async getDashboardCharts(organizationId: string, timeframe: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<DashboardChartsResponse> {
    const params = new URLSearchParams({ timeframe });
    return this.request<DashboardChartsResponse>(
      `/api/v1/dashboard/${organizationId}/charts?${params.toString()}`
    );
  }
}

// Default API instance for Surf Rehab
export const api = new RoutiqAPI(ORGANIZATIONS.SURF_REHAB);

// Utility function to create organization-specific API instance
export const createOrgAPI = (organizationId: string) => new RoutiqAPI(organizationId); 