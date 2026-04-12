'use client'

import { useState, useTransition } from 'react'
import { addInteraction } from '@/app/(protected)/contacts/actions'
import { getFollowUpConfig } from '@/lib/utils/followup'
import type { Channel, Outcome } from '@/lib/utils/followup'
import { addDays, format } from 'date-fns'

const CHANNELS: { value: Channel; label: string }[] = [
  { value: 'linkedin',  label: 'LinkedIn' },
  { value: 'email',     label: 'Email' },
  { value: 'call',      label: 'Call' },
  { value: 'in_person', label: 'In Person' },
]

const OUTCOMES: { value: Outcome; label: string }[] = [
  { value: 'responded',        label: 'Responded' },
  { value: 'no_response',      label: 'No Response' },
  { value: 'follow_up_needed', label: 'Follow-up Needed' },
]

const inputClass =
  'w-full bg-surface-sidebar border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-[var(--c-accent)] transition-colors'
const labelClass = 'block text-xs font-medium text-text-secondary mb-1.5'

interface ContactOption {
  id: string
  name: string
  company: string | null
  isLinked: boolean
}

export function OpportunityInteractionForm({
  linkedContacts,
  allContacts,
}: {
  linkedContacts: { id: string; name: string; company: string | null }[]
  allContacts: { id: string; name: string; company: string | null }[]
}) {
  // Linked contacts first, then others
  const contactOptions: ContactOption[] = [
    ...linkedContacts.map(c => ({ ...c, isLinked: true })),
    ...allContacts
      .filter(c => !linkedContacts.some(lc => lc.id === c.id))
      .map(c => ({ ...c, isLinked: false })),
  ]

  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [contactId, setContactId] = useState(contactOptions[0]?.id ?? '')
  const [channel, setChannel] = useState<Channel>('linkedin')
  const [outcome, setOutcome] = useState<Outcome>('responded')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!contactId) return
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await addInteraction(contactId, formData)
      setOpen(false)
      setChannel('linkedin')
      setOutcome('responded')
      setDate(new Date().toISOString().split('T')[0])
    })
  }

  const config = getFollowUpConfig(channel, outcome)
  const followUpDate = config.createTask
    ? format(addDays(new Date(date + 'T12:00:00'), config.days), 'MMM d')
    : null

  if (contactOptions.length === 0) return null

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-[var(--c-accent)] hover:opacity-75 transition-opacity"
      >
        + Log interaction
      </button>
    )
  }

  const hasGroups = linkedContacts.length > 0 && contactOptions.some(c => !c.isLinked)

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-surface-card border border-border-subtle rounded-xl p-4 space-y-3">

      {/* Contact selector — only when multiple options */}
      {contactOptions.length > 1 && (
        <div>
          <label className={labelClass}>Contact</label>
          <select
            value={contactId}
            onChange={e => setContactId(e.target.value)}
            className={inputClass}
          >
            {hasGroups ? (
              <>
                <optgroup label="Linked contacts">
                  {contactOptions.filter(c => c.isLinked).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.company ? ` — ${c.company}` : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other contacts">
                  {contactOptions.filter(c => !c.isLinked).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.company ? ` — ${c.company}` : ''}
                    </option>
                  ))}
                </optgroup>
              </>
            ) : (
              contactOptions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.company ? ` — ${c.company}` : ''}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {/* Channel + Outcome */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Channel</label>
          <select
            name="channel"
            required
            value={channel}
            onChange={e => setChannel(e.target.value as Channel)}
            className={inputClass}
          >
            {CHANNELS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Outcome</label>
          <select
            name="outcome"
            required
            value={outcome}
            onChange={e => setOutcome(e.target.value as Outcome)}
            className={inputClass}
          >
            {OUTCOMES.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Follow-up preview */}
      <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs leading-snug ${
        config.createTask
          ? 'bg-[rgba(200,240,96,0.06)] border border-[rgba(200,240,96,0.15)] text-text-secondary'
          : 'bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.12)] text-text-secondary'
      }`}>
        <span className="shrink-0 mt-px">{config.createTask ? '→' : '✓'}</span>
        <span>
          {config.createTask
            ? <><span className="text-text-primary font-medium">{config.description.split('—')[0].trim()}</span>{config.description.includes('—') ? ` — ${config.description.split('—')[1].trim()}` : ''} Task due <span className="text-[var(--c-accent)] font-medium">{followUpDate}</span>.</>
            : <span className="text-[#22C55E] font-medium">{config.description}</span>
          }
        </span>
      </div>

      {/* Date */}
      <div>
        <label className={labelClass}>Date</label>
        <input
          name="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          name="notes"
          rows={2}
          className={`${inputClass} resize-none`}
          placeholder="What happened? Any context worth keeping…"
        />
      </div>

      <div className="flex gap-2 pt-0.5">
        <button
          type="submit"
          disabled={isPending || !contactId}
          className="bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Log interaction'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-text-dim hover:text-text-secondary px-3 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
