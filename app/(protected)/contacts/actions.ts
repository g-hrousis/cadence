'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

  const { error: interactionError } = await supabase.from('interactions').insert({
    user_id: user.id,
    contact_id: contactId,
    date: (formData.get('date') as string) || new Date().toISOString(),
    channel: formData.get('channel') as string,
    outcome: formData.get('outcome') as string,
    notes: (formData.get('notes') as string) || '',
  })

  if (interactionError) throw new Error(interactionError.message)

  // Auto-update last_contacted and suggest next follow-up in 7 days
  const nextFollowUp = new Date()
  nextFollowUp.setDate(nextFollowUp.getDate() + 7)

  await supabase.from('contacts').update({
    last_contacted: new Date().toISOString(),
    next_follow_up: nextFollowUp.toISOString(),
  }).eq('id', contactId).eq('user_id', user.id)

  revalidatePath(`/contacts/${contactId}`)
}
