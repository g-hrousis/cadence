import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Opportunity } from '@/types'

const STAGES = [
  { key: 'networking',   label: 'Networking',   color: 'text-[#A78BFA]' },
  { key: 'applied',      label: 'Applied',       color: 'text-[#4F7AFF]' },
  { key: 'interviewing', label: 'Interviewing',  color: 'text-[#FBBF24]' },
  { key: 'offer',        label: 'Offer',         color: 'text-[#22C55E]' },
] as const

interface PipelinePulseProps {
  opportunities: Opportunity[]
}

export function PipelinePulse({ opportunities }: PipelinePulseProps) {
  const active = opportunities.filter(o => o.status !== 'rejected')
  const counts = STAGES.map(s => ({
    ...s,
    count: active.filter(o => o.status === s.key).length,
  }))
  const total = active.length

  return (
    <div className="c-card-p">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#EDEDF2]">Pipeline</h2>
        <Link href="/opportunities" className="text-xs text-[#4F7AFF] hover:text-[#7A9BFF] font-medium transition-colors">
          View all
        </Link>
      </div>

      {total === 0 ? (
        <p className="text-xs text-[#6A6A88]">
          No active opportunities.{' '}
          <Link href="/opportunities/new" className="text-[#4F7AFF] hover:text-[#7A9BFF]">Track one</Link>
        </p>
      ) : (
        <div className="flex items-center gap-1">
          {counts.map((stage, i) => (
            <div key={stage.key} className="flex items-center gap-1">
              <Link
                href="/opportunities"
                className="flex flex-col items-center px-2.5 py-2 rounded-lg hover:bg-[#13131C] transition-colors text-center min-w-0"
              >
                <span className={cn('text-xl font-bold tabular-nums leading-none', stage.color)}>
                  {stage.count}
                </span>
                <span className="text-[10px] text-[#8888A8] whitespace-nowrap mt-1">{stage.label}</span>
              </Link>
              {i < counts.length - 1 && (
                <span className="text-[#484860] text-xs">→</span>
              )}
            </div>
          ))}
          <div className="ml-auto pl-3 border-l border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[#8888A8]">{total} active</span>
          </div>
        </div>
      )}
    </div>
  )
}
