"use client"

import dynamic from 'next/dynamic'

// Dynamically import DashboardHeader with no SSR
const DashboardHeader = dynamic(
  () => import('./header').then((mod) => ({ default: mod.DashboardHeader })),
  { 
    ssr: false,
    loading: () => (
      <header className="bg-[#ededeb] border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Routiq Hub Analytics</h1>
              <p className="text-sm text-gray-600">Loading healthcare dashboard...</p>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }
)

export { DashboardHeader } 