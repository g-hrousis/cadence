'use client'

import { useTransition, useState } from 'react'
import type { Contact, Opportunity } from '@/types'
import { createTask } from '@/app/(protected)/tasks/actions'

interface TaskFormProps {
  contacts: Contact[]
  opportunities: Opportunity[]
  compact?: boolean
}

export function TaskForm({ contacts, opportunities, compact = false }: TaskFormProps) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(!compact)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createTask(formData)
      ;(e.target as HTMLFormElement).reset()
      if (compact) setOpen(false)
    })
  }

  if (compact && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-[var(--c-accent)] hover:opacity-80 font-medium"
      >
        + Add task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Task *</label>
        <input
          name="title"
          required
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          placeholder="Follow up with Jane about referral"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">Due date</label>
        <input
          name="due_date"
          type="date"
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contacts.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Contact (optional)</label>
            <select
              name="linked_contact_id"
              className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
            >
              <option value="">None</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {opportunities.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Opportunity (optional)</label>
            <select
              name="linked_opportunity_id"
              className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
            >
              <option value="">None</option>
              {opportunities.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Adding…' : 'Add task'}
        </button>
        {compact && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm text-text-muted hover:text-text-secondary px-3 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
