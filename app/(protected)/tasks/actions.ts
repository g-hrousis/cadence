'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function validUuidOrNull(val: string | null): string | null {
  if (!val) return null
  return UUID_RE.test(val) ? val : null
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = ((formData.get('title') as string) ?? '').trim().slice(0, 500)
  if (!title) throw new Error('Title is required')

  const dueDateRaw = (formData.get('due_date') as string)?.trim()
  const parsedDue = dueDateRaw ? new Date(dueDateRaw) : null
  const dueDate = parsedDue && !isNaN(parsedDue.getTime()) ? parsedDue.toISOString() : null

  const contactId    = validUuidOrNull((formData.get('linked_contact_id') as string) || null)
  const opportunityId = validUuidOrNull((formData.get('linked_opportunity_id') as string) || null)

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title,
    due_date: dueDate,
    linked_contact_id: contactId,
    linked_opportunity_id: opportunityId,
  })

  if (error) throw new Error('Failed to create task')

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function completeTask(id: string) {
  if (!UUID_RE.test(id)) throw new Error('Invalid ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tasks').update({ status: 'completed' }).eq('id', id).eq('user_id', user.id)

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  if (!UUID_RE.test(id)) throw new Error('Invalid ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}
