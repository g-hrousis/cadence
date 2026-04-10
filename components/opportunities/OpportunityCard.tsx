import Link from 'next/link'
import type { Opportunity } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { opportunityTypeLabel, opportunityStatusLabel, opportunityStatusVariant } from '@/lib/utils/labels'
import { formatRelative } from '@/lib/utils/dates'

interface OpportunityCardProps {
  opportunity: Opportunity & { contact_count?: number }
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <div className="c-card-p hover:bg-[#13131C] transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <p className="font-semibold text-[#EDEDF2] text-sm leading-snug">{opportunity.title}</p>
          <StatusBadge variant={opportunityStatusVariant(opportunity.status)}>
            {opportunityStatusLabel(opportunity.status)}
          </StatusBadge>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant="gray">{opportunityTypeLabel(opportunity.type)}</StatusBadge>
          {opportunity.contact_count !== undefined && opportunity.contact_count > 0 && (
            <span className="text-xs text-[#8888A8]">
              {opportunity.contact_count} contact{opportunity.contact_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className="text-xs text-[#6A6A88] mt-2.5">Added {formatRelative(opportunity.created_at)}</p>
      </div>
    </Link>
  )
}
