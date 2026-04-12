import { cn } from '@/lib/utils'

const variants = {
  blue:   'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-[rgba(200,240,96,0.1)] dark:text-[var(--c-accent)] dark:border-[rgba(200,240,96,0.2)]',
  green:  'bg-green-50 text-green-700 border border-green-200 dark:bg-[rgba(34,197,94,0.1)] dark:text-[#22C55E] dark:border-[rgba(34,197,94,0.2)]',
  yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-[rgba(251,191,36,0.1)] dark:text-[#FBBF24] dark:border-[rgba(251,191,36,0.2)]',
  red:    'bg-red-50 text-red-600 border border-red-200 dark:bg-[rgba(248,113,113,0.1)] dark:text-[#F87171] dark:border-[rgba(248,113,113,0.2)]',
  gray:   'bg-surface-elevated text-text-secondary border border-border-normal',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-[rgba(167,139,250,0.1)] dark:text-[#A78BFA] dark:border-[rgba(167,139,250,0.2)]',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
  emerald:'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

export type StatusBadgeVariant = keyof typeof variants

interface StatusBadgeProps {
  children: React.ReactNode
  variant?: StatusBadgeVariant
  className?: string
}

export function StatusBadge({ children, variant = 'gray', className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
