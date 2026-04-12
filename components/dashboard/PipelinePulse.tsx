import Link from 'next/link'
import type { Opportunity } from '@/types'
import { GuideButton } from '@/components/ui/GuideModal'

const STAGES = [
  { key: 'applied',      label: 'Applied',      nextStep: 'Follow Up',          dot: 'bg-[var(--c-accent)]' },
  { key: 'networking',   label: 'Networking',   nextStep: 'Coffee Chat',        dot: 'bg-[#A78BFA]' },
  { key: 'interviewing', label: 'Interviewing', nextStep: 'Prep for Interview', dot: 'bg-[#FBBF24]' },
  { key: 'offer',        label: 'Offer',        nextStep: 'Offer Review',       dot: 'bg-[#22C55E]' },
] as const

// Company initials badge
function OppInitials({ title }: { title: string }) {
  const words = title.trim().split(/\s+/)
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : title.slice(0, 2).toUpperCase()
  return (
    <div className="w-6 h-6 rounded bg-surface-elevated border border-border-normal flex items-center justify-center shrink-0">
      <span className="text-[9px] font-bold text-text-secondary">{initials}</span>
    </div>
  )
}

interface PipelinePulseProps {
  opportunities: Opportunity[]
}

export function PipelinePulse({ opportunities }: PipelinePulseProps) {
  const active = opportunities.filter(o => o.status !== 'rejected')

  return (
    <div className="bg-surface-sidebar border border-border-subtle rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-primary">Opportunity Pipeline</h2>
          <GuideButton guideKey="opportunity" />
        </div>
        <Link
          href="/opportunities"
          className="text-xs text-[var(--c-accent)] hover:opacity-80 font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      {active.length === 0 ? (
        <p className="text-xs text-text-muted">
          No active opportunities.{' '}
          <Link href="/opportunities/new" className="text-[var(--c-accent)] hover:opacity-80">
            Track one
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STAGES.map(stage => {
            const items = active.filter(o => o.status === stage.key)
            return (
              <div key={stage.key} className="min-w-0">
                {/* Column header */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stage.dot}`} />
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider truncate">
                    {stage.label}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-1.5">
                  {items.length === 0 ? (
                    <div className="bg-surface-card border border-dashed border-border-subtle rounded-lg px-2.5 py-2.5 text-center">
                      <span className="text-[10px] text-text-ghost">Empty</span>
                    </div>
                  ) : (
                    items.slice(0, 2).map(opp => (
                      <Link
                        key={opp.id}
                        href={`/opportunities/${opp.id}`}
                        className="group flex items-start gap-2 bg-surface-card border border-border-subtle rounded-lg px-2.5 py-2 hover:border-border-normal transition-colors block"
                      >
                        <OppInitials title={opp.title} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-text-primary truncate leading-tight">
                            {opp.title}
                          </p>
                          <p className="text-[10px] text-text-dim mt-0.5 truncate">
                            {stage.nextStep}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                  {/* Overflow indicator */}
                  {items.length > 2 && (
                    <Link
                      href="/opportunities"
                      className="block text-center text-[10px] text-text-dim hover:text-text-secondary py-1 transition-colors"
                    >
                      +{items.length - 2} more
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
