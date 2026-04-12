'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface ContactRow {
  name: string
  company: string
  role: string
}

export interface JobRow {
  title: string
  status: string
}

export interface ImportResult {
  contacts: number
  jobs: number
  error?: string
}

const VALID_STATUSES = ['networking', 'applied', 'interviewing', 'offer', 'rejected']

function clean(s: string, max = 500): string {
  return s.trim().slice(0, max)
}

export async function bulkImport(
  contactRows: ContactRow[],
  jobRows: JobRow[],
): Promise<ImportResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let contacts = 0
  let jobs = 0

  const validContacts = contactRows
    .filter(r => r.name.trim())
    .map(r => ({
      user_id: user.id,
      name: clean(r.name),
      company: clean(r.company) || null,
      role: clean(r.role) || null,
      tags: [] as string[],
    }))

  if (validContacts.length > 0) {
    const { error } = await supabase.from('contacts').insert(validContacts)
    if (error) return { contacts: 0, jobs: 0, error: 'Failed to import contacts: ' + error.message }
    contacts = validContacts.length
  }

  const validJobs = jobRows
    .filter(r => r.title.trim())
    .map(r => ({
      user_id: user.id,
      title: clean(r.title),
      type: 'job' as const,
      status: VALID_STATUSES.includes(r.status) ? r.status : 'networking',
    }))

  if (validJobs.length > 0) {
    const { error } = await supabase.from('opportunities').insert(validJobs)
    if (error) return { contacts, jobs: 0, error: 'Failed to import jobs: ' + error.message }
    jobs = validJobs.length
  }

  revalidatePath('/contacts')
  revalidatePath('/opportunities')
  revalidatePath('/dashboard')

  return { contacts, jobs }
}
