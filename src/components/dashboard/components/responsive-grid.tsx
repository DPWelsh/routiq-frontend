import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'cards' | 'metrics' | 'content'
}

/**
 * Responsive Grid Layout Component
 * 
 * Provides consistent grid layouts across all dashboard sections.
 * Supports different responsive breakpoints and gap sizes.
 */
export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, md: 2, lg: 4 },
  gap = 'md',
  variant = 'cards'
}: ResponsiveGridProps) {
  // Gap size mapping
  const gapSizes = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  // Column class mapping
  const getColClass = (breakpoint: string, colCount: number) => {
    if (breakpoint === 'default') {
      return `grid-cols-${colCount}`
    }
    return `${breakpoint}:grid-cols-${colCount}`
  }

  // Build responsive grid classes
  const gridClasses = Object.entries(cols).map(([breakpoint, colCount]) => {
    return getColClass(breakpoint, colCount)
  }).join(' ')

  // Variant-specific defaults
  const variantDefaults = {
    cards: {
      gap: 'gap-4',
      baseClass: 'grid'
    },
    metrics: {
      gap: 'gap-4',
      baseClass: 'grid'
    },
    content: {
      gap: 'gap-6',
      baseClass: 'grid'
    }
  }

  const variantConfig = variantDefaults[variant]

  return (
    <div className={cn(
      variantConfig.baseClass,
      gridClasses,
      gapSizes[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Predefined grid configurations for common use cases
export const MetricsGrid = ({ children, className }: { children: ReactNode, className?: string }) => (
  <ResponsiveGrid 
    cols={{ default: 1, md: 2, lg: 4 }}
    gap="md"
    variant="metrics"
    className={className}
  >
    {children}
  </ResponsiveGrid>
)

export const CardsGrid = ({ children, className }: { children: ReactNode, className?: string }) => (
  <ResponsiveGrid 
    cols={{ default: 1, md: 2 }}
    gap="md"
    variant="cards"
    className={className}
  >
    {children}
  </ResponsiveGrid>
)

export const ContentGrid = ({ children, className }: { children: ReactNode, className?: string }) => (
  <ResponsiveGrid 
    cols={{ default: 1, lg: 2 }}
    gap="lg"
    variant="content"
    className={className}
  >
    {children}
  </ResponsiveGrid>
) 