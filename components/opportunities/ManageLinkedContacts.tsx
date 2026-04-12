'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { linkContact, unlinkContact } from '@/app/(protected)/opportunities/actions'

interface ContactOption {
  id: string
  name: string
  company: string | null
  role?: string | null
}

export function ManageLinkedContacts({
  opportunityId,
  linkedContacts,
  allContacts,
}: {
  opportunityId: string
  linkedContacts: ContactOption[]
  allContacts: ContactOption[]
}) {
  const [isPending, startTransition] = useTransition()
  const [showAdd, setShowAdd] = useState(false)

  const unlinked = allContacts.filter(c => !linkedContacts.some(lc => lc.id === c.id))

  function handleLink(contactId: string) {
    if (!contactId) return
    startTransition(async () => {
      await linkContact(opportunityId, contactId)
      setShowAdd(false)
    })
  }

  function handleUnlink(contactId: string) {
    startTransition(async () => {
      await unlinkContact(opportunityId, contactId)
    })
  }

  return (
    <div>
      {linkedContacts.length === 0 && !showAdd && (
        <p className="text-sm text-text-muted mb-2">No contacts linked.</p>
      )}

      {linkedContacts.length > 0 && (
        <div className="space-y-0.5 mb-2">
          {linkedContacts.map(contact => (
            <div
              key={contact.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-elevated group transition-colors"
            >
              <Link href={`/contacts/${contact.id}`} className="flex-1 min-w-0">
                <span className="text-sm font-medium text-text-primary">{contact.name}</span>
                {contact.company && (
                  <span className="text-xs text-text-muted ml-2">{contact.company}</span>
                )}
              </Link>
              <button
                onClick={() => handleUnlink(contact.id)}
                disabled={isPending}
                className="text-[10px] font-medium text-text-ghost hover:text-[#F87171] opacity-0 group-hover:opacity-100 transition-all disabled:opacity-30 px-1.5 py-0.5 ml-2 shrink-0"
              >
                Unlink
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd ? (
        <div className="flex gap-2 items-center mt-2">
          <select
            defaultValue=""
            onChange={e => handleLink(e.target.value)}
            disabled={isPending}
            className="flex-1 bg-surface-sidebar border border-border-normal rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-[var(--c-accent)] transition-colors"
          >
            <option value="" disabled>Select a contact…</option>
            {unlinked.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` — ${c.company}` : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="text-xs text-text-dim hover:text-text-secondary transition-colors px-2 shrink-0"
          >
            Cancel
          </button>
        </div>
      ) : (
        unlinked.length > 0 && (
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs font-semibold text-[var(--c-accent)] hover:opacity-75 transition-opacity"
          >
            + Link contact
          </button>
        )
      )}
    </div>
  )
}
