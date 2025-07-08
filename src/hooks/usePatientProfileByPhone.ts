import { useQuery } from '@tanstack/react-query';
import { RoutiqAPI, PatientProfile } from '@/lib/routiq-api';
import { useOrganizationContext } from '@/hooks/useOrganizationContext';

// Mock patient profile data for demo - using unknown first to bypass type checking
const createMockPatientProfile = (phone: string): PatientProfile => {
  const mockProfiles: Record<string, any> = {
    '+6287862502798': {
      patient_name: 'Griffin (via Uncle)',
      phone: '+6287862502798',
      engagement_level: 'moderately_engaged',
      churn_risk: 'medium',
      activity_status: 'active',
      total_conversations: 3,
      total_appointment_count: 2,
      quality_rating_avg: 4.2,
      overall_sentiment: 'positive',
      estimated_lifetime_value: 1200,
      contact_success_prediction: 'high',
      treatment_summary: 'Shoulder assessment and treatment plan for tourist patient',
      last_treatment_note: 'Responded well to initial treatment, continue with strengthening exercises',
    },
    '+447817478312': {
      patient_name: 'Immy',
      phone: '+447817478312',
      engagement_level: 'highly_engaged',
      churn_risk: 'low',
      activity_status: 'active',
      total_conversations: 8,
      total_appointment_count: 5,
      quality_rating_avg: 4.8,
      overall_sentiment: 'positive',
      estimated_lifetime_value: 2400,
      contact_success_prediction: 'high',
      treatment_summary: 'Costochondritis management with surf-specific strategies',
      last_treatment_note: 'Educated on prevention techniques for surfing-related rib irritation',
    },
    '+13109245014': {
      patient_name: 'Amanda Strum',
      phone: '+13109245014',
      engagement_level: 'moderately_engaged',
      churn_risk: 'medium',
      activity_status: 'active',
      total_conversations: 6,
      total_appointment_count: 4,
      quality_rating_avg: 3.8,
      overall_sentiment: 'neutral',
      estimated_lifetime_value: 1800,
      contact_success_prediction: 'medium',
      treatment_summary: 'Ulnar wrist/finger pain management with treatment modification',
      last_treatment_note: 'Treatment caused worsening symptoms, need gentler approach',
    },
    '+380987737958': {
      patient_name: 'Artem Melnychuk',
      phone: '+380987737958',
      engagement_level: 'highly_engaged',
      churn_risk: 'low',
      activity_status: 'active',
      total_conversations: 4,
      total_appointment_count: 3,
      quality_rating_avg: 4.5,
      overall_sentiment: 'positive',
      estimated_lifetime_value: 2000,
      contact_success_prediction: 'high',
      treatment_summary: 'Post-surgical knee rehabilitation and strengthening program',
      last_treatment_note: 'Excellent progress with post-surgical recovery, continue strengthening',
    }
  };

  const mockData = mockProfiles[phone];
  if (!mockData) {
    // Default mock data for unknown phone numbers
    return {
      patient_id: 'mock_patient',
      patient_name: 'Unknown Patient',
      phone: phone,
      engagement_level: 'moderately_engaged',
      churn_risk: 'medium',
      activity_status: 'active',
      total_conversations: 2,
      total_appointment_count: 1,
      quality_rating_avg: 4.0,
      overall_sentiment: 'neutral',
      estimated_lifetime_value: 1000,
      contact_success_prediction: 'medium',
      treatment_summary: 'General treatment plan',
      last_treatment_note: 'Initial assessment completed',
    } as unknown as PatientProfile;
  }

  return {
    patient_id: `mock_${phone.replace(/\D/g, '')}`,
    patient_name: mockData.patient_name || 'Unknown Patient',
    phone: phone,
    engagement_level: mockData.engagement_level || 'moderately_engaged',
    churn_risk: mockData.churn_risk || 'medium',
    activity_status: mockData.activity_status || 'active',
    total_conversations: mockData.total_conversations || 2,
    total_appointment_count: mockData.total_appointment_count || 1,
    quality_rating_avg: mockData.quality_rating_avg || 4.0,
    overall_sentiment: mockData.overall_sentiment || 'neutral',
    estimated_lifetime_value: mockData.estimated_lifetime_value || 1000,
    contact_success_prediction: mockData.contact_success_prediction || 'medium',
    treatment_summary: mockData.treatment_summary || 'General treatment plan',
    last_treatment_note: mockData.last_treatment_note || 'Initial assessment completed',
  } as unknown as PatientProfile;
};

/**
 * Hook to fetch patient profile data by phone number
 * This is used in the conversations page to get patient data for performance metrics
 */
export function usePatientProfileByPhone(phone: string) {
  const { organizationId } = useOrganizationContext();

  return useQuery({
    queryKey: ['patient-profile-by-phone', organizationId, phone],
    queryFn: async () => {
      if (!organizationId || !phone) return null;
      
      console.log('🔍 Fetching mock patient profile for:', phone);
      
      // For demo purposes, return mock data immediately
      const mockProfile = createMockPatientProfile(phone);
      
      console.log('✅ Mock patient profile created:', {
        name: mockProfile.patient_name,
        phone: mockProfile.phone,
        engagement: mockProfile.engagement_level,
        risk: mockProfile.churn_risk
      });
      
      return mockProfile;
    },
    enabled: !!organizationId && !!phone,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to get performance metrics from patient profile data
 * Maps patient profile data to conversation performance metrics
 */
export function usePatientPerformanceMetrics(patientProfile: PatientProfile | null) {
  if (!patientProfile) {
    return {
      clientSatisfactionScore: null,
      overallRating: 'unrated' as const,
      status: 'unknown' as const,
      sentiment: 'neutral' as const,
      engagementLevel: 'unknown' as const,
      riskLevel: 'unknown' as const,
      contactPrediction: 'unknown' as const,
      lifetimeValue: 0,
      appointmentCount: 0,
      conversationCount: 0,
    };
  }

  // Calculate overall rating from multiple factors
  const calculateOverallRating = () => {
    let score = 0;
    
    // Factor 1: Engagement level (40% weight)
    switch (patientProfile.engagement_level) {
      case 'highly_engaged':
        score += 40;
        break;
      case 'moderately_engaged':
        score += 30;
        break;
      case 'low_engagement':
        score += 20;
        break;
      case 'disengaged':
        score += 10;
        break;
    }
    
    // Factor 2: Risk level (30% weight)
    switch (patientProfile.churn_risk) {
      case 'low':
        score += 30;
        break;
      case 'medium':
        score += 20;
        break;
      case 'high':
        score += 10;
        break;
      case 'critical':
        score += 5;
        break;
    }
    
    // Factor 3: Recent activity (20% weight)
    if (patientProfile.activity_status === 'active') {
      score += 20;
    } else if (patientProfile.activity_status === 'recently_active') {
      score += 15;
    } else {
      score += 5;
    }
    
    // Factor 4: Conversation success (10% weight)
    if (patientProfile.total_conversations > 0) {
      score += 10;
    }
    
    // Convert to rating
    if (score >= 80) return 'good';
    if (score >= 60) return 'ok';
    return 'poor';
  };

  // Map status from patient profile
  const getStatus = () => {
    if (patientProfile.activity_status === 'active') return 'active';
    if (patientProfile.activity_status === 'recently_active') return 'recently_active';
    return 'inactive';
  };

  // Map sentiment from patient profile
  const getSentiment = () => {
    if (patientProfile.overall_sentiment) {
      const sentiment = patientProfile.overall_sentiment.toLowerCase();
      if (sentiment.includes('positive')) return 'positive';
      if (sentiment.includes('negative')) return 'negative';
      return 'neutral';
    }
    
    // Fallback: derive sentiment from engagement
    if (patientProfile.engagement_level === 'highly_engaged') return 'positive';
    if (patientProfile.engagement_level === 'disengaged') return 'negative';
    return 'neutral';
  };

  return {
    clientSatisfactionScore: patientProfile.quality_rating_avg || null,
    overallRating: calculateOverallRating(),
    status: getStatus(),
    sentiment: getSentiment(),
    engagementLevel: patientProfile.engagement_level,
    riskLevel: patientProfile.churn_risk,
    contactPrediction: patientProfile.contact_success_prediction,
    lifetimeValue: patientProfile.estimated_lifetime_value,
    appointmentCount: patientProfile.total_appointment_count,
    conversationCount: patientProfile.total_conversations,
  };
} 