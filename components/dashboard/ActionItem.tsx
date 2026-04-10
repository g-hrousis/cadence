'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ActionItem as ActionItemType, ActionType } from '@/types'
import {
  completeTaskFromFeed,
  snoozeTask,
  snoozeContact,
  markOpportunityChecked,
} from '@/app/(protected)/dashboard/actions'

// ─── Priority dot color ───────────────────────────────────────────────────────

const priorityDot: Record<number, string> = {
  1: 'bg-[#F87171]',
  2: 'bg-[#FBBF24]',
  3: 'bg-[#4F7AFF]',
  4: 'bg-[#585870]',
}

// ─── Prescribed CTA per type — the system tells you what to do ───────────────

const ctaLabel: Record<ActionType, string> = {
  overdue_task:      'Mark done',
  due_today_task:    'Mark done',
  due_soon_task:     'Mark done',
  never_contacted:   'Reach out',
  cold_contact:      'Send follow-up',
  stale_opportunity: 'Check status',
}

interface ActionItemProps {
  item: ActionItemType
}

export function ActionItem({ item }: ActionItemProps) {
  const [isPending, startTransition] = useTransition()
  // Optimistic exit: animate item out immediately on any action
  const [exiting, setExiting] = useState(false)
  const [feedbackLabel, setFeedbackLabel] = useState<string | null>(null)

  const dot = priorityDot[item.priority] ?? priorityDot[4]

  const isTask = item.type === 'overdue_task' || item.type === 'due_today_task' || item.type === 'due_soon_task'
  const isContact = item.type === 'cold_contact' || item.type === 'never_contacted'
  const isOpportunity = item.type === 'stale_opportunity'

  // Animate out then fire server action.
  // Guard prevents double-clicks from firing the action twice.
  function exit(label: string, action: () => void) {
    if (exiting || isPending) return
    setFeedbackLabel(label)
    setExiting(true)
    startTransition(action)
  }

  function handleComplete() {
    if (!item.taskId) return
    exit('Done', () => completeTaskFromFeed(item.taskId!))
  }

  function handleMarkActive() {
    if (!item.opportunityId) return
    exit('Marked active', () => markOpportunityChecked(item.opportunityId!))
  }

  function handleSnooze() {
    exit('Snoozed', () => {
      if (item.taskId) return snoozeTask(item.taskId, 3)
      if (item.contactId) return snoozeContact(item.contactId, 3)
      if (item.opportunityId) return markOpportunityChecked(item.opportunityId)
    })
  }

  return (
    <div
      className={cn(
        // Slide-out: opacity + max-height transition gives a "clearing the queue" feel
        'transition-all duration-300 ease-in-out overflow-hidden',
        exiting ? 'opacity-0 max-h-0 !py-0 !border-0' : 'opacity-100 max-h-48',
        'flex items-start gap-3 px-5 py-4 border-b border-[rgba(255,255,255,0.05)] last:border-0',
        isPending && !exiting && 'opacity-60'
      )}
    >
      {/* Priority dot */}
      <span className={cn('w-1.5 h-1.5 rounded-full mt-[5px] shrink-0', dot)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#EDEDF2] leading-snug">{item.headline}</p>
        <p className="text-xs text-[#8888A8] mt-0.5">{item.subtext}</p>

        {/* CTAs */}
        <div className="flex items-center gap-2 mt-2.5 flex-wrap">

          {/* PRIMARY CTA — prescribed by item type */}
          {isTask && item.taskId && (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-3 py-1.5 rounded-md hover:bg-[#162254] active:scale-95 transition-all"
            >
              {ctaLabel[item.type]}
            </button>
          )}

          {isContact && item.contactId && (
            <Link
              href={`/contacts/${item.contactId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-3 py-1.5 rounded-md hover:bg-[#162254] active:scale-95 transition-all"
            >
              {ctaLabel[item.type]}
            </Link>
          )}

          {isOpportunity && item.opportunityId && (
            <button
              onClick={handleMarkActive}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-3 py-1.5 rounded-md hover:bg-[#162254] active:scale-95 transition-all"
            >
              {ctaLabel[item.type]}
            </button>
          )}

          {/* SECONDARY: contact link for tasks */}
          {isTask && item.contactId && (
            <Link
              href={`/contacts/${item.contactId}`}
              className="text-xs text-[#8888A8] hover:text-[#9898B8] font-medium px-2 py-1.5 transition-colors"
            >
              {item.contactName}
            </Link>
          )}

          {/* SECONDARY: view link for opportunities */}
          {isOpportunity && item.opportunityId && (
            <Link
              href={`/opportunities/${item.opportunityId}`}
              className="text-xs text-[#8888A8] hover:text-[#9898B8] font-medium px-2 py-1.5 transition-colors"
            >
              View
            </Link>
          )}

          {/* SNOOZE — always last, always muted */}
          <button
            onClick={handleSnooze}
            className="text-xs text-[#585870] hover:text-[#8888A8] px-2 py-1.5 transition-colors ml-auto"
          >
            Snooze 3d
          </button>
        </div>
      </div>
    </div>
  )
}
