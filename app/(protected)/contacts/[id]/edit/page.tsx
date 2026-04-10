import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contacts/ContactForm'

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: contact } = await supabase.from('contacts').select('*').eq('id', id).single()

  if (!contact) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Contact</h1>
      <ContactForm contact={contact} />
    </div>
  )
}
