import Link from 'next/link'
import type { Opportunity } from '@/types'

const STAGES = [
  { key: 'applied',      label: 'Applied',      nextStep: 'Follow Up',          dot: 'bg-[#4F7AFF]' },
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
    <div className="w-6 h-6 rounded bg-[#1C1C2E] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
      <span className="text-[9px] font-bold text-[#8888A8]">{initials}</span>
    </div>
  )
}

interface PipelinePulseProps {
  opportunities: Opportunity[]
}

export function PipelinePulse({ opportunities }: PipelinePulseProps) {
  const active = opportunities.filter(o => o.status !== 'rejected')

  return (
    <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#EDEDF2]">Opportunity Pipeline</h2>
        <Link
          href="/opportunities"
          className="text-xs text-[#4F7AFF] hover:text-[#7A9BFF] font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      {active.length === 0 ? (
        <p className="text-xs text-[#6A6A88]">
          No active opportunities.{' '}
          <Link href="/opportunities/new" className="text-[#4F7AFF] hover:text-[#7A9BFF]">
            Track one
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map(stage => {
            const items = active.filter(o => o.status === stage.key)
            return (
              <div key={stage.key} className="min-w-0">
                {/* Column header */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stage.dot}`} />
                  <span className="text-[10px] font-semibold text-[#6A6A88] uppercase tracking-wider truncate">
                    {stage.label}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-1.5">
                  {items.length === 0 ? (
                    <div className="bg-[#111118] border border-dashed border-[rgba(255,255,255,0.06)] rounded-lg px-2.5 py-2.5 text-center">
                      <span className="text-[10px] text-[#484860]">Empty</span>
                    </div>
                  ) : (
                    items.slice(0, 2).map(opp => (
                      <Link
                        key={opp.id}
                        href={`/opportunities/${opp.id}`}
                        className="group flex items-start gap-2 bg-[#111118] border border-[rgba(255,255,255,0.05)] rounded-lg px-2.5 py-2 hover:border-[rgba(255,255,255,0.1)] transition-colors block"
                      >
                        <OppInitials title={opp.title} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-[#EDEDF2] truncate leading-tight">
                            {opp.title}
                          </p>
                          <p className="text-[10px] text-[#585870] mt-0.5 truncate">
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
                      className="block text-center text-[10px] text-[#585870] hover:text-[#8888A8] py-1 transition-colors"
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
