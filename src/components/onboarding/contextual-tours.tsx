import { TourStep } from './tour-overlay'

// Focused tours for each section - triggered when user navigates to the area

// Dashboard Analytics Tour (when user is on dashboard)
export const dashboardContextualTour: TourStep[] = [
  {
    id: 'dashboard-welcome',
    title: 'Welcome to Your Dashboard',
    description: 'This is your practice command center. Let me show you the most important features to help you understand and grow your practice.',
    target: '[data-tour="dashboard-tabs"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'dashboard-tabs-overview',
    title: 'Three Key Views',
    description: 'Switch between Clinic Overview (booking metrics), Patient Insights (engagement analysis), and Automation Summary (ROI tracking).',
    target: '[data-tour="dashboard-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'clinic-metrics-key',
    title: 'Your Practice KPIs',
    description: 'Monitor active patients, booking trends, and revenue. These metrics help you spot growth opportunities and potential issues early.',
    target: '[data-tour="clinic-metrics"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'patient-insights-preview',
    title: 'Patient Engagement Insights',
    description: 'Click the Patient Overview tab to see detailed patient analytics, sentiment tracking, and re-engagement opportunities.',
    target: '[data-tour="patient-insights"]',
    position: 'top',
    action: 'click',
    actionText: 'Explore insights',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'automation-summary-preview',
    title: 'Automation ROI Tracking',
    description: 'View your automated campaign performance and revenue impact. Click to see your active workflows.',
    target: '[data-tour="automation-panel"]',
    position: 'top',
    action: 'click',
    actionText: 'View automation',
    offset: { x: 0, y: -20 }
  }
]

// Patient Insights Tour (when user visits patient insights page)
export const patientInsightsContextualTour: TourStep[] = [
  {
    id: 'insights-welcome',
    title: 'Patient Journey Analytics',
    description: 'This is where you discover patient behavior patterns and identify who needs re-engagement. Let me walk you through the powerful features here.',
    target: '[data-tour="insights-tabs"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'insights-tabs-detail',
    title: 'Four Analysis Views',
    description: 'All Patients (comprehensive list), Engagement Overview (trends), Top Opportunities (re-engagement targets), and Journey Tracking (patient paths).',
    target: '[data-tour="insights-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'patient-segments-detail',
    title: 'Smart Patient Segmentation',
    description: 'Patients are automatically grouped: High Engagement (loyal), At Risk (declining), and Needs Attention (immediate action required).',
    target: '[data-tour="patient-segments"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'sentiment-analysis-detail',
    title: 'AI-Powered Sentiment Analysis',
    description: 'Track patient satisfaction from communications. Identify unhappy patients before they churn and celebrate positive feedback.',
    target: '[data-tour="sentiment-analysis"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'action-items-detail',
    title: 'Re-engagement Recommendations',
    description: 'Get AI-powered suggestions for re-engaging at-risk patients, including timing, messaging, and approach recommendations.',
    target: '[data-tour="action-items"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]

// Inbox Tour (when user visits inbox)
export const inboxContextualTour: TourStep[] = [
  {
    id: 'inbox-welcome',
    title: 'Unified Communication Hub',
    description: 'All your patient conversations in one place. WhatsApp, SMS, email, and more - with context and intelligence.',
    target: '[data-tour="inbox-content"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'message-filtering',
    title: 'Smart Message Filtering',
    description: 'Filter by urgency, sentiment, response status, or channel. Focus on what needs your attention most.',
    target: '[data-tour="message-filters"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'conversation-context',
    title: 'Patient Context & History',
    description: 'See patient history, appointment context, and sentiment scores alongside every conversation for informed responses.',
    target: '[data-tour="conversation-context"]',
    position: 'right',
    offset: { x: 20, y: 0 }
  }
]

// Automation Tour (when user visits automation center)
export const automationContextualTour: TourStep[] = [
  {
    id: 'automation-welcome',
    title: 'Automation Command Center',
    description: 'Build and manage patient re-engagement workflows. Turn manual follow-ups into automated, personalized campaigns.',
    target: '[data-tour="active-sequences"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'active-campaigns',
    title: 'Live Campaign Performance',
    description: 'Monitor all active automation sequences with real-time metrics, success rates, and ROI tracking.',
    target: '[data-tour="active-sequences"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'campaign-templates',
    title: 'Ready-to-Use Templates',
    description: 'Pre-built workflows for common scenarios: follow-ups, rebooking, wellness checks, and treatment adherence.',
    target: '[data-tour="sequence-templates"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'roi-tracking',
    title: 'Financial Impact Tracking',
    description: 'See the revenue generated by each campaign, patient lifetime value improvements, and cost savings.',
    target: '[data-tour="roi-metrics"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'build-campaign',
    title: 'Create Custom Workflows',
    description: 'Build sophisticated campaigns with triggers, conditions, timing, and personalized messaging.',
    target: '[data-tour="create-sequence"]',
    position: 'left',
    action: 'click',
    actionText: 'Start building',
    offset: { x: -20, y: 0 }
  }
]

// Integrations Tour (when user visits integrations)
export const integrationsContextualTour: TourStep[] = [
  {
    id: 'integrations-welcome',
    title: 'Connected Practice Ecosystem',
    description: 'Connect Routiq with your existing tools. Sync data automatically and manage everything from one place.',
    target: '[data-tour="healthcare-integrations"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'healthcare-systems',
    title: 'Practice Management Integration',
    description: 'Connect with Cliniko, SimplePractice, Jane, and others. Automatic patient data and appointment syncing.',
    target: '[data-tour="healthcare-integrations"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'communication-platforms',
    title: 'Communication Channels',
    description: 'Integrate WhatsApp Business, SMS providers, email tools, and social media for omnichannel patient communication.',
    target: '[data-tour="communication-channels"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'integration-monitoring',
    title: 'Real-time Health Monitoring',
    description: 'Monitor all your integrations for sync issues, API errors, or disconnections. Stay informed about your data flow.',
    target: '[data-tour="integration-health"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]

// Settings Tour (when user visits settings)
export const settingsContextualTour: TourStep[] = [
  {
    id: 'settings-welcome',
    title: 'Practice Configuration Center',
    description: 'Configure your clinic profile, manage team access, and set up notifications to customize Routiq for your practice.',
    target: '[data-tour="clinic-setup"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'clinic-profile',
    title: 'Clinic Profile & Branding',
    description: 'Set up your practice information, logo, operating hours, and services for personalized patient communications.',
    target: '[data-tour="clinic-setup"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'team-permissions',
    title: 'Staff Management & Roles',
    description: 'Add team members and assign roles: admin access, practitioner permissions, or receptionist-level access.',
    target: '[data-tour="team-management"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'smart-notifications',
    title: 'Intelligent Alerts & Reports',
    description: 'Set up alerts for booking drops, patient satisfaction issues, automation performance, and automated reports.',
    target: '[data-tour="notification-settings"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]

// Navigation overview tour (lightweight introduction)
export const navigationDiscoveryTour: TourStep[] = [
  {
    id: 'nav-welcome',
    title: 'Welcome to Routiq',
    description: 'Your intelligent patient management platform. Each section helps you understand, engage, and retain patients more effectively.',
    target: '[data-tour="navigation-menu"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },
  {
    id: 'nav-sections-overview',
    title: 'Explore by Section',
    description: 'Click any section to explore its features. I\'ll show you around each area when you visit - no overwhelming tours!',
    target: '[data-tour="navigation-menu"]',
    position: 'right',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'nav-help-discovery',
    title: 'Help & Tours Available',
    description: 'Need help anytime? Click here for documentation or to replay tours for any section.',
    target: '[data-tour="help-button"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]