'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NotificationBell({ count }: { count: number }) {
  const pathname = usePathname()
  const isActive = pathname === '/dashboard'

  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150',
        isActive
          ? 'bg-accent-blue-muted text-[var(--c-accent)] font-medium'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover font-normal'
      )}
    >
      <span>Dashboard</span>
      {count > 0 && (
        <span className="bg-[#F87171] text-white text-[10px] font-bold px-1.5 py-px rounded-full min-w-[18px] text-center leading-tight">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
