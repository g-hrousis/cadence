'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Contact, Opportunity } from '@/types'
import { createOpportunity, updateOpportunity } from '@/app/(protected)/opportunities/actions'

interface OpportunityFormProps {
  opportunity?: Opportunity
  contacts: Contact[]
  linkedContactIds?: string[]
}

export function OpportunityForm({ opportunity, contacts, linkedContactIds = [] }: OpportunityFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      if (opportunity) {
        await updateOpportunity(opportunity.id, formData)
      } else {
        await createOpportunity(formData)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Title *</label>
        <input
          name="title"
          required
          defaultValue={opportunity?.title}
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          placeholder="Software Engineer at Acme"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
          <select
            name="type"
            defaultValue={opportunity?.type ?? 'job'}
            className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          >
            <option value="job">Job</option>
            <option value="referral">Referral</option>
            <option value="coffee_chat">Coffee Chat</option>
            <option value="interview">Interview</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
          <select
            name="status"
            defaultValue={opportunity?.status ?? 'networking'}
            className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          >
            <option value="networking">Networking</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {contacts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Linked contacts
          </label>
          <div className="border border-border-normal rounded-lg divide-y divide-border-subtle max-h-48 overflow-y-auto">
            {contacts.map(contact => (
              <label key={contact.id} className="flex items-center gap-3 px-3 py-2 hover:bg-surface-elevated cursor-pointer">
                <input
                  type="checkbox"
                  name="contact_ids"
                  value={contact.id}
                  defaultChecked={linkedContactIds.includes(contact.id)}
                  className="rounded"
                />
                <span className="text-sm text-text-primary">{contact.name}</span>
                {contact.company && (
                  <span className="text-xs text-text-muted ml-auto">{contact.company}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : opportunity ? 'Save changes' : 'Add opportunity'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-text-secondary hover:text-text-primary px-4 py-2 rounded-lg border border-border-normal transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
