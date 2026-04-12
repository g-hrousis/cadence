import type { ActionItem as ActionItemType } from '@/types'
import { ActionItem } from './ActionItem'
import { GuideButton } from '@/components/ui/GuideModal'
import Link from 'next/link'

interface ActionFeedProps {
  items: ActionItemType[]
  contactCount: number
}

export function ActionFeed({ items, contactCount }: ActionFeedProps) {

  // No contacts — true first-run state
  if (contactCount === 0) {
    return (
      <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Today&apos;s Moves</h2>
          <GuideButton guideKey="contact" />
        </div>
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-text-primary mb-1">Nothing to act on yet</p>
          <p className="text-xs text-text-muted mb-5 max-w-xs mx-auto leading-relaxed">
            Add your first contact and Cadence will tell you exactly what to do and when.
          </p>
          <Link
            href="/contacts/new"
            className="inline-flex items-center text-xs font-semibold bg-accent-blue-muted text-[var(--c-accent)] px-4 py-2 rounded-lg hover:bg-accent-blue-hover transition-colors"
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
      <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Today&apos;s Moves</h2>
          <span className="text-xs font-semibold text-[#22C55E] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] px-2 py-0.5 rounded-full">
            Clear
          </span>
        </div>
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-text-primary mb-1">Queue is clear</p>
          <p className="text-xs text-text-muted">
            No follow-ups, no cold contacts, no stale deals.{' '}
            <Link href="/contacts/new" className="text-[var(--c-accent)] hover:opacity-80">
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
    <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Today&apos;s Moves</h2>
        <span className="text-xs text-text-secondary">
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
