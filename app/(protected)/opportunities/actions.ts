'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOpportunity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: opp, error } = await supabase.from('opportunities').insert({
    user_id: user.id,
    title: formData.get('title') as string,
    type: formData.get('type') as string,
    status: (formData.get('status') as string) || 'networking',
  }).select().single()

  if (error) throw new Error(error.message)

  // Link contacts
  const contactIds = formData.getAll('contact_ids') as string[]
  if (contactIds.length > 0) {
    await supabase.from('opportunity_contacts').insert(
      contactIds.map(cid => ({ opportunity_id: opp.id, contact_id: cid }))
    )
  }

  revalidatePath('/opportunities')
  redirect('/opportunities')
}

export async function updateOpportunity(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('opportunities').update({
    title: formData.get('title') as string,
    type: formData.get('type') as string,
    status: formData.get('status') as string,
  }).eq('id', id).eq('user_id', user.id)

  if (error) throw new Error(error.message)

  // Re-sync linked contacts
  await supabase.from('opportunity_contacts').delete().eq('opportunity_id', id)
  const contactIds = formData.getAll('contact_ids') as string[]
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('opportunities').update({ status }).eq('id', id).eq('user_id', user.id)

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
