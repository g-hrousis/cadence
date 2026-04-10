import { createClient } from '@/lib/supabase/server'
import { buildActionFeed, computeFeedStats } from '@/lib/actions/feed'
import { ActionFeed } from '@/components/dashboard/ActionFeed'
import { PipelinePulse } from '@/components/dashboard/PipelinePulse'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { channelLabel, outcomeLabel, outcomeVariant } from '@/lib/utils/labels'
import { formatRelative } from '@/lib/utils/dates'
import { startOfDay } from 'date-fns'
import type { InteractionWithContact, Opportunity } from '@/types'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const todayStart = startOfDay(new Date()).toISOString()

  const [
    actionItems,
    { data: allContacts },
    { data: allOpportunities },
    { data: recentInteractions },
    { data: profile },
    { count: doneToday },
  ] = await Promise.all([
    buildActionFeed(supabase),
    supabase.from('contacts').select('id'),
    supabase.from('opportunities').select('*').not('status', 'in', '("rejected")'),
    supabase
      .from('interactions')
      .select('*, contacts(name)')
      .order('date', { ascending: false })
      .limit(5),
    supabase.from('profiles').select('first_name').eq('id', user!.id).single(),
    // "Done today" = interactions logged today — best proxy for work completed
    supabase
      .from('interactions')
      .select('id', { count: 'exact', head: true })
      .gte('date', todayStart),
  ])

  const contactCount = allContacts?.length ?? 0
  const opportunities = (allOpportunities ?? []) as Opportunity[]
  const interactions = (recentInteractions ?? []) as InteractionWithContact[]

  // Use || not ?? so an empty string "" also falls through to the email fallback
  const firstName = profile?.first_name?.trim() || user?.email?.split('@')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const stats = computeFeedStats(actionItems)

  // Urgency chips — compact, inline, only non-zero
  const chips = [
    stats.overdue > 0 && { label: `${stats.overdue} overdue`, color: 'text-[#F87171]' },
    stats.dueToday > 0 && { label: `${stats.dueToday} due today`, color: 'text-[#FBBF24]' },
    stats.coldContacts > 0 && { label: `${stats.coldContacts} going cold`, color: 'text-[#8888A8]' },
    stats.staleOpportunities > 0 && { label: `${stats.staleOpportunities} stale`, color: 'text-[#8888A8]' },
  ].filter(Boolean) as { label: string; color: string }[]

  const completedCount = doneToday ?? 0

  return (
    <div className="max-w-3xl">

      {/* ── Header: compact, gets out of the way ───────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#EDEDF2] tracking-tight">
            {greeting}, {firstName}.
          </h1>

          {/* Urgency summary */}
          {chips.length === 0 ? (
            <p className="text-sm text-[#8888A8] mt-0.5">You&apos;re on top of everything.</p>
          ) : (
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {chips.map((chip, i) => (
                <span key={chip.label} className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${chip.color}`}>{chip.label}</span>
                  {i < chips.length - 1 && <span className="text-[#484860]">·</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Daily reset — "X done today" */}
        {completedCount > 0 && (
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[#22C55E] tabular-nums">{completedCount}</p>
            <p className="text-[10px] text-[#585870] uppercase tracking-wider">done today</p>
          </div>
        )}
      </div>

      {/* ── Action Feed: the product ────────────────────────────────────────── */}
      <div className="mb-8">
        <ActionFeed items={actionItems} contactCount={contactCount} />
      </div>

      {/* ── Secondary: de-emphasized, below the fold ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-90">

        {/* Pipeline */}
        <PipelinePulse opportunities={opportunities} />

        {/* Recent interactions */}
        <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.05)] rounded-xl px-4 py-3.5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[#6A6A88] uppercase tracking-wider">Recent</h2>
            <Link href="/contacts" className="text-xs text-[#4F7AFF] hover:text-[#7A9BFF] transition-colors">
              All contacts
            </Link>
          </div>

          {interactions.length === 0 ? (
            <p className="text-xs text-[#585870]">
              No interactions yet.{' '}
              <Link href="/contacts/new" className="text-[#4F7AFF] hover:text-[#7A9BFF]">
                Add a contact
              </Link>
            </p>
          ) : (
            <div className="space-y-2.5">
              {interactions.map(interaction => (
                <div key={interaction.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="text-xs font-medium text-[#EDEDF2] truncate">
                      {interaction.contacts?.name ?? 'Unknown'}
                    </span>
                    <span className="text-[#484860]">·</span>
                    <StatusBadge variant={outcomeVariant(interaction.outcome)}>
                      {outcomeLabel(interaction.outcome)}
                    </StatusBadge>
                  </div>
                  <span className="text-[10px] text-[#585870] shrink-0">{formatRelative(interaction.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
