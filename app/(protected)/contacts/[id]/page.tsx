import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { InteractionList } from '@/components/contacts/InteractionList'
import { AddInteractionForm } from '@/components/contacts/AddInteractionForm'
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton'
import { formatDate, formatRelative } from '@/lib/utils/dates'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: contact }, { data: interactions }] = await Promise.all([
    supabase.from('contacts').select('*').eq('id', id).single(),
    supabase.from('interactions').select('*').eq('contact_id', id).order('date', { ascending: false }),
  ])

  if (!contact) notFound()

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/contacts" className="text-xs text-gray-400 hover:text-gray-600 mb-1 block">
            ← Contacts
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
          {(contact.role || contact.company) && (
            <p className="text-sm text-gray-500 mt-0.5">
              {[contact.role, contact.company].filter(Boolean).join(' at ')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/contacts/${id}/edit`}
            className="text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <DeleteContactButton contactId={id} />
        </div>
      </div>

      <div className="card mb-4">
        <p className="section-title">Details</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {contact.email && (
            <>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{contact.email}</dd>
            </>
          )}
          <dt className="text-gray-500">Last contacted</dt>
          <dd className="text-gray-900">
            {contact.last_contacted ? formatRelative(contact.last_contacted) : 'Never'}
          </dd>
          <dt className="text-gray-500">Next follow-up</dt>
          <dd className="text-gray-900">
            {contact.next_follow_up ? formatDate(contact.next_follow_up) : '—'}
          </dd>
        </dl>

        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {contact.tags.map((tag: string) => (
              <Badge key={tag} variant="gray">{tag}</Badge>
            ))}
          </div>
        )}

        {contact.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="section-title mb-0">Interactions</p>
          <AddInteractionForm contactId={id} />
        </div>
        <InteractionList interactions={interactions ?? []} />
      </div>
    </div>
  )
}
