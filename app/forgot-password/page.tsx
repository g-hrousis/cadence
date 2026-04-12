'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
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
            <h1 className="text-lg font-bold text-text-primary mb-1">Reset your password</h1>
            <p className="text-sm text-text-secondary">Enter your email and we&apos;ll send you a reset link.</p>
          </div>

          {sent ? (
            <div className="text-sm text-[#22C55E] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-lg px-3 py-3 text-center">
              Check your email for a reset link.
            </div>
          ) : (
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
                  className="w-full bg-surface-card border border-border-normal rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-ghost focus:outline-none focus:border-[var(--c-accent)] focus:ring-1 focus:ring-[rgba(200,240,96,0.2)] transition-colors"
                  placeholder="you@example.com"
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
                className="w-full bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="text-sm text-text-dim text-center mt-5">
            <Link href="/login" className="text-[var(--c-accent)] hover:opacity-80 transition-colors">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
