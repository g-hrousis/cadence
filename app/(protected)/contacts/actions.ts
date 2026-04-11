'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFollowUpConfig } from '@/lib/utils/followup'
import type { Channel, Outcome } from '@/lib/utils/followup'

// ─── Validation helpers ───────────────────────────────────────────────────────
const VALID_CHANNELS: Channel[] = ['linkedin', 'email', 'call', 'in_person']
const VALID_OUTCOMES: Outcome[] = ['no_response', 'responded', 'follow_up_needed']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function str(val: FormDataEntryValue | null, max = 500): string {
  return ((val as string) ?? '').trim().slice(0, max)
}

function strOrNull(val: FormDataEntryValue | null, max = 500): string | null {
  const s = str(val, max)
  return s || null
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = str(formData.get('name'))
  if (!name) throw new Error('Name is required')

  const tagsRaw = str(formData.get('tags'), 1000)
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 20)

  const { error } = await supabase.from('contacts').insert({
    user_id: user.id,
    name,
    email: strOrNull(formData.get('email'), 254),
    company: strOrNull(formData.get('company')),
    role: strOrNull(formData.get('role')),
    tags,
    notes: str(formData.get('notes'), 5000),
  })

  if (error) throw new Error('Failed to create contact')

  revalidatePath('/contacts')
  redirect('/contacts')
}

export async function updateContact(id: string, formData: FormData) {
  if (!UUID_RE.test(id)) throw new Error('Invalid ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = str(formData.get('name'))
  if (!name) throw new Error('Name is required')

  const tagsRaw = str(formData.get('tags'), 1000)
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 20)

  const { error } = await supabase.from('contacts').update({
    name,
    email: strOrNull(formData.get('email'), 254),
    company: strOrNull(formData.get('company')),
    role: strOrNull(formData.get('role')),
    tags,
    notes: str(formData.get('notes'), 5000),
  }).eq('id', id).eq('user_id', user.id)

  if (error) throw new Error('Failed to update contact')

  revalidatePath(`/contacts/${id}`)
  redirect(`/contacts/${id}`)
}

export async function deleteContact(id: string) {
  if (!UUID_RE.test(id)) throw new Error('Invalid ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('contacts').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw new Error('Failed to delete contact')

  revalidatePath('/contacts')
  redirect('/contacts')
}

export async function addInteraction(contactId: string, formData: FormData) {
  if (!UUID_RE.test(contactId)) throw new Error('Invalid contact ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rawChannel = str(formData.get('channel')) as Channel
  const rawOutcome = str(formData.get('outcome')) as Outcome
  const channel: Channel = VALID_CHANNELS.includes(rawChannel) ? rawChannel : 'email'
  const outcome: Outcome = VALID_OUTCOMES.includes(rawOutcome) ? rawOutcome : 'responded'

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
    notes: str(formData.get('notes'), 5000),
  })
  if (interactionError) throw new Error('Failed to log interaction')

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
