import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { BarChart3, AlertCircle, Loader2, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChartContainerProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  height?: string | number
  className?: string
  placeholder?: {
    icon?: LucideIcon
    title: string
    subtitle?: string
    phase?: string
  }
  variant?: 'default' | 'clinic' | 'patient' | 'automation'
}

/**
 * Reusable Chart Container Component
 * 
 * Provides consistent styling and state management for charts across dashboard.
 * Handles loading states, error states, and placeholder content.
 */
export function ChartContainer({
  children,
  title,
  subtitle,
  loading = false,
  error = null,
  onRetry,
  height = '12rem',
  className,
  placeholder,
  variant = 'default'
}: ChartContainerProps) {
  const variantStyles = {
    default: {
      background: 'bg-routiq-cloud/5',
      border: 'border-routiq-cloud/20'
    },
    clinic: {
      background: 'bg-routiq-cloud/5',
      border: 'border-routiq-cloud/20'
    },
    patient: {
      background: 'bg-routiq-energy/5',
      border: 'border-routiq-energy/20'
    },
    automation: {
      background: 'bg-routiq-prompt/5',
      border: 'border-routiq-prompt/20'
    }
  }

  const styles = variantStyles[variant]

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height
  }

  // Loading state
  if (loading) {
    return (
      <div className={cn(
        'rounded-lg border flex items-center justify-center',
        styles.background,
        styles.border,
        className
      )} style={containerStyle}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-routiq-blackberry/40 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-routiq-blackberry/70">Loading chart...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn(
        'rounded-lg border flex items-center justify-center',
        'bg-red-50 border-red-200',
        className
      )} style={containerStyle}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-700 mb-2">{error}</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Placeholder state
  if (placeholder && !children) {
    const PlaceholderIcon = placeholder.icon || BarChart3
    
    return (
      <div className={cn(
        'rounded-lg border flex items-center justify-center',
        styles.background,
        styles.border,
        className
      )} style={containerStyle}>
        <div className="text-center">
          <PlaceholderIcon className="h-12 w-12 text-routiq-blackberry/40 mx-auto mb-2" />
          <p className="text-routiq-blackberry/70 font-medium">
            {placeholder.title}
          </p>
          {placeholder.subtitle && (
            <p className="text-sm text-routiq-blackberry/50 mt-1">
              {placeholder.subtitle}
            </p>
          )}
          {placeholder.phase && (
            <p className="text-xs text-routiq-blackberry/50 mt-2">
              {placeholder.phase}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Chart content
  return (
    <div className={cn(
      'rounded-lg border overflow-hidden',
      styles.border,
      className
    )} style={containerStyle}>
      {(title || subtitle) && (
        <div className="p-4 pb-2">
          {title && (
            <h4 className="font-medium text-routiq-core">{title}</h4>
          )}
          {subtitle && (
            <p className="text-sm text-routiq-blackberry/70 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="h-full">
        {children}
      </div>
    </div>
  )
} 