'use client'

import { MainDashboardTabs } from './main-dashboard-tabs'

/**
 * Unified Dashboard Component
 * 
 * Main dashboard entry point that provides the tabbed interface for:
 * - Clinic Overview: Booking metrics and operational insights
 * - Patient Insights: Sentiment analysis and patient analytics
 * - Automation Summary: ROI tracking and automation performance
 */
export function UnifiedDashboard() {
  return <MainDashboardTabs />
} 