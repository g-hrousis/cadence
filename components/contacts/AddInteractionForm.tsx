'use client'

import { useTransition, useState } from 'react'
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
  'w-full bg-[#0D0D14] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-[#EDEDF2] focus:outline-none focus:border-[#4F7AFF] transition-colors'

const labelClass = 'block text-xs font-medium text-[#8888A8] mb-1.5'

export function AddInteractionForm({ contactId }: { contactId: string }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  // Live state for the follow-up preview
  const [channel, setChannel] = useState<Channel>('linkedin')
  const [outcome, setOutcome] = useState<Outcome>('responded')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-[#4F7AFF] hover:text-[#7A9BFF] transition-colors"
      >
        + Log interaction
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 space-y-3">

      {/* Channel + Outcome row */}
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

      {/* Live follow-up preview */}
      <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs leading-snug ${
        config.createTask
          ? 'bg-[rgba(79,122,255,0.06)] border border-[rgba(79,122,255,0.15)] text-[#8888A8]'
          : 'bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.12)] text-[#8888A8]'
      }`}>
        <span className="shrink-0 mt-px">
          {config.createTask ? '→' : '✓'}
        </span>
        <span>
          {config.createTask
            ? <><span className="text-[#EDEDF2] font-medium">{config.description.split('—')[0].trim()}</span>{config.description.includes('—') ? ` — ${config.description.split('—')[1].trim()}` : ''} Task due <span className="text-[#4F7AFF] font-medium">{followUpDate}</span>.</>
            : <><span className="text-[#22C55E] font-medium">{config.description}</span></>
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

      {/* Actions */}
      <div className="flex gap-2 pt-0.5">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#4F7AFF] hover:bg-[#3D67E8] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Log interaction'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[#585870] hover:text-[#8888A8] px-3 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
