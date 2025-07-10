'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from 'lucide-react'

type TimeframeOption = '7d' | '30d' | '90d' | '1y'

interface TabHeaderProps {
  title: string
  subtitle: string
  timeframe: TimeframeOption
  onTimeframeChange: (timeframe: TimeframeOption) => void
  dateRange: string
  lastUpdated: string
  isLoading?: boolean
  isUsingFallback?: boolean
}

export function TabHeader({
  title,
  subtitle,
  timeframe,
  onTimeframeChange,
  dateRange,
  lastUpdated,
  isLoading = false,
  isUsingFallback = false
}: TabHeaderProps) {
  return (
    <>
      {/* Header with Timeframe Controls - Stripe style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-lg text-gray-600 mt-1">
            {subtitle}
          </p>
          {isUsingFallback && (
            <p className="text-amber-600 text-base mt-2 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Using demo data
            </p>
          )}
        </div>
        
        {/* Timeframe Toggle - Stripe style */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={timeframe === '7d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTimeframeChange('7d')}
            className={`
              h-8 px-3 text-base font-medium transition-colors
              ${timeframe === '7d' 
                ? 'bg-[#7BA2E0] text-white shadow-sm hover:bg-[#7BA2E0]/80' 
                : 'bg-white text-gray-600 hover:bg-[#7BA2E0]/70 hover:text-white'
              }
            `}
          >
            7 Days
          </Button>
          <Button
            variant={timeframe === '30d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTimeframeChange('30d')}
            className={`
              h-8 px-3 text-base font-medium transition-colors
              ${timeframe === '30d' 
                ? 'bg-[#7BA2E0] text-white shadow-sm hover:bg-[#7BA2E0]/80' 
                : 'bg-white text-gray-600 hover:bg-[#7BA2E0]/70 hover:text-white'
              }
            `}
          >
            30 Days
          </Button>
          <Button
            variant={timeframe === '90d' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTimeframeChange('90d')}
            className={`
              h-8 px-3 text-base font-medium transition-colors
              ${timeframe === '90d' 
                ? 'bg-[#7BA2E0] text-white shadow-sm hover:bg-[#7BA2E0]/80' 
                : 'bg-white text-gray-600 hover:bg-[#7BA2E0]/70 hover:text-white'
              }
            `}
          >
            90 Days
          </Button>
          <Button
            variant={timeframe === '1y' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTimeframeChange('1y')}
            className={`
              h-8 px-3 text-base font-medium transition-colors
              ${timeframe === '1y' 
                ? 'bg-[#7BA2E0] text-white shadow-sm hover:bg-[#7BA2E0]/80' 
                : 'bg-white text-gray-600 hover:bg-[#7BA2E0]/70 hover:text-white'
              }
            `}
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Date Range Display */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-base text-gray-600">
        <div className="font-medium">
          {dateRange}
        </div>
        <div className="flex items-center gap-2">
          <span>Last updated: {lastUpdated}</span>
          {isLoading && (
            <Badge variant="outline" className="text-sm text-routiq-cloud border-routiq-cloud">
              Refreshing...
            </Badge>
          )}
        </div>
      </div>
    </>
  )
} 