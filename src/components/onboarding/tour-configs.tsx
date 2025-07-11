import { TourStep } from './tour-overlay'
import { appWideTourSteps, focusedTourConfigs } from './app-wide-tour'

// Dashboard Tour - Highlights key dashboard features
export const dashboardTourSteps: TourStep[] = [
  {
    id: 'navigation',
    title: 'Navigation Menu',
    description: 'Access all your practice management tools from this sidebar. Each section provides specific insights and controls for your healthcare practice.',
    target: '[data-tour="navigation-menu"]',
    position: 'right',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'dashboard-tabs',
    title: 'Dashboard Overview',
    description: 'Switch between different views: Clinic Overview shows booking metrics, Patient Insights tracks engagement, and Automation Summary displays ROI.',
    target: '[data-tour="dashboard-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'clinic-metrics',
    title: 'Key Practice Metrics',
    description: 'Monitor your most important KPIs at a glance - active patients, booking trends, and revenue analytics.',
    target: '[data-tour="clinic-metrics"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'patient-insights',
    title: 'Patient Analytics',
    description: 'View patient engagement levels, sentiment analysis, and identify at-risk patients who may need re-engagement.',
    target: '[data-tour="patient-insights"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'automation-panel',
    title: 'Automation Center',
    description: 'See your active patient re-engagement campaigns, success rates, and ROI from automated workflows.',
    target: '[data-tour="automation-panel"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]

// Navigation Tour - Explains each navigation item
export const navigationTourSteps: TourStep[] = [
  {
    id: 'nav-dashboard',
    title: 'Dashboard Analytics',
    description: 'Your main hub for practice analytics, booking metrics, and overall performance insights.',
    target: '[data-tour="nav-dashboard"]',
    position: 'right',
    action: 'click',
    actionText: 'Click to explore',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'nav-inbox',
    title: 'Message Inbox',
    description: 'Centralized inbox for all patient communications across different channels like WhatsApp, SMS, and email.',
    target: '[data-tour="nav-inbox"]',
    position: 'right',
    action: 'click',
    actionText: 'View messages',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'nav-patient-insights',
    title: 'Patient Journey Tracking',
    description: 'Deep dive into patient engagement patterns, sentiment analysis, and identify re-engagement opportunities.',
    target: '[data-tour="nav-patient-insights"]',
    position: 'right',
    action: 'click',
    actionText: 'Explore insights',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'nav-automation',
    title: 'Automation Workflows',
    description: 'Set up and manage automated patient re-engagement sequences, follow-ups, and rebooking campaigns.',
    target: '[data-tour="nav-automation"]',
    position: 'right',
    action: 'click',
    actionText: 'Configure automation',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'nav-integrations',
    title: 'Connected Services',
    description: 'Manage integrations with your practice management system, communication platforms, and other tools.',
    target: '[data-tour="nav-integrations"]',
    position: 'right',
    action: 'click',
    actionText: 'Manage connections',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'nav-settings',
    title: 'Settings & Configuration',
    description: 'Configure your practice details, team permissions, notifications, and system preferences.',
    target: '[data-tour="nav-settings"]',
    position: 'right',
    action: 'click',
    actionText: 'Open settings',
    offset: { x: 20, y: 0 }
  }
]

// Patient Insights Tour - For the patient insights page
export const patientInsightsTourSteps: TourStep[] = [
  {
    id: 'insights-tabs',
    title: 'Patient Analytics Views',
    description: 'Switch between different patient analysis views: All Patients, Engagement Overview, Top Opportunities, and Journey Tracking.',
    target: '[data-tour="insights-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'patient-segments',
    title: 'Patient Segmentation',
    description: 'View patients categorized by engagement level: High Engagement, At Risk, and Needs Attention for targeted re-engagement.',
    target: '[data-tour="patient-segments"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'sentiment-analysis',
    title: 'Sentiment Tracking',
    description: 'Monitor patient satisfaction scores and sentiment trends to identify potential churn risks early.',
    target: '[data-tour="sentiment-analysis"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'action-items',
    title: 'Recommended Actions',
    description: 'AI-powered suggestions for re-engaging at-risk patients and optimizing your patient retention strategies.',
    target: '[data-tour="action-items"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]

// Automation Tour - For the automation center
export const automationTourSteps: TourStep[] = [
  {
    id: 'active-sequences',
    title: 'Active Campaigns',
    description: 'View all your running automation sequences with real-time performance metrics and success rates.',
    target: '[data-tour="active-sequences"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'sequence-templates',
    title: 'Campaign Templates',
    description: 'Choose from pre-built automation templates for common scenarios like follow-ups, rebooking, and wellness checks.',
    target: '[data-tour="sequence-templates"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'roi-metrics',
    title: 'ROI Analytics',
    description: 'Track the financial impact of your automation campaigns including rebooking rates and revenue generated.',
    target: '[data-tour="roi-metrics"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'create-sequence',
    title: 'Create New Campaign',
    description: 'Build custom automation sequences with triggers, timing, messaging, and success criteria tailored to your practice.',
    target: '[data-tour="create-sequence"]',
    position: 'left',
    action: 'click',
    actionText: 'Start building',
    offset: { x: -20, y: 0 }
  }
]

// Quick Feature Tour - Abbreviated version for settings
export const quickFeatureTourSteps: TourStep[] = [
  {
    id: 'quick-navigation',
    title: 'Main Navigation',
    description: 'Your practice management hub - access analytics, patient insights, automation, and integrations.',
    target: '[data-tour="navigation-menu"]',
    position: 'right',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'quick-dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time insights into your practice performance, patient engagement, and automation ROI.',
    target: '[data-tour="dashboard-tabs"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  },
  {
    id: 'quick-help',
    title: 'Help & Support',
    description: 'Access documentation, contact support, or replay this tour anytime from the help menu.',
    target: '[data-tour="help-button"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  }
]

// Export the comprehensive app-wide tour
export { appWideTourSteps, focusedTourConfigs }

// TourStep interface is now imported from tour-overlay.tsx