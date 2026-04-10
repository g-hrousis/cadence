import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: opportunity }, { data: contacts }] = await Promise.all([
    supabase
      .from('opportunities')
      .select('*, opportunity_contacts(contact_id)')
      .eq('id', id)
      .single(),
    supabase.from('contacts').select('*').order('name'),
  ])

  if (!opportunity) notFound()

  const linkedContactIds = opportunity.opportunity_contacts?.map(
    (oc: { contact_id: string }) => oc.contact_id
  ) ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Opportunity</h1>
      <OpportunityForm
        opportunity={opportunity}
        contacts={contacts ?? []}
        linkedContactIds={linkedContactIds}
      />
    </div>
  )
}
