import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/ui/SignOutButton'
import { NavLink } from '@/components/ui/NavLink'
import Image from 'next/image'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Redirect to onboarding if profile hasn't been set up
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('id', user.id)
    .single()

  if (!profile?.first_name) redirect('/onboarding')

  return (
    <div className="flex min-h-screen bg-surface-base">
      {/* Sidebar */}
      <aside className="w-52 bg-surface-sidebar border-r border-border-subtle flex flex-col px-3 py-5 shrink-0 fixed h-full">

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
          <NavLink href="/dashboard">Dashboard</NavLink>
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
      <main className="flex-1 ml-52 overflow-y-auto min-h-screen p-8">
        {children}
      </main>
    </div>
  )
}
