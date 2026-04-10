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
      'card flex items-start gap-3',
      overdue && 'border-red-200 bg-red-50',
      today && !overdue && 'border-yellow-200 bg-yellow-50'
    )}>
      <button
        onClick={() => startTransition(() => completeTask(task.id))}
        disabled={isPending}
        className="mt-0.5 w-4 h-4 rounded border border-gray-400 hover:border-blue-500 hover:bg-blue-50 shrink-0 transition-colors disabled:opacity-50"
        title="Mark complete"
      />

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-gray-900', overdue && 'text-red-700')}>
          {task.title}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {task.due_date && (
            <span className={cn(
              'text-xs',
              overdue ? 'text-red-600 font-medium' : today ? 'text-yellow-700 font-medium' : 'text-gray-400'
            )}>
              {overdue ? 'Overdue · ' : today ? 'Due today · ' : 'Due '}{formatDate(task.due_date)}
            </span>
          )}
          {task.contacts && (
            <Link
              href={`/contacts/${task.linked_contact_id}`}
              className="text-xs text-blue-600 hover:underline"
              onClick={e => e.stopPropagation()}
            >
              {task.contacts.name}
            </Link>
          )}
          {task.opportunities && (
            <Link
              href={`/opportunities/${task.linked_opportunity_id}`}
              className="text-xs text-purple-600 hover:underline"
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
        className="text-xs text-gray-300 hover:text-red-400 transition-colors shrink-0"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  )
}
