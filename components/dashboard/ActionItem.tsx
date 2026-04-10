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

// ─── Type icons ───────────────────────────────────────────────────────────────

function TaskIcon({ overdue }: { overdue?: boolean }) {
  return (
    <div className={cn(
      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
      overdue ? 'bg-[rgba(248,113,113,0.1)]' : 'bg-[rgba(251,191,36,0.08)]'
    )}>
      <svg
        className={cn('w-3.5 h-3.5', overdue ? 'text-[#F87171]' : 'text-[#FBBF24]')}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    </div>
  )
}

function ContactIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-[rgba(79,122,255,0.1)] flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-[#4F7AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  )
}

function OpportunityIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-[rgba(167,139,250,0.1)] flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  )
}

function itemIcon(type: ActionType) {
  if (type === 'overdue_task') return <TaskIcon overdue />
  if (type === 'due_today_task' || type === 'due_soon_task') return <TaskIcon />
  if (type === 'cold_contact' || type === 'never_contacted') return <ContactIcon />
  return <OpportunityIcon />
}

// ─── CTA labels ──────────────────────────────────────────────────────────────

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
  const [exiting, setExiting] = useState(false)
  const [, setFeedbackLabel] = useState<string | null>(null)

  const isTask       = item.type === 'overdue_task' || item.type === 'due_today_task' || item.type === 'due_soon_task'
  const isContact    = item.type === 'cold_contact' || item.type === 'never_contacted'
  const isOpportunity = item.type === 'stale_opportunity'
  const isOverdue    = item.type === 'overdue_task'

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
      if (item.taskId)        return snoozeTask(item.taskId, 3)
      if (item.contactId)     return snoozeContact(item.contactId, 3)
      if (item.opportunityId) return markOpportunityChecked(item.opportunityId)
    })
  }

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden',
        exiting ? 'opacity-0 max-h-0 !py-0 !border-0' : 'opacity-100 max-h-48',
        'flex items-start gap-3 px-5 py-3.5 border-b border-[rgba(255,255,255,0.05)] last:border-0',
        isPending && !exiting && 'opacity-60'
      )}
    >
      {/* Type icon */}
      <div className="mt-0.5">{itemIcon(item.type)}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-[#EDEDF2] leading-snug">{item.headline}</p>
          {isOverdue && (
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-[rgba(248,113,113,0.15)] text-[#F87171] border border-[rgba(248,113,113,0.2)] shrink-0">
              Overdue
            </span>
          )}
        </div>
        <p className="text-xs text-[#8888A8] mt-0.5">{item.subtext}</p>

        {/* CTAs */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {isTask && item.taskId && (
            <button
              onClick={handleComplete}
              className="inline-flex items-center text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-3 py-1.5 rounded-md hover:bg-[#162254] active:scale-95 transition-all"
            >
              {ctaLabel[item.type]}
            </button>
          )}

          {isContact && item.contactId && (
            <Link
              href={`/contacts/${item.contactId}`}
              className="inline-flex items-center text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-3 py-1.5 rounded-md hover:bg-[#162254] active:scale-95 transition-all"
            >
              {ctaLabel[item.type]}
            </Link>
          )}

          {isOpportunity && item.opportunityId && (
            <button
              onClick={handleMarkActive}
              className="inline-flex items-center text-xs font-semibold bg-[#0F1940] text-[#4F7AFF] px-3 py-1.5 rounded-md hover:bg-[#162254] active:scale-95 transition-all"
            >
              {ctaLabel[item.type]}
            </button>
          )}

          {isTask && item.contactId && (
            <Link
              href={`/contacts/${item.contactId}`}
              className="text-xs text-[#8888A8] hover:text-[#9898B8] font-medium px-2 py-1.5 transition-colors"
            >
              {item.contactName}
            </Link>
          )}

          {isOpportunity && item.opportunityId && (
            <Link
              href={`/opportunities/${item.opportunityId}`}
              className="text-xs text-[#8888A8] hover:text-[#9898B8] font-medium px-2 py-1.5 transition-colors"
            >
              View
            </Link>
          )}

          <button
            onClick={handleSnooze}
            className="text-xs text-[#484860] hover:text-[#8888A8] px-2 py-1.5 transition-colors ml-auto"
          >
            Snooze 3d
          </button>
        </div>
      </div>
    </div>
  )
}
