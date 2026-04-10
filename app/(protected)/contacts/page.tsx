import { createClient } from '@/lib/supabase/server'
import { ContactCard } from '@/components/contacts/ContactCard'
import Link from 'next/link'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{contacts?.length ?? 0} people in your network</p>
        </div>
        <Link
          href="/contacts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add contact
        </Link>
      </div>

      {!contacts || contacts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No contacts yet. Start by adding someone from your network.</p>
          <Link
            href="/contacts/new"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
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
