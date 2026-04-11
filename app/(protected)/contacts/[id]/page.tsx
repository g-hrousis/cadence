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
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/contacts" className="text-xs text-[#585870] hover:text-[#8888A8] mb-2 block transition-colors">
            ← Contacts
          </Link>
          <div className="flex items-center gap-2.5">
            <span className={cn('w-2 h-2 rounded-full shrink-0', wStyle.dot)} />
            <h1 className="text-2xl font-bold text-[#EDEDF2] tracking-tight">{contact.name}</h1>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', wStyle.badge)}>
              {warmth.label}
            </span>
          </div>
          {(contact.role || contact.company) && (
            <p className="text-sm text-[#8888A8] mt-1 ml-[18px]">
              {[contact.role, contact.company].filter(Boolean).join(' at ')}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/contacts/${id}/edit`}
            className="text-xs border border-[rgba(255,255,255,0.08)] text-[#8888A8] hover:text-[#EDEDF2] hover:border-[rgba(255,255,255,0.15)] px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <DeleteContactButton contactId={id} />
        </div>
      </div>

      {/* Details card */}
      <div className="c-card-p mb-4">
        <p className="text-xs font-semibold text-[#6A6A88] uppercase tracking-wider mb-3">Details</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          {contact.email && (
            <>
              <dt className="text-[#6A6A88]">Email</dt>
              <dd className="text-[#EDEDF2]">{contact.email}</dd>
            </>
          )}
          <dt className="text-[#6A6A88]">Last contacted</dt>
          <dd className={cn(
            'font-medium',
            warmth.level === 'cold' || warmth.level === 'cooling' ? 'text-[#F87171]' : 'text-[#EDEDF2]'
          )}>
            {contact.last_contacted ? formatRelative(contact.last_contacted) : 'Never'}
          </dd>
          <dt className="text-[#6A6A88]">Next follow-up</dt>
          <dd className="text-[#EDEDF2]">
            {contact.next_follow_up ? formatDate(contact.next_follow_up) : '—'}
          </dd>
          <dt className="text-[#6A6A88]">Cadence</dt>
          <dd className="text-[#EDEDF2]">Every {contact.contact_cadence_days ?? 14} days</dd>
        </dl>

        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
            {contact.tags.map((tag: string) => (
              <StatusBadge key={tag} variant="gray">{tag}</StatusBadge>
            ))}
          </div>
        )}

        {contact.notes && (
          <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
            <p className="text-xs text-[#6A6A88] mb-1.5">Notes</p>
            <p className="text-sm text-[#9898B8] whitespace-pre-wrap leading-relaxed">{contact.notes}</p>
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="c-card-p">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[#6A6A88] uppercase tracking-wider">
            Interactions ({interactions?.length ?? 0})
          </p>
          <AddInteractionForm contactId={id} />
        </div>
        <InteractionList interactions={interactions ?? []} />
      </div>

    </div>
  )
}
