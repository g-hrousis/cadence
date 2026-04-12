'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base px-4">
      <div className="w-full max-w-sm">

        <div className="flex justify-center mb-10">
          <Image src="/logo.png" alt="Cadence" width={220} height={66} className="object-contain logo-blend" priority />
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-2xl p-6">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-text-primary mb-1">Set new password</h1>
            <p className="text-sm text-text-secondary">Choose a strong password for your account.</p>
          </div>

          {done ? (
            <div className="text-sm text-[#22C55E] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-lg px-3 py-3 text-center">
              Password updated. Redirecting to dashboard…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-surface-card border border-border-normal rounded-lg px-3 py-2.5 pr-10 text-sm text-text-primary placeholder-text-ghost focus:outline-none focus:border-[var(--c-accent)] focus:ring-1 focus:ring-[rgba(200,240,96,0.2)] transition-colors"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Confirm password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full bg-surface-card border border-border-normal rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-ghost focus:outline-none focus:border-[var(--c-accent)] focus:ring-1 focus:ring-[rgba(200,240,96,0.2)] transition-colors"
                  placeholder="Repeat your password"
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
                {loading ? 'Updating…' : 'Update password'}
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
