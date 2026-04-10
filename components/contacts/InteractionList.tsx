import type { Interaction } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/dates'
import { channelLabel, outcomeLabel, outcomeVariant } from '@/lib/utils/labels'

export function InteractionList({ interactions }: { interactions: Interaction[] }) {
  if (interactions.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4">No interactions logged yet.</p>
    )
  }

  return (
    <div className="space-y-3">
      {interactions.map(interaction => (
        <div key={interaction.id} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">{channelLabel(interaction.channel)}</span>
              <Badge variant={outcomeVariant(interaction.outcome)}>
                {outcomeLabel(interaction.outcome)}
              </Badge>
            </div>
            <span className="text-xs text-gray-400">{formatDate(interaction.date)}</span>
          </div>
          {interaction.notes && (
            <p className="text-xs text-gray-600 mt-1">{interaction.notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}
