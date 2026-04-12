import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { InteractionList } from '@/components/contacts/InteractionList'
import { AddInteractionForm } from '@/components/contacts/AddInteractionForm'
import { DeleteContactButton } from '@/components/contacts/DeleteContactButton'
import { computeWarmth, warmthStyles } from '@/lib/utils/warmth'
import { formatDate, formatRelative } from '@/lib/utils/dates'
import { cn } from '@/lib/utils'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [{ data: contact }, { data: interactions }] = await Promise.all([
    supabase.from('contacts').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('interactions').select('*').eq('contact_id', id).eq('user_id', user.id).order('date', { ascending: false }),
  ])

  if (!contact) notFound()

  const warmth = computeWarmth(contact)
  const wStyle = warmthStyles[warmth.level]

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <Link href="/contacts" className="text-xs text-text-dim hover:text-text-secondary mb-2 block transition-colors">
            ← Contacts
          </Link>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('w-2 h-2 rounded-full shrink-0', wStyle.dot)} />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">{contact.name}</h1>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', wStyle.badge)}>
              {warmth.label}
            </span>
          </div>
          {(contact.role || contact.company) && (
            <p className="text-sm text-text-secondary mt-1 ml-[18px]">
              {[contact.role, contact.company].filter(Boolean).join(' at ')}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/contacts/${id}/edit`}
            className="text-xs border border-border-normal text-text-secondary hover:text-text-primary hover:border-border-strong px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <DeleteContactButton contactId={id} />
        </div>
      </div>

      {/* Details card */}
      <div className="c-card-p mb-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Details</p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          {contact.email && (
            <>
              <dt className="text-text-muted">Email</dt>
              <dd className="text-text-primary">{contact.email}</dd>
            </>
          )}
          <dt className="text-text-muted">Last contacted</dt>
          <dd className={cn(
            'font-medium',
            warmth.level === 'cold' || warmth.level === 'cooling' ? 'text-[#F87171]' : 'text-text-primary'
          )}>
            {contact.last_contacted ? formatRelative(contact.last_contacted) : 'Never'}
          </dd>
          <dt className="text-text-muted">Next follow-up</dt>
          <dd className="text-text-primary">
            {contact.next_follow_up ? formatDate(contact.next_follow_up) : '—'}
          </dd>
          <dt className="text-text-muted">Cadence</dt>
          <dd className="text-text-primary">Every {contact.contact_cadence_days ?? 14} days</dd>
        </dl>

        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border-subtle">
            {contact.tags.map((tag: string) => (
              <StatusBadge key={tag} variant="gray">{tag}</StatusBadge>
            ))}
          </div>
        )}

        {contact.notes && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="text-xs text-text-muted mb-1.5">Notes</p>
            <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{contact.notes}</p>
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="c-card-p">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Interactions ({interactions?.length ?? 0})
          </p>
          <AddInteractionForm contactId={id} />
        </div>
        <InteractionList interactions={interactions ?? []} />
      </div>

    </div>
  )
}
