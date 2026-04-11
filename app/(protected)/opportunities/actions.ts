'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── Allowed enum values ──────────────────────────────────────────────────────
const VALID_TYPES   = ['job', 'referral', 'coffee_chat', 'interview'] as const
const VALID_STATUSES = ['networking', 'applied', 'interviewing', 'offer', 'rejected'] as const
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type OppType   = typeof VALID_TYPES[number]
type OppStatus = typeof VALID_STATUSES[number]

function validateType(val: unknown): OppType {
  if (VALID_TYPES.includes(val as OppType)) return val as OppType
  throw new Error('Invalid opportunity type')
}

function validateStatus(val: unknown): OppStatus {
  if (VALID_STATUSES.includes(val as OppStatus)) return val as OppStatus
  throw new Error('Invalid opportunity status')
}

function sanitizeContactIds(raw: string[]): string[] {
  const ids = raw.map(s => s.trim()).filter(Boolean)
  if (ids.some(id => !UUID_RE.test(id))) throw new Error('Invalid contact ID')
  return ids
}

function str(val: FormDataEntryValue | null, max = 500): string {
  return ((val as string) ?? '').trim().slice(0, max)
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createOpportunity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title  = str(formData.get('title'))
  const type   = validateType(str(formData.get('type')))
  const status = validateStatus(str(formData.get('status')) || 'networking')

  if (!title) throw new Error('Title is required')

  const { data: opp, error } = await supabase.from('opportunities').insert({
    user_id: user.id,
    title,
    type,
    status,
  }).select().single()

  if (error) throw new Error('Failed to create opportunity')

  const contactIds = sanitizeContactIds(formData.getAll('contact_ids') as string[])
  if (contactIds.length > 0) {
    await supabase.from('opportunity_contacts').insert(
      contactIds.map(cid => ({ opportunity_id: opp.id, contact_id: cid }))
    )
  }

  revalidatePath('/opportunities')
  redirect('/opportunities')
}

export async function updateOpportunity(id: string, formData: FormData) {
  if (!UUID_RE.test(id)) throw new Error('Invalid ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title  = str(formData.get('title'))
  const type   = validateType(str(formData.get('type')))
  const status = validateStatus(str(formData.get('status')))

  if (!title) throw new Error('Title is required')

  const { error } = await supabase.from('opportunities').update({ title, type, status })
    .eq('id', id).eq('user_id', user.id)

  if (error) throw new Error('Failed to update opportunity')

  // Re-sync linked contacts
  await supabase.from('opportunity_contacts').delete().eq('opportunity_id', id)
  const contactIds = sanitizeContactIds(formData.getAll('contact_ids') as string[])
  if (contactIds.length > 0) {
    await supabase.from('opportunity_contacts').insert(
      contactIds.map(cid => ({ opportunity_id: id, contact_id: cid }))
    )
  }

  revalidatePath('/opportunities')
  revalidatePath(`/opportunities/${id}`)
  redirect(`/opportunities/${id}`)
}

export async function updateOpportunityStatus(id: string, status: string) {
  if (!UUID_RE.test(id)) throw new Error('Invalid ID')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const validStatus = validateStatus(status)
  await supabase.from('opportunities').update({ status: validStatus }).eq('id', id).eq('user_id', user.id)

  revalidatePath('/opportunities')
}

export async function deleteOpportunity(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('opportunities').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/opportunities')
  redirect('/opportunities')
}
