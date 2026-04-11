'use client'

import { useTransition } from 'react'
import type { TaskWithRelations } from '@/types'
import { completeTask, deleteTask } from '@/app/(protected)/tasks/actions'
import { formatDate, isOverdue, isDueToday } from '@/lib/utils/dates'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

export function TaskCard({ task }: { task: TaskWithRelations }) {
  const [isPending, startTransition] = useTransition()
  const overdue = isOverdue(task.due_date)
  const today = isDueToday(task.due_date)

  return (
    <div className={cn(
      'c-card-p flex items-start gap-3 transition-opacity',
      overdue && 'border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.04)]',
      today && !overdue && 'border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.03)]',
      isPending && 'opacity-40 pointer-events-none'
    )}>
      {/* Complete button */}
      <button
        onClick={() => startTransition(() => completeTask(task.id))}
        disabled={isPending}
        className={cn(
          'mt-0.5 w-4 h-4 rounded border shrink-0 transition-colors',
          overdue
            ? 'border-[rgba(248,113,113,0.4)] hover:bg-[rgba(248,113,113,0.15)]'
            : 'border-border-strong hover:border-[#4F7AFF] hover:bg-[rgba(79,122,255,0.1)]'
        )}
        title="Mark complete"
      />

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium leading-snug',
          overdue ? 'text-[#F87171]' : 'text-text-primary'
        )}>
          {task.title}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {task.due_date && (
            <span className={cn(
              'text-xs',
              overdue ? 'text-[#F87171] font-medium'
                : today ? 'text-[#FBBF24] font-medium'
                : 'text-text-muted'
            )}>
              {overdue ? 'Overdue · ' : today ? 'Due today · ' : 'Due '}{formatDate(task.due_date)}
            </span>
          )}
          {task.contacts && (
            <Link
              href={`/contacts/${task.linked_contact_id}`}
              className="text-xs text-[#4F7AFF] hover:text-[#7A9BFF] transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {task.contacts.name}
            </Link>
          )}
          {task.opportunities && (
            <Link
              href={`/opportunities/${task.linked_opportunity_id}`}
              className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {task.opportunities.title}
            </Link>
          )}
        </div>
      </div>

      <button
        onClick={() => startTransition(() => deleteTask(task.id))}
        disabled={isPending}
        className="text-xs text-[#383850] hover:text-[#F87171] transition-colors shrink-0 mt-0.5"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  )
}
