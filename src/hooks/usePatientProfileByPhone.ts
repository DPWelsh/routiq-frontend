import { useQuery } from '@tanstack/react-query';
import { RoutiqAPI, PatientProfile } from '@/lib/routiq-api';
import { useOrganizationContext } from '@/hooks/useOrganizationContext';

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
      
      const api = new RoutiqAPI(organizationId);
      
      // Search for patient by phone number
      const response = await api.getPatientProfiles(organizationId, {
        search: phone,
        limit: 10 // Increase limit to find more potential matches
      });

      // Enhanced phone number matching
      const normalizePhone = (phoneStr: string) => {
        if (!phoneStr) return '';
        
        // Handle scientific notation (e.g., 6.2819E+12)
        if (phoneStr.includes('E+') || phoneStr.includes('e+')) {
          const num = parseFloat(phoneStr);
          phoneStr = num.toString();
        }
        
        // Remove all non-digits
        return phoneStr.replace(/[^\d]/g, '');
      };

      const normalizedSearchPhone = normalizePhone(phone);
      console.log('🔍 Searching for phone:', phone, 'normalized:', normalizedSearchPhone);

      // Find exact phone match with multiple matching strategies
      const exactMatch = response.patient_profiles.find(p => {
        if (!p.phone) return false; // Skip if phone is null/undefined
        
        const normalizedPatientPhone = normalizePhone(p.phone);
        console.log('🔍 Checking patient:', p.patient_name, 'phone:', p.phone, 'normalized:', normalizedPatientPhone);
        
        return (
          // Exact match
          p.phone === phone ||
          // With + prefix
          p.phone === `+${phone}` ||
          // Normalized digit comparison
          normalizedPatientPhone === normalizedSearchPhone ||
          // Check if search phone is contained in patient phone
          normalizedPatientPhone.includes(normalizedSearchPhone) ||
          // Check if patient phone is contained in search phone
          normalizedSearchPhone.includes(normalizedPatientPhone)
        );
      });

      console.log('🎯 Phone search result:', exactMatch ? {
        found: true,
        patient: exactMatch.patient_name,
        phone: exactMatch.phone,
        engagement: exactMatch.engagement_level
      } : { found: false, searchedPhone: phone, totalResults: response.patient_profiles.length });

      return exactMatch || null;
    },
    enabled: !!organizationId && !!phone,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // 2 minutes
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