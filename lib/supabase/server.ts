import { createClient as _createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return _createClient(cookieStore)
}
