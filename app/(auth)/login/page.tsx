'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="/logo.png" alt="Cadence" width={220} height={66} className="object-contain logo-blend" priority />
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-text-primary mb-1">Sign in</h1>
            <p className="text-sm text-text-secondary">Track your network. Never miss a follow-up.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface-card border border-border-normal rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-ghost focus:outline-none focus:border-[#4F7AFF] focus:ring-1 focus:ring-[rgba(79,122,255,0.3)] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-card border border-border-normal rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-ghost focus:outline-none focus:border-[#4F7AFF] focus:ring-1 focus:ring-[rgba(79,122,255,0.3)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-[#F87171] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4F7AFF] hover:bg-[#6B91FF] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-text-dim text-center mt-5">
            No account?{' '}
            <Link href="/signup" className="text-[#4F7AFF] hover:text-[#7A9BFF] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
