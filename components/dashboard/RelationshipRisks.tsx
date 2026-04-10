import Link from 'next/link'
import type { ActionItem } from '@/types'

interface RelationshipRisksProps {
  items: ActionItem[]
}

function Initials({ name }: { name?: string }) {
  const letters = (name ?? '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="w-7 h-7 rounded-full bg-[#1C1C2E] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
      <span className="text-[10px] font-semibold text-[#8888A8]">{letters}</span>
    </div>
  )
}

function Chevron() {
  return (
    <svg className="w-3.5 h-3.5 text-[#484860] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function RelationshipRisks({ items }: RelationshipRisksProps) {
  const riskItems = items.filter(
    i => i.type === 'cold_contact' || i.type === 'never_contacted'
  )
  const shown = riskItems.slice(0, 2)
  const overflow = riskItems.length - shown.length

  if (riskItems.length === 0) {
    return (
      <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-[#EDEDF2] mb-2">Relationship Risks</h2>
        <p className="text-xs text-[#585870]">All relationships are warm.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
      <h2 className="text-sm font-semibold text-[#EDEDF2] mb-1">Relationship Risks</h2>

      <div>
        {shown.map(item => {
          const isAtRisk = item.priority === 1
          const description = item.subtext.split('·')[0].trim()

          return (
            <Link
              key={item.id}
              href={`/contacts/${item.contactId}`}
              className="flex items-center gap-3 py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] -mx-4 px-4 transition-colors"
            >
              <Initials name={item.contactName} />

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-[#EDEDF2] truncate">
                  {item.contactName}
                </span>
                <span className="text-[#585870] text-sm font-normal"> — {description}</span>
              </div>

              {isAtRisk ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 bg-[rgba(248,113,113,0.12)] text-[#F87171] border border-[rgba(248,113,113,0.2)]">
                  At Risk
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 bg-[rgba(139,92,246,0.12)] text-[#A78BFA] border border-[rgba(139,92,246,0.2)]">
                  Cold
                </span>
              )}

              <Chevron />
            </Link>
          )
        })}

        {/* Overflow meta-row */}
        {overflow > 0 && (
          <Link
            href="/contacts"
            className="flex items-center gap-3 py-2.5 hover:bg-[rgba(255,255,255,0.02)] -mx-4 px-4 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#1C1C2E] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-semibold text-[#8888A8]">+{overflow}</span>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-[#EDEDF2]">
                Reconnect with {overflow} more contact{overflow !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 bg-[rgba(251,191,36,0.1)] text-[#FBBF24] border border-[rgba(251,191,36,0.2)]">
              Action Needed
            </span>
            <Chevron />
          </Link>
        )}
      </div>
    </div>
  )
}
