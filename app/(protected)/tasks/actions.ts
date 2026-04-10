'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dueDateRaw = formData.get('due_date') as string
  const contactId = formData.get('linked_contact_id') as string
  const opportunityId = formData.get('linked_opportunity_id') as string

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title: formData.get('title') as string,
    due_date: dueDateRaw ? new Date(dueDateRaw).toISOString() : null,
    linked_contact_id: contactId || null,
    linked_opportunity_id: opportunityId || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function completeTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tasks').update({ status: 'completed' }).eq('id', id).eq('user_id', user.id)

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/tasks')
  revalidatePath('/dashboard')
}
