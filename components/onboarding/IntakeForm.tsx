'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveProfile } from '@/app/onboarding/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
    >
      {pending ? 'Saving\u2026' : "Let\u2019s go \u2192"}
    </button>
  )
}

interface IntakeFormProps {
  firstName?: string
  lastName?: string
  targetedJob?: string
  industry?: string
}

export function IntakeForm({ firstName, lastName, targetedJob, industry }: IntakeFormProps) {
  const [state, action] = useActionState(saveProfile, null)

  return (
    <form action={action} className="space-y-4" suppressHydrationWarning>
      {state?.error && (
        <div className="bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-xl px-3.5 py-2.5">
          <p className="text-xs text-[#F87171]">{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="c-label block mb-1.5">First name</label>
          <input
            name="first_name"
            defaultValue={firstName ?? ''}
            required
            autoFocus
            placeholder="Alex"
            suppressHydrationWarning
            className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-[var(--c-accent)] transition-colors"
          />
        </div>
        <div>
          <label className="c-label block mb-1.5">Last name</label>
          <input
            name="last_name"
            defaultValue={lastName ?? ''}
            placeholder="Rivera"
            suppressHydrationWarning
            className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-[var(--c-accent)] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="c-label block mb-1.5">Target role</label>
        <input
          name="targeted_job"
          defaultValue={targetedJob ?? ''}
          placeholder="Product Manager, Software Engineer, Investment Analyst\u2026"
          suppressHydrationWarning
          className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-[var(--c-accent)] transition-colors"
        />
        <p className="text-[10px] text-text-ghost mt-1.5">We'll use this to personalize your pipeline and surface relevant keywords.</p>
      </div>

      <div>
        <label className="c-label block mb-1.5">Industry</label>
        <input
          name="industry"
          defaultValue={industry ?? ''}
          placeholder="Tech, Finance, Healthcare, Consulting\u2026"
          suppressHydrationWarning
          className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-[var(--c-accent)] transition-colors"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
