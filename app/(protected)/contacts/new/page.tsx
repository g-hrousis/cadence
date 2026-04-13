import Link from 'next/link'
import { NewContactClient } from '@/components/contacts/NewContactClient'

export default function NewContactPage() {
  return (
    <div className="max-w-lg">
      <Link href="/contacts" className="text-xs text-text-dim hover:text-text-secondary mb-4 block transition-colors">
        ← Contacts
      </Link>
      <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-6">Add Contact</h1>
      <NewContactClient />
    </div>
  )
}
