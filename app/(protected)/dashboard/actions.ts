'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function completeTaskFromFeed(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId)
    .eq('user_id', user.id)

  if (error) throw new Error(`Failed to complete task: ${error.message}`)

  revalidatePath('/dashboard')
  revalidatePath('/tasks')
}

export async function snoozeTask(taskId: string, days: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Guard: days must be positive
  const safeDays = Math.max(1, days)
  const snoozeUntil = new Date()
  snoozeUntil.setDate(snoozeUntil.getDate() + safeDays)

  const { error } = await supabase
    .from('tasks')
    .update({ snoozed_until: snoozeUntil.toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)

  if (error) throw new Error(`Failed to snooze task: ${error.message}`)

  revalidatePath('/dashboard')
}

export async function snoozeContact(contactId: string, days: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const safeDays = Math.max(1, days)
  const snoozeUntil = new Date()
  snoozeUntil.setDate(snoozeUntil.getDate() + safeDays)

  // next_follow_up is the snooze mechanism — contact won't resurface in feed until this date
  const { error } = await supabase
    .from('contacts')
    .update({ next_follow_up: snoozeUntil.toISOString() })
    .eq('id', contactId)
    .eq('user_id', user.id)

  if (error) throw new Error(`Failed to snooze contact: ${error.message}`)

  revalidatePath('/dashboard')
}

export async function markOpportunityChecked(opportunityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Touch updated_at — resets the stale timer in the feed
  const { error } = await supabase
    .from('opportunities')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', opportunityId)
    .eq('user_id', user.id)

  if (error) throw new Error(`Failed to update opportunity: ${error.message}`)

  revalidatePath('/dashboard')
}
