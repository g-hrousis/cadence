import { createClient } from '@/lib/supabase/server'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'

export default async function NewOpportunityPage() {
  const supabase = await createClient()
  const { data: contacts } = await supabase.from('contacts').select('*').order('name')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Opportunity</h1>
      <OpportunityForm contacts={contacts ?? []} />
    </div>
  )
}
