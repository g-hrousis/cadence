'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    accent: '#4F7AFF',
    bg: 'rgba(79,122,255,0.12)',
    border: 'rgba(79,122,255,0.2)',
    icon: (
      <svg className="w-8 h-8 text-[#4F7AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Welcome to Cadence',
    body: 'Your job search just got a system. Cadence tracks every relationship, every opportunity, and every follow-up — so nothing slips through the cracks.',
    cta: 'Get started',
  },
  {
    accent: '#A78BFA',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.2)',
    icon: (
      <svg className="w-8 h-8 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Build your network',
    body: 'Add recruiters, alumni, referrals, and hiring managers as contacts. Cadence sets a follow-up cadence for each one and alerts you when a relationship starts going cold.',
    cta: 'Next',
  },
  {
    accent: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    icon: (
      <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Log every touchpoint',
    body: 'After every call, email, LinkedIn message, or coffee chat — log it. Cadence uses your interaction history to auto-schedule follow-ups so you always reach out at the right time.',
    cta: 'Next',
  },
  {
    accent: '#FBBF24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.2)',
    icon: (
      <svg className="w-8 h-8 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Track your pipeline',
    body: 'Every application, referral, and interview goes in the pipeline. Cadence flags anything that\'s gone stale — so you always know what needs a nudge.',
    cta: 'Next',
  },
  {
    accent: '#4F7AFF',
    bg: 'rgba(79,122,255,0.12)',
    border: 'rgba(79,122,255,0.2)',
    icon: (
      <svg className="w-8 h-8 text-[#4F7AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Today's Moves",
    body: "Every day, Cadence builds your action list — overdue follow-ups, cold contacts, stale deals — ranked by urgency. Just work through the list and keep your search moving.",
    cta: 'Go to my dashboard',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  function next() {
    if (isLast) {
      router.push('/dashboard')
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090E] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/logo.png"
          alt="Cadence"
          width={160}
          height={48}
          className="object-contain mix-blend-screen"
          priority
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md">

        {/* Progress bar */}
        <div className="h-0.5 bg-[#1C1C2E] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#4F7AFF] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
            style={{ background: current.bg, border: `1px solid ${current.border}` }}
          >
            {current.icon}
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-xs font-semibold text-[#585870] uppercase tracking-widest mb-3">
          Step {step + 1} of {STEPS.length}
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#EDEDF2] text-center mb-3 tracking-tight">
          {current.title}
        </h1>

        {/* Body */}
        <p className="text-sm text-[#8888A8] text-center leading-relaxed mb-8 max-w-sm mx-auto">
          {current.body}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="transition-all duration-300"
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '20px' : '6px',
                  height: '6px',
                  background: i === step ? '#4F7AFF' : i < step ? '#2A3A7A' : '#1C1C2E',
                }}
              />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full bg-[#4F7AFF] hover:bg-[#6B91FF] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
        >
          {current.cta} {!isLast && '→'}
        </button>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-xs text-[#484860] hover:text-[#8888A8] py-3 transition-colors mt-1"
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  )
}
