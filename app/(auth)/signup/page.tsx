'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignupPage() {
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090E] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="/logo.png" alt="Cadence" width={220} height={66} className="object-contain mix-blend-screen" priority />
        </div>

        {/* Card */}
        <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-[#EDEDF2] mb-1">Create your account</h1>
            <p className="text-sm text-[#8888A8]">Start tracking your network today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8888A8] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#111118] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-[#EDEDF2] placeholder-[#484860] focus:outline-none focus:border-[#4F7AFF] focus:ring-1 focus:ring-[rgba(79,122,255,0.3)] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8888A8] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#111118] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-[#EDEDF2] placeholder-[#484860] focus:outline-none focus:border-[#4F7AFF] focus:ring-1 focus:ring-[rgba(79,122,255,0.3)] transition-colors"
                placeholder="Min 6 characters"
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-[#585870] text-center mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#4F7AFF] hover:text-[#7A9BFF] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
