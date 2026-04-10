import { createClient } from '@/lib/supabase/server'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import Link from 'next/link'

const STATUSES = [
  { key: 'networking', label: 'Networking' },
  { key: 'applied', label: 'Applied' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
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

  const activeStatuses = STATUSES.filter(s =>
    grouped.find(g => g.key === s.key)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-0.5">{opportunities?.length ?? 0} total</p>
        </div>
        <Link
          href="/opportunities/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add opportunity
        </Link>
      </div>

      {!opportunities || opportunities.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No opportunities yet.</p>
          <Link href="/opportunities/new" className="text-blue-600 hover:underline text-sm font-medium">
            Track your first opportunity
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {STATUSES.map(status => {
            const items = grouped.find(g => g.key === status.key)?.items ?? []
            if (items.length === 0) return null
            return (
              <div key={status.key}>
                <p className="section-title">{status.label} ({items.length})</p>
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
