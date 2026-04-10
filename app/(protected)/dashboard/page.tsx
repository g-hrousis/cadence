import { createClient } from '@/lib/supabase/server'
import type { TaskWithRelations, InteractionWithContact, Contact, Opportunity } from '@/types'
import { TaskCard } from '@/components/tasks/TaskCard'
import { ContactCard } from '@/components/contacts/ContactCard'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import { Badge } from '@/components/ui/Badge'
import { channelLabel, outcomeLabel, outcomeVariant } from '@/lib/utils/labels'
import { formatRelative, isOverdue, isDueToday, isGoingCold } from '@/lib/utils/dates'
import Link from 'next/link'

function EmptySection({ message, href, linkText }: { message: string; href?: string; linkText?: string }) {
  return (
    <p className="text-sm text-gray-400 py-2">
      {message}{' '}
      {href && linkText && (
        <Link href={href} className="text-blue-600 hover:underline">{linkText}</Link>
      )}
    </p>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: allTasks },
    { data: allContacts },
    { data: allOpportunities },
    { data: recentInteractions },
  ] = await Promise.all([
    supabase
      .from('tasks')
      .select('*, contacts(name), opportunities(title)')
      .eq('status', 'pending')
      .order('due_date', { ascending: true, nullsFirst: false }),
    supabase.from('contacts').select('*'),
    supabase
      .from('opportunities')
      .select('*, opportunity_contacts(contact_id)')
      .not('status', 'in', '("offer","rejected")'),
    supabase
      .from('interactions')
      .select('*, contacts(name)')
      .order('date', { ascending: false })
      .limit(5),
  ])

  const tasks = (allTasks ?? []) as TaskWithRelations[]
  const contacts = (allContacts ?? []) as Contact[]
  const opportunities = allOpportunities ?? []
  const interactions = (recentInteractions ?? []) as InteractionWithContact[]

  const overdueTasks = tasks.filter(t => isOverdue(t.due_date))
  const todayTasks = tasks.filter(t => isDueToday(t.due_date))
  const coldContacts = contacts.filter(c => isGoingCold(c.last_contacted))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">What needs your attention today</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Overdue follow-ups */}
          <div className="card border-red-100">
            <p className="section-title text-red-500">
              Overdue ({overdueTasks.length})
            </p>
            {overdueTasks.length === 0 ? (
              <EmptySection message="No overdue tasks." />
            ) : (
              <div className="space-y-2">
                {overdueTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Due today */}
          <div className="card">
            <p className="section-title">Due Today ({todayTasks.length})</p>
            {todayTasks.length === 0 ? (
              <EmptySection message="Nothing due today." />
            ) : (
              <div className="space-y-2">
                {todayTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Going cold */}
          <div className="card">
            <p className="section-title">Going Cold ({coldContacts.length})</p>
            {coldContacts.length === 0 ? (
              <EmptySection message="All contacts are warm." />
            ) : (
              <div className="space-y-2">
                {coldContacts.slice(0, 5).map(contact => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
                {coldContacts.length > 5 && (
                  <Link href="/contacts" className="text-xs text-blue-600 hover:underline">
                    +{coldContacts.length - 5} more
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Active opportunities */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="section-title mb-0">Active Opportunities ({opportunities.length})</p>
              <Link href="/opportunities" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            {opportunities.length === 0 ? (
              <EmptySection message="No active opportunities." href="/opportunities/new" linkText="Add one" />
            ) : (
              <div className="space-y-2">
                {opportunities.slice(0, 5).map(opp => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={{ ...opp, contact_count: opp.opportunity_contacts?.length ?? 0 }}
                  />
                ))}
                {opportunities.length > 5 && (
                  <Link href="/opportunities" className="text-xs text-blue-600 hover:underline">
                    +{opportunities.length - 5} more
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Recent interactions */}
          <div className="card">
            <p className="section-title">Recent Interactions</p>
            {interactions.length === 0 ? (
              <EmptySection message="No interactions yet." href="/contacts" linkText="View contacts" />
            ) : (
              <div className="space-y-3">
                {interactions.map(interaction => (
                  <div key={interaction.id} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {interaction.contacts?.name ?? 'Unknown'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-500">{channelLabel(interaction.channel)}</span>
                        <Badge variant={outcomeVariant(interaction.outcome)}>
                          {outcomeLabel(interaction.outcome)}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{formatRelative(interaction.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
