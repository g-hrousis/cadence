import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DeleteOpportunityButton } from '@/components/opportunities/DeleteOpportunityButton'
import { opportunityStatusLabel, opportunityStatusVariant, opportunityTypeLabel } from '@/lib/utils/labels'
import { formatDate } from '@/lib/utils/dates'

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('*, opportunity_contacts(contact_id, contacts(id, name, company, role))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!opportunity) notFound()

  const linkedContacts = opportunity.opportunity_contacts?.map((oc: { contacts: { id: string; name: string; company: string | null; role: string | null } | null }) => oc.contacts).filter(Boolean) ?? []

  return (
    <div className="max-w-xl">
      <Link href="/opportunities" className="text-xs text-gray-400 hover:text-gray-600 mb-2 block">
        ← Opportunities
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge variant={opportunityStatusVariant(opportunity.status)}>
              {opportunityStatusLabel(opportunity.status)}
            </StatusBadge>
            <StatusBadge variant="gray">{opportunityTypeLabel(opportunity.type)}</StatusBadge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/opportunities/${id}/edit`}
            className="text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <DeleteOpportunityButton opportunityId={id} />
        </div>
      </div>

      <div className="card mb-4">
        <p className="section-title">Details</p>
        <dl className="text-sm space-y-1">
          <div className="flex gap-4">
            <dt className="text-gray-500 w-28">Added</dt>
            <dd className="text-gray-900">{formatDate(opportunity.created_at)}</dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <p className="section-title">Linked contacts ({linkedContacts.length})</p>
        {linkedContacts.length === 0 ? (
          <p className="text-sm text-gray-400">No contacts linked.</p>
        ) : (
          <div className="space-y-2">
            {linkedContacts.map((contact: { id: string; name: string; company: string | null; role: string | null }) => (
              <Link
                key={contact.id}
                href={`/contacts/${contact.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                {contact.company && (
                  <span className="text-xs text-gray-400">{contact.company}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
