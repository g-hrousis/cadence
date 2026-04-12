'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Briefcase, CheckSquare } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',     label: 'Dashboard', icon: LayoutDashboard },
  { href: '/contacts',      label: 'Contacts',  icon: Users },
  { href: '/opportunities', label: 'Jobs',       icon: Briefcase },
  { href: '/tasks',         label: 'Tasks',      icon: CheckSquare },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-sidebar border-t border-border-subtle"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 pt-1 pb-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors min-w-[60px]',
                isActive
                  ? 'text-[var(--c-accent)]'
                  : 'text-text-dim hover:text-text-secondary'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
