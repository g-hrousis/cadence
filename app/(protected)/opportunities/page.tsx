import { createClient } from '@/lib/supabase/server'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import Link from 'next/link'

const STATUSES = [
  { key: 'networking',   label: 'Networking' },
  { key: 'applied',      label: 'Applied' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'offer',        label: 'Offer' },
  { key: 'rejected',     label: 'Rejected' },
]

export default async function OpportunitiesPage() {
  const supabase = await createClient()

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*, opportunity_contacts(contact_id)')
    .order('created_at', { ascending: false })

  const grouped = STATUSES.map(s => ({
    ...s,
    items: (opportunities ?? [])
      .filter(o => o.status === s.key)
      .map(o => ({ ...o, contact_count: o.opportunity_contacts?.length ?? 0 })),
  })).filter(g => g.items.length > 0)

  const total = opportunities?.length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#EDEDF2] tracking-tight">Opportunities</h1>
          <p className="text-sm text-[#8888A8] mt-0.5">{total} {total === 1 ? 'opportunity' : 'opportunities'} tracked</p>
        </div>
        <Link
          href="/opportunities/new"
          className="bg-[#0F1940] hover:bg-[#162254] text-[#4F7AFF] text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add opportunity
        </Link>
      </div>

      {!opportunities || opportunities.length === 0 ? (
        <div className="c-card-p text-center py-12">
          <p className="text-[#6A6A88] text-sm mb-4">No opportunities yet. Start tracking a role or conversation.</p>
          <Link href="/opportunities/new" className="text-[#4F7AFF] hover:text-[#7A9BFF] text-sm font-medium">
            Track your first opportunity
          </Link>
        </div>
      ) : (
        <div className="space-y-7">
          {STATUSES.map(status => {
            const items = grouped.find(g => g.key === status.key)?.items ?? []
            if (items.length === 0) return null
            return (
              <div key={status.key}>
                <p className="text-xs font-semibold text-[#6A6A88] uppercase tracking-wider mb-3">
                  {status.label} ({items.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(opp => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
