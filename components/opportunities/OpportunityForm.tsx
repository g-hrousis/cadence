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
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          name="title"
          required
          defaultValue={opportunity?.title}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Software Engineer at Acme"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            defaultValue={opportunity?.type ?? 'job'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="job">Job</option>
            <option value="referral">Referral</option>
            <option value="coffee_chat">Coffee Chat</option>
            <option value="interview">Interview</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue={opportunity?.status ?? 'networking'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Linked contacts
          </label>
          <div className="border border-gray-300 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
            {contacts.map(contact => (
              <label key={contact.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="contact_ids"
                  value={contact.id}
                  defaultChecked={linkedContactIds.includes(contact.id)}
                  className="rounded"
                />
                <span className="text-sm text-gray-800">{contact.name}</span>
                {contact.company && (
                  <span className="text-xs text-gray-400 ml-auto">{contact.company}</span>
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
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : opportunity ? 'Save changes' : 'Add opportunity'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
