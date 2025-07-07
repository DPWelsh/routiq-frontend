import { cn } from "@/lib/utils"
import { Loader2, BarChart3, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LoadingPlaceholderProps {
  variant?: 'card' | 'metric' | 'chart' | 'table' | 'full'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  theme?: 'default' | 'clinic' | 'patient' | 'automation'
  title?: string
  description?: string
}

/**
 * Reusable Loading Placeholder Component
 * 
 * Provides consistent loading states across all dashboard components.
 * Supports different variants and themes for different contexts.
 */
export function LoadingPlaceholder({
  variant = 'card',
  className,
  size = 'md',
  theme = 'default',
  title,
  description
}: LoadingPlaceholderProps) {
  
  const themeStyles = {
    default: {
      background: 'bg-routiq-cloud/5',
      border: 'border-routiq-cloud/20',
      skeleton: 'bg-routiq-cloud/20'
    },
    clinic: {
      background: 'bg-routiq-cloud/5',
      border: 'border-routiq-cloud/20',
      skeleton: 'bg-routiq-cloud/20'
    },
    patient: {
      background: 'bg-routiq-energy/5',
      border: 'border-routiq-energy/20',
      skeleton: 'bg-routiq-energy/20'
    },
    automation: {
      background: 'bg-routiq-prompt/5',
      border: 'border-routiq-prompt/20',
      skeleton: 'bg-routiq-prompt/20'
    }
  }

  const sizeStyles = {
    sm: {
      spinner: 'h-4 w-4',
      text: 'text-sm',
      padding: 'p-3'
    },
    md: {
      spinner: 'h-6 w-6',
      text: 'text-base',
      padding: 'p-4'
    },
    lg: {
      spinner: 'h-8 w-8',
      text: 'text-lg',
      padding: 'p-6'
    }
  }

  const styles = themeStyles[theme]
  const sizes = sizeStyles[size]

  // Skeleton bar component
  const SkeletonBar = ({ width = 'w-full', height = 'h-4' }: { width?: string, height?: string }) => (
    <div className={cn(
      'rounded animate-pulse',
      styles.skeleton,
      width,
      height
    )} />
  )

  // Full page loading
  if (variant === 'full') {
    return (
      <div className={cn(
        'flex items-center justify-center min-h-[400px]',
        styles.background,
        className
      )}>
        <div className="text-center">
          <Loader2 className={cn('mx-auto mb-4 animate-spin text-routiq-blackberry/40', sizes.spinner)} />
          <p className={cn('text-routiq-blackberry/70', sizes.text)}>
            {title || 'Loading dashboard...'}
          </p>
          {description && (
            <p className="text-sm text-routiq-blackberry/50 mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Metric loading
  if (variant === 'metric') {
    return (
      <Card className={cn(styles.border, className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <SkeletonBar width="w-4" height="h-4" />
            <SkeletonBar width="w-24" height="h-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <SkeletonBar width="w-16" height="h-8" />
          <div className="mt-2">
            <SkeletonBar width="w-20" height="h-4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Chart loading
  if (variant === 'chart') {
    return (
      <div className={cn(
        'rounded-lg border flex items-center justify-center h-48',
        styles.background,
        styles.border,
        className
      )}>
        <div className="text-center">
          <BarChart3 className={cn('mx-auto mb-2 animate-pulse text-routiq-blackberry/40', sizes.spinner)} />
          <p className={cn('text-routiq-blackberry/70', sizes.text)}>
            {title || 'Loading chart...'}
          </p>
        </div>
      </div>
    )
  }

  // Table loading
  if (variant === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Table header */}
        <div className="flex gap-4">
          <SkeletonBar width="w-32" height="h-4" />
          <SkeletonBar width="w-24" height="h-4" />
          <SkeletonBar width="w-20" height="h-4" />
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <SkeletonBar width="w-32" height="h-4" />
            <SkeletonBar width="w-24" height="h-4" />
            <SkeletonBar width="w-20" height="h-4" />
          </div>
        ))}
      </div>
    )
  }

  // Card loading (default)
  return (
    <Card className={cn(styles.border, className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonBar width="w-5" height="h-5" />
            <SkeletonBar width="w-32" height="h-5" />
          </div>
          <SkeletonBar width="w-16" height="h-4" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <SkeletonBar width="w-full" height="h-6" />
          <SkeletonBar width="w-3/4" height="h-4" />
          <SkeletonBar width="w-1/2" height="h-4" />
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined loading components for common use cases
export const MetricLoadingPlaceholder = ({ className, theme }: { className?: string, theme?: 'default' | 'clinic' | 'patient' | 'automation' }) => (
  <LoadingPlaceholder variant="metric" className={className} theme={theme} />
)

export const ChartLoadingPlaceholder = ({ className, theme, title }: { className?: string, theme?: 'default' | 'clinic' | 'patient' | 'automation', title?: string }) => (
  <LoadingPlaceholder variant="chart" className={className} theme={theme} title={title} />
)

export const TableLoadingPlaceholder = ({ className }: { className?: string }) => (
  <LoadingPlaceholder variant="table" className={className} />
)

export const FullPageLoadingPlaceholder = ({ title, description }: { title?: string, description?: string }) => (
  <LoadingPlaceholder variant="full" title={title} description={description} />
) 