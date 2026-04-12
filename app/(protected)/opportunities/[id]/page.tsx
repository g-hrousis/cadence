import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DeleteOpportunityButton } from '@/components/opportunities/DeleteOpportunityButton'
import { ManageLinkedContacts } from '@/components/opportunities/ManageLinkedContacts'
import { OpportunityInteractionForm } from '@/components/opportunities/OpportunityInteractionForm'
import { opportunityStatusLabel, opportunityStatusVariant, opportunityTypeLabel } from '@/lib/utils/labels'
import { formatDate } from '@/lib/utils/dates'

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [{ data: opportunity }, { data: allContacts }] = await Promise.all([
    supabase
      .from('opportunities')
      .select('*, opportunity_contacts(contact_id, contacts(id, name, company, role))')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('contacts')
      .select('id, name, company')
      .eq('user_id', user.id)
      .order('name'),
  ])

  if (!opportunity) notFound()

  const linkedContacts = opportunity.opportunity_contacts
    ?.map((oc: { contacts: { id: string; name: string; company: string | null; role: string | null } | null }) => oc.contacts)
    .filter(Boolean) ?? []

  const contacts = allContacts ?? []

  return (
    <div className="max-w-xl">
      <Link href="/opportunities" className="text-xs text-text-muted hover:text-text-secondary mb-2 block">
        ← Opportunities
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{opportunity.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge variant={opportunityStatusVariant(opportunity.status)}>
              {opportunityStatusLabel(opportunity.status)}
            </StatusBadge>
            <StatusBadge variant="gray">{opportunityTypeLabel(opportunity.type)}</StatusBadge>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/opportunities/${id}/edit`}
            className="text-xs border border-border-normal text-text-secondary hover:text-text-primary hover:border-border-strong px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <DeleteOpportunityButton opportunityId={id} />
        </div>
      </div>

      {/* Details */}
      <div className="c-card-p mb-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Details</p>
        <dl className="text-sm space-y-1.5">
          <div className="flex gap-4">
            <dt className="text-text-muted w-28">Added</dt>
            <dd className="text-text-primary">{formatDate(opportunity.created_at)}</dd>
          </div>
        </dl>
      </div>

      {/* People — inline link/unlink */}
      <div className="c-card-p mb-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          People ({linkedContacts.length})
        </p>
        <ManageLinkedContacts
          opportunityId={id}
          linkedContacts={linkedContacts}
          allContacts={contacts}
        />
      </div>

      {/* Interactions */}
      <div className="c-card-p">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Interactions</p>
          <OpportunityInteractionForm
            linkedContacts={linkedContacts}
            allContacts={contacts}
          />
        </div>
        {contacts.length === 0 && (
          <p className="text-sm text-text-muted">
            Add contacts to your network to start logging interactions.
          </p>
        )}
        {contacts.length > 0 && linkedContacts.length === 0 && (
          <p className="text-sm text-text-muted">
            Link a contact above, then log your interactions with them here.
          </p>
        )}
        {linkedContacts.length > 0 && (
          <p className="text-xs text-text-ghost mt-1">
            Interaction history is on each{' '}
            {linkedContacts.map((c: { id: string; name: string }, i: number) => (
              <span key={c.id}>
                <Link href={`/contacts/${c.id}`} className="text-[var(--c-accent)] hover:opacity-80">
                  {c.name}
                </Link>
                {i < linkedContacts.length - 1 ? ', ' : ''}
              </span>
            ))}
            {' '}contact page{linkedContacts.length !== 1 ? 's' : ''}.
          </p>
        )}
      </div>
    </div>
  )
}
