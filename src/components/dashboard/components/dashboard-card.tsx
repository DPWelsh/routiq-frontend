import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface DashboardCardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  headerAction?: ReactNode
  variant?: 'default' | 'clinic' | 'patient' | 'automation'
}

/**
 * Reusable Dashboard Card Component
 * 
 * Provides consistent styling and theming across all dashboard sections.
 * Supports different variants for different dashboard areas.
 */
export function DashboardCard({
  title,
  subtitle,
  icon,
  children,
  className,
  headerAction,
  variant = 'default'
}: DashboardCardProps) {
  const variantStyles = {
    default: 'border-routiq-cloud/20',
    clinic: 'border-routiq-cloud/20',
    patient: 'border-routiq-energy/20',
    automation: 'border-routiq-prompt/20'
  }

  const titleStyles = {
    default: 'text-routiq-core',
    clinic: 'text-routiq-core',
    patient: 'text-routiq-core',
    automation: 'text-routiq-core'
  }

  return (
    <Card className={cn(
      'shadow-sm hover:shadow-md transition-shadow duration-200',
      variantStyles[variant],
      className
    )}>
      {(title || subtitle || icon || headerAction) && (
        <CardHeader className={cn(
          'pb-3',
          !title && !subtitle && 'pb-2'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <div>
                {title && (
                  <CardTitle className={cn(
                    'text-lg font-semibold',
                    titleStyles[variant]
                  )}>
                    {title}
                  </CardTitle>
                )}
                {subtitle && (
                  <p className="text-sm text-routiq-blackberry/70 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {headerAction && (
              <div className="flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={cn(
        'pt-0',
        !title && !subtitle && !icon && !headerAction && 'pt-6'
      )}>
        {children}
      </CardContent>
    </Card>
  )
} 