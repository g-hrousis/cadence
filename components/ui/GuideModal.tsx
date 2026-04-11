'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ─── Step definitions ────────────────────────────────────────────────────────

interface Step {
  icon: React.ReactNode
  title: string
  body: string
  tip?: string
}

interface Guide {
  title: string
  accent: string          // tailwind text colour
  accentBg: string        // tailwind bg colour
  accentBorder: string    // tailwind border colour
  steps: Step[]
  cta: { label: string; href: string }
}

// ── SVG icons (self-contained, no external deps) ─────────────────────────────

const PersonPlusIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <circle cx="20" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M4 40c0-8.837 7.163-16 16-16h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M34 28v12M28 34h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const BriefcaseIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <rect x="6" y="18" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M16 18v-4a4 4 0 014-4h8a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M6 30h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const ChatIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <path d="M8 8h32a2 2 0 012 2v22a2 2 0 01-2 2H14l-8 6V10a2 2 0 012-2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 20h16M16 27h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

const CheckCircleIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M15 24l6 6 12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SidebarIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <rect x="4" y="8" width="40" height="32" rx="3" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M16 8v32" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M22 18h14M22 24h10M22 30h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="10" cy="18" r="2" fill="currentColor"/>
    <circle cx="10" cy="24" r="2" fill="currentColor"/>
    <circle cx="10" cy="30" r="2" fill="currentColor"/>
  </svg>
)

const FormIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="34" cy="36" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M32 36h4M34 34v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const PipelineIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <rect x="4" y="12" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="16" y="16" width="8" height="20" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="28" y="20" width="8" height="16" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="40" y="8" width="4" height="28" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 24h4M24 26h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const LinkedInIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <rect x="6" y="6" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M16 20v14M16 16v1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M24 34v-8a4 4 0 018 0v8M24 26v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TaskAutoIcon = (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    <path d="M20 8H10a2 2 0 00-2 2v28a2 2 0 002 2h28a2 2 0 002-2V28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M14 24l6 6 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 6l3 3-3 3M39 9H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Guide content ────────────────────────────────────────────────────────────

const GUIDES: Record<string, Guide> = {
  contact: {
    title: 'Add a Contact',
    accent: 'text-[#4F7AFF]',
    accentBg: 'bg-[rgba(79,122,255,0.12)]',
    accentBorder: 'border-[rgba(79,122,255,0.25)]',
    steps: [
      {
        icon: <span className="text-[#4F7AFF]">{SidebarIcon}</span>,
        title: 'Open Contacts',
        body: 'Click "Contacts" in the left sidebar. This is your full network list — everyone you\'re tracking.',
      },
      {
        icon: <span className="text-[#4F7AFF]">{FormIcon}</span>,
        title: 'Click + New Contact',
        body: 'Hit the blue "New Contact" button in the top right. Fill in their name, company, role, and email.',
        tip: 'You can always add more details later — just a name is enough to get started.',
      },
      {
        icon: <span className="text-[#4F7AFF]">{PersonPlusIcon}</span>,
        title: 'Set a follow-up cadence',
        body: 'Choose how often Cadence should remind you to follow up — every 7, 14, or 30 days. Cadence handles the rest.',
        tip: 'Recruiters and active leads = 7 days. Warm connections = 14–30 days.',
      },
      {
        icon: <span className="text-[#4F7AFF]">{CheckCircleIcon}</span>,
        title: 'You\'re tracking them',
        body: 'Cadence will now surface this contact in Today\'s Moves when it\'s time to reach out. No spreadsheet needed.',
      },
    ],
    cta: { label: 'Add your first contact →', href: '/contacts/new' },
  },

  opportunity: {
    title: 'Add a Job',
    accent: 'text-[#FBBF24]',
    accentBg: 'bg-[rgba(251,191,36,0.1)]',
    accentBorder: 'border-[rgba(251,191,36,0.2)]',
    steps: [
      {
        icon: <span className="text-[#FBBF24]">{SidebarIcon}</span>,
        title: 'Open Opportunities',
        body: 'Click "Opportunities" in the sidebar. This is your job pipeline — from first lead to offer.',
      },
      {
        icon: <span className="text-[#FBBF24]">{FormIcon}</span>,
        title: 'Click + New Opportunity',
        body: 'Hit the button and fill in the role title, type (job, referral, coffee chat, or interview), and starting status.',
        tip: 'Not sure of the status? Start with "Networking" — you can move it forward any time.',
      },
      {
        icon: <span className="text-[#FBBF24]">{PersonPlusIcon}</span>,
        title: 'Link your contacts',
        body: 'Attach people you know at the company. Cadence connects the dots between your network and your pipeline.',
      },
      {
        icon: <span className="text-[#FBBF24]">{PipelineIcon}</span>,
        title: 'Move it through the pipeline',
        body: 'Drag or update the status as you progress — Applied, Networking, Interviewing, Offer. Cadence flags anything going stale.',
      },
    ],
    cta: { label: 'Add a job →', href: '/opportunities/new' },
  },

  interaction: {
    title: 'Log an Interaction',
    accent: 'text-[#34D399]',
    accentBg: 'bg-[rgba(52,211,153,0.1)]',
    accentBorder: 'border-[rgba(52,211,153,0.2)]',
    steps: [
      {
        icon: <span className="text-[#34D399]">{SidebarIcon}</span>,
        title: 'Open a contact',
        body: 'Go to Contacts and click on someone you recently spoke with. Their profile page shows all past history.',
      },
      {
        icon: <span className="text-[#34D399]">{ChatIcon}</span>,
        title: 'Click "Log Interaction"',
        body: 'Find the Interactions section and click the button. Log it immediately or back-date it to when it actually happened.',
      },
      {
        icon: <span className="text-[#34D399]">{LinkedInIcon}</span>,
        title: 'Choose channel & outcome',
        body: 'Pick how you connected: LinkedIn, email, call, or in-person. Then mark the outcome — responded, no response, or needs follow-up.',
        tip: 'The channel × outcome combo tells Cadence exactly when and how to remind you next.',
      },
      {
        icon: <span className="text-[#34D399]">{TaskAutoIcon}</span>,
        title: 'Cadence auto-creates a task',
        body: 'Based on what you logged, Cadence automatically creates the right follow-up task and schedules it. Nothing falls through the cracks.',
      },
    ],
    cta: { label: 'Go to Contacts →', href: '/contacts' },
  },
}

// ─── Modal component ──────────────────────────────────────────────────────────

interface GuideModalProps {
  guideKey: keyof typeof GUIDES
  onClose: () => void
}

export function GuideModal({ guideKey, onClose }: GuideModalProps) {
  const [step, setStep] = useState(0)
  const guide = GUIDES[guideKey]
  const current = guide.steps[step]
  const isLast = step === guide.steps.length - 1

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Reset step when guide changes
  useEffect(() => { setStep(0) }, [guideKey])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-[#0D0D14] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-2xl">

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <span className={`text-xs font-bold uppercase tracking-widest ${guide.accent}`}>
            {guide.title}
          </span>
          <button
            onClick={onClose}
            className="text-[#484860] hover:text-[#8888A8] transition-colors p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)]"
            aria-label="Close guide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pt-5 px-5">
          {guide.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? `w-6 ${guide.accentBg.replace('bg-', 'bg-').replace('/0.1', '/1').replace('/0.12', '/1')} ${guide.accent.replace('text-', 'bg-')}`
                  : i < step
                  ? `w-1.5 ${guide.accent.replace('text-', 'bg-')} opacity-40`
                  : 'w-1.5 bg-[#2A2A3A]'
              }`}
              style={i === step ? {} : {}}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className={`mx-5 mt-5 rounded-xl ${guide.accentBg} border ${guide.accentBorder} flex items-center justify-center py-8`}>
          {current.icon}
        </div>

        {/* Content */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#484860]">Step {step + 1} of {guide.steps.length}</span>
          </div>
          <h3 className="text-base font-bold text-[#EDEDF2] mb-2">{current.title}</h3>
          <p className="text-sm text-[#8888A8] leading-relaxed">{current.body}</p>

          {current.tip && (
            <div className={`mt-3 ${guide.accentBg} border ${guide.accentBorder} rounded-lg px-3 py-2`}>
              <p className={`text-xs font-semibold ${guide.accent} mb-0.5`}>Pro tip</p>
              <p className="text-xs text-[#8888A8]">{current.tip}</p>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-5 py-4 mt-2 border-t border-[rgba(255,255,255,0.05)]">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-xs font-semibold text-[#585870] hover:text-[#8888A8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)] disabled:hover:bg-transparent"
          >
            ← Back
          </button>

          {isLast ? (
            <Link
              href={guide.cta.href}
              onClick={onClose}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${guide.accentBg} border ${guide.accentBorder} ${guide.accent} hover:opacity-80`}
            >
              {guide.cta.label}
            </Link>
          ) : (
            <button
              onClick={() => setStep(s => Math.min(guide.steps.length - 1, s + 1))}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${guide.accentBg} border ${guide.accentBorder} ${guide.accent} hover:opacity-80`}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Trigger button (place anywhere) ─────────────────────────────────────────

interface GuideButtonProps {
  guideKey: keyof typeof GUIDES
}

export function GuideButton({ guideKey }: GuideButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.15)] text-[#585870] hover:text-[#8888A8] hover:border-[rgba(255,255,255,0.25)] transition-colors flex items-center justify-center"
        aria-label="How does this work?"
      >
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
        </svg>
      </button>

      {open && <GuideModal guideKey={guideKey} onClose={() => setOpen(false)} />}
    </>
  )
}
