import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/ui/SignOutButton'
import { NavLink } from '@/components/ui/NavLink'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { MobileNav } from '@/components/ui/MobileNav'
import Image from 'next/image'
import { startOfDay } from 'date-fns'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Redirect to onboarding if profile hasn't been set up
  const [{ data: profile }, { count: alertCount }] = await Promise.all([
    supabase.from('profiles').select('id, first_name').eq('id', user.id).single(),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lte('due_date', startOfDay(new Date()).toISOString())
      .or('snoozed_until.is.null,snoozed_until.lt.' + new Date().toISOString()),
  ])

  if (!profile?.first_name) redirect('/onboarding')

  const alerts = alertCount ?? 0

  return (
    <div className="flex min-h-screen bg-surface-base">
      {/* Sidebar — hidden on mobile, fixed on desktop */}
      <aside className="hidden md:flex w-52 bg-surface-sidebar border-r border-border-subtle flex-col px-3 py-5 shrink-0 fixed h-full">

        {/* Logo + wordmark */}
        <div className="mb-7 px-2 flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Cadence"
            width={32}
            height={32}
            className="object-contain logo-blend shrink-0"
            priority
          />
          <span className="text-base font-bold tracking-tight text-text-primary">Cadence</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          <NotificationBell count={alerts} />
          <NavLink href="/contacts">Contacts</NavLink>
          <NavLink href="/opportunities">Opportunities</NavLink>
          <NavLink href="/tasks">Tasks</NavLink>
        </nav>

        {/* Footer */}
        <div className="border-t border-border-subtle pt-3 px-3 space-y-1.5">
          <p className="text-xs text-text-dim truncate">{profile.first_name}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-52 overflow-y-auto min-h-screen p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav alertCount={alerts} />
    </div>
  )
}
