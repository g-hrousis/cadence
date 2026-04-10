import Link from 'next/link'
import type { Contact } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatRelative, isGoingCold } from '@/lib/utils/dates'

export function ContactCard({ contact }: { contact: Contact }) {
  const cold = isGoingCold(contact.last_contacted)

  return (
    <Link href={`/contacts/${contact.id}`}>
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
            {(contact.role || contact.company) && (
              <p className="text-xs text-gray-500 mt-0.5">
                {[contact.role, contact.company].filter(Boolean).join(' at ')}
              </p>
            )}
          </div>
          {cold && (
            <Badge variant="orange">Going cold</Badge>
          )}
        </div>

        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {contact.tags.map(tag => (
              <Badge key={tag} variant="gray">{tag}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span>
            Last contact:{' '}
            <span className={cold ? 'text-orange-600 font-medium' : 'text-gray-600'}>
              {contact.last_contacted ? formatRelative(contact.last_contacted) : 'Never'}
            </span>
          </span>
          {contact.next_follow_up && (
            <span>
              Follow up:{' '}
              <span className="text-gray-600">{formatRelative(contact.next_follow_up)}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
