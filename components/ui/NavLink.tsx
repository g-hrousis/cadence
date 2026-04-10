'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function NavLink({ href, children, icon }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150',
        isActive
          ? 'bg-[#0F1940] text-[#4F7AFF] font-medium'
          : 'text-[#8888A8] hover:text-[#9090B0] hover:bg-[#13131C] font-normal'
      )}
    >
      {icon && <span className="shrink-0 opacity-70">{icon}</span>}
      {children}
    </Link>
  )
}
