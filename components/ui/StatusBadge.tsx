import { cn } from '@/lib/utils'

const variants = {
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  green:  'bg-green-50 text-green-700 border border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  red:    'bg-red-50 text-red-600 border border-red-200',
  gray:   'bg-gray-100 text-gray-600 border border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
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
