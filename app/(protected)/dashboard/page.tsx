import { createClient } from '@/lib/supabase/server'
import { buildActionFeed, computeFeedStats } from '@/lib/actions/feed'
import { ActionFeed } from '@/components/dashboard/ActionFeed'
import { PipelinePulse } from '@/components/dashboard/PipelinePulse'
import { PipelineHealth } from '@/components/dashboard/PipelineHealth'
import { RelationshipRisks } from '@/components/dashboard/RelationshipRisks'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { startOfDay } from 'date-fns'
import Link from 'next/link'
import type { InteractionWithContact, Opportunity } from '@/types'

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
  const completedCount = doneToday ?? 0

  // Status pills — non-zero only, shown as clickable header badges
  const statusPills = [
    stats.overdue + stats.dueToday > 0 && {
      label: `${stats.overdue + stats.dueToday} Follow-up${stats.overdue + stats.dueToday !== 1 ? 's' : ''} Due`,
      href: '/tasks',
      color: 'text-[var(--c-accent)] bg-[rgba(200,240,96,0.1)] border-[rgba(200,240,96,0.2)]',
    },
    stats.coldContacts > 0 && {
      label: `${stats.coldContacts} Contact${stats.coldContacts !== 1 ? 's' : ''} Going Cold`,
      href: '/contacts',
      color: 'text-[#FBBF24] bg-[rgba(251,191,36,0.08)] border-[rgba(251,191,36,0.2)]',
    },
    stats.staleOpportunities > 0 && {
      label: `${stats.staleOpportunities} High-Priority Opportunit${stats.staleOpportunities !== 1 ? 'ies' : 'y'}`,
      href: '/opportunities',
      color: 'text-[#F87171] bg-[rgba(248,113,113,0.08)] border-[rgba(248,113,113,0.2)]',
    },
  ].filter(Boolean) as { label: string; href: string; color: string }[]

  return (
    <div className="max-w-[1200px]">

      {/* ── Top bar: greeting + live status pills + New CTA ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            {greeting}, {firstName}.
          </h1>
          {completedCount > 0 ? (
            <p className="text-xs text-[#22C55E] mt-0.5 font-medium">
              {completedCount} interaction{completedCount !== 1 ? 's' : ''} logged today
            </p>
          ) : (
            <p className="text-xs text-text-dim mt-0.5">
              {statusPills.length === 0 ? "You're on top of everything." : 'Here\'s what needs your attention.'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {statusPills.map(pill => (
            <Link
              key={pill.label}
              href={pill.href}
              className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80 ${pill.color}`}
            >
              {pill.label}
            </Link>
          ))}

          <Link
            href="/import"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-surface-card border border-border-normal text-text-primary px-3 py-1.5 rounded-full hover:border-border-strong transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m-4-4l4 4 4-4" />
            </svg>
            Import
          </Link>

          <Link
            href="/contacts/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-surface-card border border-border-normal text-text-primary px-3 py-1.5 rounded-full hover:border-border-strong transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New
          </Link>
        </div>
      </div>

      {/* ── Two-column grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5 items-start">

        {/* Left column — Today's Moves + Opportunity Pipeline */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          <ActionFeed items={actionItems} contactCount={contactCount} />
          <PipelinePulse opportunities={opportunities} />
        </div>

        {/* Right column — Pipeline Health + Relationship Risks + Recent Activity */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <PipelineHealth stats={stats} />
          <RelationshipRisks items={actionItems} />
          <RecentActivity interactions={interactions} />
        </div>

      </div>
    </div>
  )
}
