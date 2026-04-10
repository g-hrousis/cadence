import type { Interaction } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils/dates'
import { channelLabel, outcomeLabel, outcomeVariant } from '@/lib/utils/labels'

export function InteractionList({ interactions }: { interactions: Interaction[] }) {
  if (interactions.length === 0) {
    return (
      <p className="text-xs text-[#6A6A88] py-4">No interactions logged yet.</p>
    )
  }

  return (
    <div className="space-y-2">
      {interactions.map(interaction => (
        <div key={interaction.id} className="border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#EDEDF2]">{channelLabel(interaction.channel)}</span>
              <StatusBadge variant={outcomeVariant(interaction.outcome)}>
                {outcomeLabel(interaction.outcome)}
              </StatusBadge>
            </div>
            <span className="text-xs text-[#585870]">{formatDate(interaction.date)}</span>
          </div>
          {interaction.notes && (
            <p className="text-xs text-[#8888A8] mt-1 leading-relaxed">{interaction.notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}
