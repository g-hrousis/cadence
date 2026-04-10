import Link from 'next/link'
import type { Opportunity } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { opportunityTypeLabel, opportunityStatusLabel, opportunityStatusVariant } from '@/lib/utils/labels'
import { formatRelative } from '@/lib/utils/dates'

interface OpportunityCardProps {
  opportunity: Opportunity & { contact_count?: number }
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{opportunity.title}</p>
          <Badge variant={opportunityStatusVariant(opportunity.status)}>
            {opportunityStatusLabel(opportunity.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gray">{opportunityTypeLabel(opportunity.type)}</Badge>
          {opportunity.contact_count !== undefined && opportunity.contact_count > 0 && (
            <span className="text-xs text-gray-400">
              {opportunity.contact_count} contact{opportunity.contact_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2">Added {formatRelative(opportunity.created_at)}</p>
      </div>
    </Link>
  )
}
