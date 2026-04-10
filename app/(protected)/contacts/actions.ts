'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFollowUpConfig } from '@/lib/utils/followup'
import type { Channel, Outcome } from '@/lib/utils/followup'

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tagsRaw = (formData.get('tags') as string) ?? ''
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

  const { error } = await supabase.from('contacts').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    email: (formData.get('email') as string) || null,
    company: (formData.get('company') as string) || null,
    role: (formData.get('role') as string) || null,
    tags,
    notes: (formData.get('notes') as string) || '',
  })

  if (error) throw new Error(error.message)

  revalidatePath('/contacts')
  redirect('/contacts')
}

export async function updateContact(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tagsRaw = (formData.get('tags') as string) ?? ''
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

  const { error } = await supabase.from('contacts').update({
    name: formData.get('name') as string,
    email: (formData.get('email') as string) || null,
    company: (formData.get('company') as string) || null,
    role: (formData.get('role') as string) || null,
    tags,
    notes: (formData.get('notes') as string) || '',
  }).eq('id', id).eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(`/contacts/${id}`)
  redirect(`/contacts/${id}`)
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('contacts').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/contacts')
  redirect('/contacts')
}

export async function addInteraction(contactId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const channel = (formData.get('channel') as Channel) || 'email'
  const outcome = (formData.get('outcome') as Outcome) || 'responded'

  // Use the recorded interaction date — not necessarily now.
  // Fall back to now() if the date field is missing or unparseable.
  const rawDate = (formData.get('date') as string)?.trim()
  const parsedDate = rawDate ? new Date(rawDate) : null
  const interactionDate = (parsedDate && !isNaN(parsedDate.getTime()))
    ? parsedDate.toISOString()
    : new Date().toISOString()
  const interactionDateObj = new Date(interactionDate)

  // Fetch contact to get their name + cadence preference
  const { data: contact } = await supabase
    .from('contacts')
    .select('name, contact_cadence_days')
    .eq('id', contactId)
    .eq('user_id', user.id)
    .single()

  const contactName = contact?.name || 'contact'
  // Guard: cadence must be at least 1 day to avoid contacts always appearing cold
  const cadenceDays = Math.max(1, contact?.contact_cadence_days ?? 14)

  // next_follow_up = interaction date + contact's cadence.
  // This drives the warmth score and cold-contact feed logic.
  const nextFollowUp = new Date(interactionDateObj)
  nextFollowUp.setDate(nextFollowUp.getDate() + cadenceDays)

  // Dynamic follow-up config based on channel × outcome
  const followUp = getFollowUpConfig(channel, outcome)

  // 1. Insert interaction
  const { error: interactionError } = await supabase.from('interactions').insert({
    user_id: user.id,
    contact_id: contactId,
    date: interactionDate,
    channel,
    outcome,
    notes: (formData.get('notes') as string) || '',
  })
  if (interactionError) throw new Error(interactionError.message)

  // 2. Update contact — last_contacted uses the actual interaction date
  await supabase.from('contacts').update({
    last_contacted: interactionDate,
    next_follow_up: nextFollowUp.toISOString(),
  }).eq('id', contactId).eq('user_id', user.id)

  // 3. Auto-create follow-up task — timing and title driven by channel × outcome config
  if (followUp.createTask) {
    const taskDue = new Date(interactionDateObj)
    taskDue.setDate(taskDue.getDate() + followUp.days)

    await supabase.from('tasks').insert({
      user_id: user.id,
      title: followUp.taskTitle(contactName),
      due_date: taskDue.toISOString(),
      linked_contact_id: contactId,
      source: 'auto_follow_up',
      status: 'pending',
    })
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath('/dashboard')
  revalidatePath('/tasks')
}
