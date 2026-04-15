import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { SignOutButton } from '@/components/ui/SignOutButton'
import { NavLink } from '@/components/ui/NavLink'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { MobileNav } from '@/components/ui/MobileNav'
import Image from 'next/image'
import { startOfDay } from 'date-fns'

// Deferred async component — fetches alert count independently so it doesn't
// block the layout's initial render and doesn't inflate TTFB.
async function AlertBadgeSidebar() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .lte('due_date', startOfDay(new Date()).toISOString())
    .or('snoozed_until.is.null,snoozed_until.lt.' + new Date().toISOString())
  return <NotificationBell count={count ?? 0} />
}

async function AlertBadgeMobile() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .lte('due_date', startOfDay(new Date()).toISOString())
    .or('snoozed_until.is.null,snoozed_until.lt.' + new Date().toISOString())
  return <MobileNav alertCount={count ?? 0} />
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Only block on profile — needed for onboarding redirect and username display
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('id', user.id)
    .single()

  if (!profile?.first_name) redirect('/onboarding')

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

        {/* Nav — alert badge streams in after main content */}
        <nav className="flex flex-col gap-0.5 flex-1">
          <Suspense fallback={<NotificationBell count={0} />}>
            <AlertBadgeSidebar />
          </Suspense>
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

      {/* Mobile bottom navigation — streams in with alert count */}
      <Suspense fallback={<MobileNav alertCount={0} />}>
        <AlertBadgeMobile />
      </Suspense>
    </div>
  )
}
