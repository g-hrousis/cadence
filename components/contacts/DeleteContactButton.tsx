'use client'

import { useTransition } from 'react'
import { deleteContact } from '@/app/(protected)/contacts/actions'

export function DeleteContactButton({ contactId }: { contactId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this contact? This cannot be undone.')) return
    startTransition(() => deleteContact(contactId))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
