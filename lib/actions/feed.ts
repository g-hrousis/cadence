import { differenceInDays, isToday, isPast, startOfDay, endOfDay } from 'date-fns'
import type { ActionItem, ActionPriority } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Data fetchers ───────────────────────────────────────────────────────────

async function fetchPendingTasks(supabase: SupabaseClient) {
  const { data } = await supabase
    .from('tasks')
    .select('id, title, due_date, linked_contact_id, linked_opportunity_id, source, contacts(name), opportunities(title)')
    .eq('status', 'pending')
    .or('snoozed_until.is.null,snoozed_until.lt.' + new Date().toISOString())
    .order('due_date', { ascending: true, nullsFirst: false })
  return data ?? []
}

async function fetchColdContacts(supabase: SupabaseClient) {
  const { data } = await supabase
    .from('contacts')
    .select('id, name, company, role, last_contacted, next_follow_up, contact_cadence_days, created_at')
    .or('next_follow_up.is.null,next_follow_up.lt.' + new Date().toISOString())
    .order('last_contacted', { ascending: true, nullsFirst: true })
    .limit(20)
  return data ?? []
}

async function fetchStaleOpportunities(supabase: SupabaseClient) {
  const threshold = new Date()
  threshold.setDate(threshold.getDate() - 14)
  const { data } = await supabase
    .from('opportunities')
    .select('id, title, status, updated_at')
    .not('status', 'in', '("offer","rejected")')
    .lt('updated_at', threshold.toISOString())
    .limit(5)
  return data ?? []
}

// ─── Action builders ─────────────────────────────────────────────────────────

function taskToActionItem(task: {
  id: string
  title: string
  due_date: string | null
  linked_contact_id: string | null
  source: string
  contacts: { name: string } | null
  opportunities: { title: string } | null
}): ActionItem | null {
  if (!task.due_date) return null

  const dueDate = new Date(task.due_date)
  const isOverdue = isPast(dueDate) && !isToday(dueDate)
  const isDueToday = isToday(dueDate)
  const daysUntil = differenceInDays(dueDate, startOfDay(new Date()))

  if (isOverdue) {
    const daysOver = Math.abs(differenceInDays(dueDate, new Date()))
    return {
      id: `task-${task.id}`,
      priority: 1,
      type: 'overdue_task',
      headline: task.title,
      subtext: `${daysOver === 1 ? '1 day' : `${daysOver} days`} overdue${task.contacts ? ` · ${task.contacts.name}` : ''}`,
      taskId: task.id,
      contactId: task.linked_contact_id ?? undefined,
      contactName: task.contacts?.name,
    }
  }

  if (isDueToday) {
    return {
      id: `task-${task.id}`,
      priority: 2,
      type: 'due_today_task',
      headline: task.title,
      subtext: `Due today${task.contacts ? ` · ${task.contacts.name}` : ''}${task.opportunities ? ` · ${task.opportunities.title}` : ''}`,
      taskId: task.id,
      contactId: task.linked_contact_id ?? undefined,
      contactName: task.contacts?.name,
    }
  }

  if (daysUntil <= 3) {
    return {
      id: `task-${task.id}`,
      priority: 3,
      type: 'due_soon_task',
      headline: task.title,
      subtext: `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}${task.contacts ? ` · ${task.contacts.name}` : ''}`,
      taskId: task.id,
      contactId: task.linked_contact_id ?? undefined,
      contactName: task.contacts?.name,
    }
  }

  return null
}

function contactToActionItem(contact: {
  id: string
  name: string
  company: string | null
  role: string | null
  last_contacted: string | null
  contact_cadence_days: number
  created_at: string
}): ActionItem | null {
  const cadence = contact.contact_cadence_days ?? 14
  const context = [contact.role, contact.company].filter(Boolean).join(' at ')

  // Never contacted — added 3+ days ago
  if (!contact.last_contacted) {
    const daysSinceAdded = differenceInDays(new Date(), new Date(contact.created_at))
    if (daysSinceAdded < 3) return null
    return {
      id: `cold-${contact.id}`,
      priority: 2,
      type: 'never_contacted',
      headline: `${contact.name} has never been contacted`,
      subtext: `Added ${daysSinceAdded} days ago${context ? ` · ${context}` : ''}`,
      contactId: contact.id,
      contactName: contact.name,
    }
  }

  const daysSince = differenceInDays(new Date(), new Date(contact.last_contacted))
  if (daysSince < cadence) return null

  return {
    id: `cold-${contact.id}`,
    priority: 3,
    type: 'cold_contact',
    headline: `Reconnect with ${contact.name}`,
    subtext: `${daysSince} days since last contact${context ? ` · ${context}` : ''}`,
    contactId: contact.id,
    contactName: contact.name,
  }
}

function opportunityToActionItem(opp: {
  id: string
  title: string
  status: string
  updated_at: string
}): ActionItem {
  const daysStale = differenceInDays(new Date(), new Date(opp.updated_at))
  return {
    id: `opp-${opp.id}`,
    priority: 3,
    type: 'stale_opportunity',
    headline: `Is "${opp.title}" still active?`,
    subtext: `Status hasn't changed in ${daysStale} days · ${opp.status}`,
    opportunityId: opp.id,
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function buildActionFeed(supabase: SupabaseClient): Promise<ActionItem[]> {
  const [tasks, contacts, opportunities] = await Promise.all([
    fetchPendingTasks(supabase),
    fetchColdContacts(supabase),
    fetchStaleOpportunities(supabase),
  ])

  const items: ActionItem[] = []

  // Tasks (overdue, today, due soon)
  for (const task of tasks) {
    const item = taskToActionItem(task as Parameters<typeof taskToActionItem>[0])
    if (item) items.push(item)
  }

  // Cold / never-contacted
  for (const contact of contacts) {
    const item = contactToActionItem(contact as Parameters<typeof contactToActionItem>[0])
    if (item) items.push(item)
  }

  // Stale opportunities
  for (const opp of opportunities) {
    items.push(opportunityToActionItem(opp))
  }

  // Sort: priority first, then stable order within same priority
  items.sort((a, b) => a.priority - b.priority)

  // Deduplicate by id, cap at 10
  const seen = new Set<string>()
  const deduped: ActionItem[] = []
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      deduped.push(item)
    }
    if (deduped.length >= 10) break
  }

  return deduped
}
