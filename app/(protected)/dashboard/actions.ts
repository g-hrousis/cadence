'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function completeTaskFromFeed(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
}

export async function snoozeTask(taskId: string, days: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const snoozeUntil = new Date()
  snoozeUntil.setDate(snoozeUntil.getDate() + days)

  await supabase
    .from('tasks')
    .update({ snoozed_until: snoozeUntil.toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
}

export async function snoozeContact(contactId: string, days: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const snoozeUntil = new Date()
  snoozeUntil.setDate(snoozeUntil.getDate() + days)

  // Use next_follow_up as the snooze mechanism — contact won't appear in feed until this date
  await supabase
    .from('contacts')
    .update({ next_follow_up: snoozeUntil.toISOString() })
    .eq('id', contactId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
}

export async function markOpportunityChecked(opportunityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Touch updated_at to reset the stale timer
  await supabase
    .from('opportunities')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', opportunityId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
}
