import { TourStep } from './tour-overlay'

// Comprehensive App-Wide Tour - Complete Feature Walkthrough
export const appWideTourSteps: TourStep[] = [
  // 1. Welcome & Navigation Overview
  {
    id: 'app-welcome',
    title: 'Welcome to Routiq',
    description: 'Let\'s take a complete tour of your healthcare practice management platform. We\'ll explore every feature to help you maximize patient engagement and reduce churn.',
    target: '[data-tour="navigation-menu"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },

  // 2. Navigation Overview
  {
    id: 'nav-overview',
    title: 'Main Navigation',
    description: 'This sidebar contains all your practice management tools. Each section is designed to help you understand, engage, and retain your patients more effectively.',
    target: '[data-tour="navigation-menu"]',
    position: 'right',
    offset: { x: 20, y: 0 }
  },

  // 3. Dashboard Introduction
  {
    id: 'nav-dashboard-intro',
    title: 'Analytics Dashboard',
    description: 'Your central hub for practice performance metrics, patient insights, and ROI tracking. Let\'s start here to see your practice overview.',
    target: '[data-tour="nav-dashboard"]',
    position: 'right',
    action: 'click',
    actionText: 'Click to explore',
    offset: { x: 20, y: 0 }
  },

  // DASHBOARD SECTION
  {
    id: 'dashboard-tabs-overview',
    title: 'Dashboard Views',
    description: 'Switch between three key views: Clinic Overview for booking metrics, Patient Insights for engagement analysis, and Automation Summary for ROI tracking.',
    target: '[data-tour="dashboard-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'clinic-metrics-detail',
    title: 'Practice Performance Metrics',
    description: 'Monitor your most critical KPIs: active patient count, booking trends, revenue analytics, and conversion rates. These metrics help you identify growth opportunities.',
    target: '[data-tour="clinic-metrics"]',
    position: 'center',
    offset: { x: 0, y: 0 }
  },

  {
    id: 'patient-insights-tab',
    title: 'Patient Analytics',
    description: 'View detailed patient engagement patterns, sentiment analysis, and churn risk indicators. Click the Patient Overview tab to see more.',
    target: '[data-tour="patient-insights"]',
    position: 'top',
    action: 'click',
    actionText: 'Switch to Patient tab',
    offset: { x: 0, y: -20 }
  },

  {
    id: 'automation-summary-tab',
    title: 'Automation ROI Dashboard',
    description: 'Track your automated patient re-engagement campaigns, success rates, and revenue generated. Click Automation Overview to see your campaigns.',
    target: '[data-tour="automation-panel"]',
    position: 'top',
    action: 'click',
    actionText: 'View automation',
    offset: { x: 0, y: -20 }
  },

  // INBOX SECTION
  {
    id: 'nav-inbox-intro',
    title: 'Message Inbox',
    description: 'Your centralized communication hub for all patient messages across WhatsApp, SMS, email, and other channels. Let\'s explore the inbox.',
    target: '[data-tour="nav-inbox"]',
    position: 'right',
    action: 'click',
    actionText: 'Open inbox',
    offset: { x: 20, y: 0 },
    page: '/dashboard/inbox',
    waitForElement: true
  },

  {
    id: 'inbox-overview',
    title: 'Unified Patient Communications',
    description: 'All patient conversations in one place. View message history, patient context, sentiment scores, and respond from a single interface.',
    target: '[data-tour="inbox-content"]',
    position: 'center',
    offset: { x: 0, y: 0 },
    page: '/dashboard/inbox',
    waitForElement: true
  },

  {
    id: 'message-filters',
    title: 'Smart Message Filtering',
    description: 'Filter conversations by urgency, sentiment, response status, or communication channel to prioritize your patient interactions.',
    target: '[data-tour="message-filters"]',
    position: 'bottom',
    offset: { x: 0, y: 20 },
    page: '/dashboard/inbox',
    waitForElement: true
  },

  // PATIENT INSIGHTS SECTION
  {
    id: 'nav-patient-insights-intro',
    title: 'Patient Journey Analytics',
    description: 'Deep dive into patient behavior patterns, engagement levels, and re-engagement opportunities. This is where you identify at-risk patients.',
    target: '[data-tour="nav-patient-insights"]',
    position: 'right',
    action: 'click',
    actionText: 'Explore insights',
    offset: { x: 20, y: 0 },
    page: '/dashboard/patient-insights',
    waitForElement: true
  },

  {
    id: 'patient-insights-tabs',
    title: 'Patient Analysis Views',
    description: 'Four powerful views: All Patients for comprehensive lists, Engagement Overview for trends, Top Opportunities for re-engagement targets, and Journey Tracking for patient paths.',
    target: '[data-tour="insights-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'patient-segments',
    title: 'Smart Patient Segmentation',
    description: 'Patients automatically categorized by engagement: High Engagement (loyal patients), At Risk (declining engagement), and Needs Attention (immediate intervention required).',
    target: '[data-tour="patient-segments"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'sentiment-analysis',
    title: 'Patient Sentiment Tracking',
    description: 'AI-powered sentiment analysis from patient communications. Track satisfaction trends and identify unhappy patients before they churn.',
    target: '[data-tour="sentiment-analysis"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },

  {
    id: 'reengagement-opportunities',
    title: 'Re-engagement Recommendations',
    description: 'AI-powered suggestions for re-engaging at-risk patients. Get specific recommendations for timing, messaging, and approach for each patient.',
    target: '[data-tour="action-items"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },

  // AUTOMATION CENTER SECTION
  {
    id: 'nav-automation-intro',
    title: 'Automation Workflows',
    description: 'Build and manage automated patient re-engagement sequences. Create follow-up campaigns, rebooking flows, and wellness check sequences.',
    target: '[data-tour="nav-automation"]',
    position: 'right',
    action: 'click',
    actionText: 'Open automation',
    offset: { x: 20, y: 0 }
  },

  {
    id: 'active-sequences',
    title: 'Live Campaign Dashboard',
    description: 'Monitor all your active automation sequences in real-time. See performance metrics, success rates, and ROI for each campaign.',
    target: '[data-tour="active-sequences"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'sequence-templates',
    title: 'Campaign Templates',
    description: 'Pre-built automation templates for common healthcare scenarios: post-appointment follow-ups, rebooking reminders, wellness checks, and treatment adherence.',
    target: '[data-tour="sequence-templates"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'roi-metrics',
    title: 'Automation ROI Analytics',
    description: 'Track the financial impact of your campaigns: rebooking rates, revenue generated per sequence, patient lifetime value improvements, and cost savings.',
    target: '[data-tour="roi-metrics"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },

  {
    id: 'create-sequence',
    title: 'Build Custom Campaigns',
    description: 'Create sophisticated automation flows with triggers, conditions, timing rules, and personalized messaging tailored to your practice needs.',
    target: '[data-tour="create-sequence"]',
    position: 'left',
    action: 'click',
    actionText: 'Create campaign',
    offset: { x: -20, y: 0 }
  },

  // INTEGRATIONS SECTION
  {
    id: 'nav-integrations-intro',
    title: 'Connected Services',
    description: 'Manage all your practice integrations: practice management systems, communication platforms, calendar tools, and patient databases.',
    target: '[data-tour="nav-integrations"]',
    position: 'right',
    action: 'click',
    actionText: 'View integrations',
    offset: { x: 20, y: 0 }
  },

  {
    id: 'healthcare-integrations',
    title: 'Practice Management Systems',
    description: 'Connect with Cliniko, SimplePractice, Jane, and other PM systems. Sync patient data, appointments, and treatment histories automatically.',
    target: '[data-tour="healthcare-integrations"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'communication-channels',
    title: 'Communication Platforms',
    description: 'Integrate WhatsApp Business, SMS providers, email marketing tools, and social media platforms for omnichannel patient communication.',
    target: '[data-tour="communication-channels"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'integration-health',
    title: 'Integration Monitoring',
    description: 'Real-time status monitoring for all connected services. Get alerts for sync issues, API errors, or disconnected services.',
    target: '[data-tour="integration-health"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },

  // SETTINGS SECTION
  {
    id: 'nav-settings-intro',
    title: 'Practice Configuration',
    description: 'Configure your clinic details, team permissions, notification preferences, and system settings. Let\'s explore the settings.',
    target: '[data-tour="nav-settings"]',
    position: 'right',
    action: 'click',
    actionText: 'Open settings',
    offset: { x: 20, y: 0 }
  },

  {
    id: 'clinic-setup',
    title: 'Clinic Profile Setup',
    description: 'Configure your practice information, upload your logo, set operating hours, and define your service offerings for personalized patient communication.',
    target: '[data-tour="clinic-setup"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'team-management',
    title: 'Staff & Permissions',
    description: 'Manage team members, assign roles (admin, practitioner, receptionist), and control access to different features and patient data.',
    target: '[data-tour="team-management"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },

  {
    id: 'notification-settings',
    title: 'Smart Alerts & Reports',
    description: 'Configure alerts for booking drops, patient satisfaction issues, automation performance, and schedule automated reports for your practice.',
    target: '[data-tour="notification-settings"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },

  // HELP & SUPPORT
  {
    id: 'help-center',
    title: 'Help & Learning Resources',
    description: 'Access documentation, video tutorials, best practices, and contact support. Plus, replay any of these tours anytime.',
    target: '[data-tour="help-button"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },

  // CONCLUSION
  {
    id: 'tour-complete',
    title: 'Tour Complete! 🎉',
    description: 'You\'ve seen all of Routiq\'s powerful features for patient engagement and practice growth. Start with the dashboard to monitor your practice, then explore patient insights to identify opportunities.',
    target: '[data-tour="nav-dashboard"]',
    position: 'center',
    action: 'click',
    actionText: 'Start using Routiq',
    offset: { x: 0, y: 0 }
  }
]

// Focused Feature Tours for specific sections
export const focusedTourConfigs = {
  'patient-management': [
    {
      id: 'patient-focus-intro',
      title: 'Patient Management Focus',
      description: 'Deep dive into patient tracking, engagement analysis, and re-engagement strategies.',
      target: '[data-tour="nav-patient-insights"]',
      position: 'right',
      action: 'click',
      offset: { x: 20, y: 0 }
    },
    // Add patient-specific steps...
  ],

  'automation-focus': [
    {
      id: 'automation-focus-intro', 
      title: 'Automation Mastery',
      description: 'Complete guide to building, managing, and optimizing patient re-engagement campaigns.',
      target: '[data-tour="nav-automation"]',
      position: 'right',
      action: 'click',
      offset: { x: 20, y: 0 }
    },
    // Add automation-specific steps...
  ],

  'communications-focus': [
    {
      id: 'comms-focus-intro',
      title: 'Communication Excellence', 
      description: 'Master patient communications across all channels and platforms.',
      target: '[data-tour="nav-inbox"]',
      position: 'right',
      action: 'click',
      offset: { x: 20, y: 0 }
    },
    // Add communication-specific steps...
  ]
}