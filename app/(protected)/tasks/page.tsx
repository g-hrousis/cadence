import { createClient } from '@/lib/supabase/server'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import type { TaskWithRelations } from '@/types'

export default async function TasksPage() {
  const supabase = await createClient()

  const [
    { data: tasks },
    { data: contacts },
    { data: opportunities },
  ] = await Promise.all([
    supabase
      .from('tasks')
      .select('*, contacts(name), opportunities(title)')
      .eq('status', 'pending')
      .order('due_date', { ascending: true, nullsFirst: false }),
    supabase.from('contacts').select('*').order('name'),
    supabase.from('opportunities').select('*').order('title'),
  ])

  const count = tasks?.length ?? 0

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Tasks</h1>
        <p className="text-sm text-text-secondary mt-0.5">{count} pending</p>
      </div>

      <div className="mb-6">
        <TaskForm contacts={contacts ?? []} opportunities={opportunities ?? []} />
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="c-card-p text-center py-8">
          <p className="text-text-muted text-sm">No pending tasks. You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(tasks as TaskWithRelations[]).map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
