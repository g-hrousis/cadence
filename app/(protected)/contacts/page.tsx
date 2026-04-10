import { createClient } from '@/lib/supabase/server'
import { ContactCard } from '@/components/contacts/ContactCard'
import Link from 'next/link'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('name')

  const count = contacts?.length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#EDEDF2] tracking-tight">Contacts</h1>
          <p className="text-sm text-[#8888A8] mt-0.5">{count} {count === 1 ? 'person' : 'people'} in your network</p>
        </div>
        <Link
          href="/contacts/new"
          className="bg-[#0F1940] hover:bg-[#162254] text-[#4F7AFF] text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add contact
        </Link>
      </div>

      {!contacts || contacts.length === 0 ? (
        <div className="c-card-p text-center py-12">
          <p className="text-[#6A6A88] text-sm mb-4">No contacts yet. Start by adding someone from your network.</p>
          <Link href="/contacts/new" className="text-[#4F7AFF] hover:text-[#7A9BFF] text-sm font-medium">
            Add your first contact
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  )
}
