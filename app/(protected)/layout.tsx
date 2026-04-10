import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/ui/SignOutButton'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col px-4 py-6 shrink-0">
        <div className="mb-8">
          <span className="text-lg font-bold text-blue-600 tracking-tight">Cadence</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/contacts">Contacts</NavLink>
          <NavLink href="/opportunities">Opportunities</NavLink>
          <NavLink href="/tasks">Tasks</NavLink>
        </nav>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 truncate mb-2">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  )
}
