'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Contact } from '@/types'
import { createContact, updateContact } from '@/app/(protected)/contacts/actions'

interface ContactFormProps {
  contact?: Contact
}

export function ContactForm({ contact }: ContactFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      if (contact) {
        await updateContact(contact.id, formData)
      } else {
        await createContact(formData)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Name *</label>
        <input
          name="name"
          required
          defaultValue={contact?.name}
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          placeholder="Jane Smith"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Company</label>
          <input
            name="company"
            defaultValue={contact?.company ?? ''}
            className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
            placeholder="Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
          <input
            name="role"
            defaultValue={contact?.role ?? ''}
            className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
            placeholder="Product Manager"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={contact?.email ?? ''}
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Tags <span className="text-text-muted font-normal">(comma-separated)</span>
        </label>
        <input
          name="tags"
          defaultValue={contact?.tags.join(', ')}
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)]"
          placeholder="recruiter, alumni, warm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Notes</label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={contact?.notes}
          className="w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(200,240,96,0.25)] resize-none"
          placeholder="Context about this contact…"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : contact ? 'Save changes' : 'Add contact'}
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
