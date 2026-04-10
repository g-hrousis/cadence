import Link from 'next/link'
import type { Contact } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { computeWarmth, warmthStyles } from '@/lib/utils/warmth'
import { formatRelative } from '@/lib/utils/dates'
import { cn } from '@/lib/utils'

export function ContactCard({ contact }: { contact: Contact }) {
  const warmth = computeWarmth(contact)
  const wStyle = warmthStyles[warmth.level]

  return (
    <Link href={`/contacts/${contact.id}`}>
      <div className="c-card-p hover:bg-[#13131C] transition-colors cursor-pointer group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 mt-0.5', wStyle.dot)} />
            <div className="min-w-0">
              <p className="font-semibold text-[#EDEDF2] text-sm truncate">{contact.name}</p>
              {(contact.role || contact.company) && (
                <p className="text-xs text-[#8888A8] mt-0.5 truncate">
                  {[contact.role, contact.company].filter(Boolean).join(' at ')}
                </p>
              )}
            </div>
          </div>
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full border shrink-0',
            wStyle.badge
          )}>
            {warmth.label}
          </span>
        </div>

        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {contact.tags.map(tag => (
              <StatusBadge key={tag} variant="gray">{tag}</StatusBadge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-[#6A6A88]">
          <span>
            Last contact:{' '}
            <span className={warmth.level === 'cold' || warmth.level === 'cooling' ? 'text-[#F87171] font-medium' : 'text-[#9898B8]'}>
              {contact.last_contacted ? formatRelative(contact.last_contacted) : 'Never'}
            </span>
          </span>
          {contact.next_follow_up && (
            <span>
              Follow up:{' '}
              <span className="text-[#9898B8]">{formatRelative(contact.next_follow_up)}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
