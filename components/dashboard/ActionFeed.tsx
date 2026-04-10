import type { ActionItem as ActionItemType } from '@/types'
import { ActionItem } from './ActionItem'
import Link from 'next/link'

interface ActionFeedProps {
  items: ActionItemType[]
  contactCount: number
}

export function ActionFeed({ items, contactCount }: ActionFeedProps) {

  // No contacts — true first-run state
  if (contactCount === 0) {
    return (
      <div className="bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.05)]">
          <h2 className="text-sm font-semibold text-[#EDEDF2]">Today&apos;s Moves</h2>
        </div>
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-[#EDEDF2] mb-1">Nothing to act on yet</p>
          <p className="text-xs text-[#6A6A88] mb-5 max-w-xs mx-auto leading-relaxed">
            Add your first contact and Cadence will tell you exactly what to do and when.
          </p>
          <Link
            href="/contacts/new"
            className="inline-flex items-center text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-4 py-2 rounded-lg hover:bg-[#162254] transition-colors"
          >
            Add first contact
          </Link>
        </div>
      </div>
    )
  }

  // Has contacts, nothing urgent — reward state
  if (items.length === 0) {
    return (
      <div className="bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#EDEDF2]">Today&apos;s Moves</h2>
          <span className="text-xs font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] px-2 py-0.5 rounded-full">
            Clear
          </span>
        </div>
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-[#EDEDF2] mb-1">Queue is clear</p>
          <p className="text-xs text-[#6A6A88]">
            No follow-ups, no cold contacts, no stale deals.{' '}
            <Link href="/contacts/new" className="text-[#4F7AFF] hover:text-[#7A9BFF]">
              Add contacts
            </Link>{' '}
            to keep building.
          </p>
        </div>
      </div>
    )
  }

  // Active queue — the main state
  return (
    <div className="bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#EDEDF2]">Today&apos;s Moves</h2>
        <span className="text-xs text-[#8888A8]">
          {items.length} {items.length === 1 ? 'action' : 'actions'}
        </span>
      </div>
      <div>
        {items.map(item => (
          <ActionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
