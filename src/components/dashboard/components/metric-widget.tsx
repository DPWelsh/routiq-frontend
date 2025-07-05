import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react"

interface MetricWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string | number
    direction: 'up' | 'down' | 'neutral'
    period?: string
  }
  comparison?: {
    label: string
    value: string
  }
  icon?: LucideIcon
  variant?: 'default' | 'clinic' | 'patient' | 'automation'
  className?: string
  badge?: string
  loading?: boolean
}

/**
 * Reusable Metric Widget Component
 * 
 * Displays key metrics with optional trend indicators and comparisons.
 * Supports different variants for different dashboard areas.
 */
export function MetricWidget({
  title,
  value,
  subtitle,
  trend,
  comparison,
  icon: Icon,
  variant = 'default',
  className,
  badge,
  loading = false
}: MetricWidgetProps) {
  const variantStyles = {
    default: {
      border: 'border-routiq-cloud/20',
      value: 'text-routiq-core',
      icon: 'text-routiq-blackberry/70'
    },
    clinic: {
      border: 'border-routiq-cloud/20',
      value: 'text-routiq-core',
      icon: 'text-routiq-blackberry/70'
    },
    patient: {
      border: 'border-routiq-energy/20',
      value: 'text-routiq-energy',
      icon: 'text-routiq-blackberry/70'
    },
    automation: {
      border: 'border-routiq-prompt/20',
      value: 'text-routiq-prompt',
      icon: 'text-routiq-blackberry/70'
    }
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return TrendingUp
      case 'down':
        return TrendingDown
      case 'neutral':
        return Minus
      default:
        return Minus
    }
  }

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'neutral':
        return 'text-routiq-blackberry/70'
      default:
        return 'text-routiq-blackberry/70'
    }
  }

  const styles = variantStyles[variant]

  if (loading) {
    return (
      <Card className={cn(styles.border, className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <div className="h-4 w-24 bg-routiq-cloud/20 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-8 w-16 bg-routiq-cloud/20 rounded animate-pulse mb-2" />
          <div className="h-4 w-20 bg-routiq-cloud/20 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(styles.border, className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-sm font-medium text-routiq-blackberry/70 flex items-center gap-2"
          )}>
            {Icon && <Icon className={cn("h-4 w-4", styles.icon)} />}
            {title}
          </CardTitle>
          {badge && (
            <Badge variant="outline" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={cn(
          "text-2xl font-bold mb-2",
          styles.value
        )}>
          {value}
        </div>
        
        {subtitle && (
          <div className="text-sm text-routiq-blackberry/70 mb-2">
            {subtitle}
          </div>
        )}
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm",
            getTrendColor(trend.direction)
          )}>
            {(() => {
              const TrendIcon = getTrendIcon(trend.direction)
              return <TrendIcon className="h-3 w-3" />
            })()}
            <span>
              {trend.value}
              {trend.period && ` ${trend.period}`}
            </span>
          </div>
        )}
        
        {comparison && (
          <div className="text-sm text-routiq-blackberry/70 mt-1">
            {comparison.label}: {comparison.value}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 