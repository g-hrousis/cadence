import Link from 'next/link'
import type { FeedStats } from '@/lib/actions/feed'

interface PipelineHealthProps {
  stats: FeedStats
}

export function PipelineHealth({ stats }: PipelineHealthProps) {
  const tiles = [
    {
      count: stats.coldContacts,
      label: 'At-Risk\nContacts',
      href: '/contacts',
      color: stats.coldContacts > 0 ? 'text-[#4F7AFF]' : 'text-[#484860]',
    },
    {
      count: stats.staleOpportunities,
      label: 'Stale\nOpportunity',
      href: '/opportunities',
      color: stats.staleOpportunities > 0 ? 'text-[#F87171]' : 'text-[#484860]',
    },
    {
      count: stats.overdue,
      label: 'Overdue\nTasks',
      href: '/tasks',
      color: stats.overdue > 0 ? 'text-[#4F7AFF]' : 'text-[#484860]',
    },
  ]

  return (
    <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
      <h2 className="text-sm font-semibold text-[#EDEDF2] mb-3">Pipeline Health</h2>
      <div className="grid grid-cols-4 gap-2">
        {tiles.map(tile => (
          <Link
            key={tile.label}
            href={tile.href}
            className="bg-[#111118] border border-[rgba(255,255,255,0.05)] rounded-xl px-2 py-3 text-center hover:border-[rgba(255,255,255,0.1)] transition-colors"
          >
            <div className={`text-2xl font-bold tabular-nums leading-none ${tile.color}`}>
              {tile.count}
            </div>
            <div className="text-[10px] text-[#6A6A88] mt-1.5 leading-tight whitespace-pre-line">
              {tile.label}
            </div>
          </Link>
        ))}

        {/* Build Your Momentum CTA */}
        <Link
          href="/contacts/new"
          className="bg-[#111118] border border-[rgba(255,255,255,0.05)] rounded-xl px-2 py-3 flex flex-col items-center justify-center gap-1.5 hover:border-[rgba(251,191,36,0.25)] transition-colors group"
        >
          <div className="w-6 h-6 rounded-full bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] flex items-center justify-center group-hover:bg-[rgba(251,191,36,0.15)] transition-colors">
            <svg className="w-3 h-3 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-[10px] text-[#6A6A88] leading-tight text-center">
            Build Your<br />Momentum
          </div>
        </Link>
      </div>
    </div>
  )
}
