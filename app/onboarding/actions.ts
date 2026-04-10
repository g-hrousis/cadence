'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function saveProfile(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) redirect('/login')

  const values = {
    id: user.id,
    first_name: (formData.get('first_name') as string)?.trim() || null,
    last_name: (formData.get('last_name') as string)?.trim() || null,
    targeted_job: (formData.get('targeted_job') as string)?.trim() || null,
    industry: (formData.get('industry') as string)?.trim() || null,
  }

  const { error } = await supabase.from('profiles').upsert(values, { onConflict: 'id' })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
