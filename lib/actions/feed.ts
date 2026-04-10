import { differenceInDays, isToday, isPast, startOfDay } from 'date-fns'
import type { ActionItem, ActionPriority } from '@/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Internal types ───────────────────────────────────────────────────────────

// What Supabase actually returns: joined relations come back as arrays.
interface TaskRow {
  id: string
  title: string
  due_date: string | null
  linked_contact_id: string | null
  linked_opportunity_id: string | null
  source: string
  contacts: { name: string }[] | { name: string } | null
  opportunities: { title: string }[] | { title: string } | null
}

// What taskToRankedItem expects: relations normalized to single object or null.
interface NormalizedTaskRow {
  id: string
  title: string
  due_date: string | null
  linked_contact_id: string | null
  linked_opportunity_id: string | null
  source: string
  contacts: { name: string } | null
  opportunities: { title: string } | null
}

// urgencyScore is internal — used for secondary sort, stripped before export.
type RankedItem = ActionItem & { urgencyScore: number }

// ─── Normalization ────────────────────────────────────────────────────────────

// Supabase returns arrays for joined relations even when the FK guarantees
// at most one row. Normalize to a single object or null before processing.
function normalizeTask(task: TaskRow): NormalizedTaskRow {
  return {
    ...task,
    contacts: Array.isArray(task.contacts)
      ? (task.contacts[0] ?? null)
      : task.contacts ?? null,
    opportunities: Array.isArray(task.opportunities)
      ? (task.opportunities[0] ?? null)
      : task.opportunities ?? null,
  }
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function fetchPendingTasks(supabase: SupabaseClient): Promise<TaskRow[]> {
  const { data } = await supabase
    .from('tasks')
    .select('id, title, due_date, linked_contact_id, linked_opportunity_id, source, contacts(name), opportunities(title)')
    .eq('status', 'pending')
    .or('snoozed_until.is.null,snoozed_until.lt.' + new Date().toISOString())
    .order('due_date', { ascending: true, nullsFirst: false })
  return (data ?? []) as TaskRow[]
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
    .order('updated_at', { ascending: true })
    .limit(5)
  return data ?? []
}

// ─── Action builders ──────────────────────────────────────────────────────────

function taskToRankedItem(task: NormalizedTaskRow): RankedItem | null {
  if (!task.due_date) return null

  const dueDate = new Date(task.due_date)
  const overdue = isPast(dueDate) && !isToday(dueDate)
  const dueToday = isToday(dueDate)
  const daysUntil = differenceInDays(dueDate, startOfDay(new Date()))
  const contact = task.contacts?.name ? ` · ${task.contacts.name}` : ''

  if (overdue) {
    const daysOver = Math.abs(differenceInDays(dueDate, new Date()))
    return {
      id: `task-${task.id}`,
      priority: 1,
      type: 'overdue_task',
      headline: task.title,
      subtext: `${daysOver === 1 ? '1 day' : `${daysOver} days`} overdue${contact}`,
      taskId: task.id,
      contactId: task.linked_contact_id ?? undefined,
      contactName: task.contacts?.name,
      urgencyScore: daysOver,
    }
  }

  if (dueToday) {
    return {
      id: `task-${task.id}`,
      priority: 2,
      type: 'due_today_task',
      headline: task.title,
      subtext: `Due today${contact}${task.opportunities ? ` · ${task.opportunities.title}` : ''}`,
      taskId: task.id,
      contactId: task.linked_contact_id ?? undefined,
      contactName: task.contacts?.name,
      urgencyScore: 0,
    }
  }

  if (daysUntil <= 3) {
    return {
      id: `task-${task.id}`,
      priority: 3,
      type: 'due_soon_task',
      headline: task.title,
      subtext: `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}${contact}`,
      taskId: task.id,
      contactId: task.linked_contact_id ?? undefined,
      contactName: task.contacts?.name,
      urgencyScore: -daysUntil,
    }
  }

  return null
}

interface ContactRow {
  id: string
  name: string
  company: string | null
  role: string | null
  last_contacted: string | null
  contact_cadence_days: number
  created_at: string
}

function contactToRankedItem(
  contact: ContactRow,
  contactsWithTasks: Set<string>
): RankedItem | null {
  if (contactsWithTasks.has(contact.id)) return null

  const cadence = Math.max(1, contact.contact_cadence_days ?? 14)
  const context = [contact.role, contact.company].filter(Boolean).join(' at ')
  const displayName = contact.name?.trim() || 'a contact'

  if (!contact.last_contacted) {
    const daysSinceAdded = differenceInDays(new Date(), new Date(contact.created_at))
    if (daysSinceAdded < 3) return null

    const priority: ActionPriority = daysSinceAdded >= 14 ? 1 : 2
    return {
      id: `cold-${contact.id}`,
      priority,
      type: 'never_contacted',
      headline: `You haven't reached out to ${displayName} yet`,
      subtext: `Added ${daysSinceAdded} day${daysSinceAdded !== 1 ? 's' : ''} ago${context ? ` · ${context}` : ''}`,
      contactId: contact.id,
      contactName: contact.name,
      urgencyScore: daysSinceAdded,
    }
  }

  const daysSince = differenceInDays(new Date(), new Date(contact.last_contacted))
  if (daysSince < cadence) return null

  const daysOver = daysSince - cadence
  const priority: ActionPriority = daysSince >= cadence * 2 ? 1 : daysOver >= 14 ? 2 : 3

  return {
    id: `cold-${contact.id}`,
    priority,
    type: 'cold_contact',
    headline: `${displayName} is going cold`,
    subtext: `${daysSince} day${daysSince !== 1 ? 's' : ''} since last contact · cadence is ${cadence}d${context ? ` · ${context}` : ''}`,
    contactId: contact.id,
    contactName: contact.name,
    urgencyScore: daysOver,
  }
}

interface OpportunityRow {
  id: string
  title: string
  status: string
  updated_at: string
}

function opportunityToRankedItem(opp: OpportunityRow): RankedItem {
  const daysStale = differenceInDays(new Date(), new Date(opp.updated_at))
  const priority: ActionPriority = daysStale >= 30 ? 2 : 3
  return {
    id: `opp-${opp.id}`,
    priority,
    type: 'stale_opportunity',
    headline: `Is "${opp.title}" still moving?`,
    subtext: `No updates in ${daysStale} day${daysStale !== 1 ? 's' : ''} · ${opp.status}`,
    opportunityId: opp.id,
    urgencyScore: daysStale,
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface FeedStats {
  overdue: number
  dueToday: number
  coldContacts: number
  staleOpportunities: number
}

export function computeFeedStats(items: ActionItem[]): FeedStats {
  return {
    overdue: items.filter(i => i.type === 'overdue_task').length,
    dueToday: items.filter(i => i.type === 'due_today_task').length,
    coldContacts: items.filter(i => i.type === 'cold_contact' || i.type === 'never_contacted').length,
    staleOpportunities: items.filter(i => i.type === 'stale_opportunity').length,
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function buildActionFeed(supabase: SupabaseClient): Promise<ActionItem[]> {
  const [tasks, contacts, opportunities] = await Promise.all([
    fetchPendingTasks(supabase),
    fetchColdContacts(supabase),
    fetchStaleOpportunities(supabase),
  ])

  const ranked: RankedItem[] = []
  const contactsWithTasks = new Set<string>()

  for (const task of tasks) {
    const normalized = normalizeTask(task)
    const item = taskToRankedItem(normalized)
    if (item) {
      ranked.push(item)
      if (task.linked_contact_id) contactsWithTasks.add(task.linked_contact_id)
    }
  }

  for (const contact of contacts) {
    const item = contactToRankedItem(contact as ContactRow, contactsWithTasks)
    if (item) ranked.push(item)
  }

  for (const opp of opportunities) {
    ranked.push(opportunityToRankedItem(opp as OpportunityRow))
  }

  ranked.sort((a, b) =>
    a.priority !== b.priority
      ? a.priority - b.priority
      : b.urgencyScore - a.urgencyScore
  )

  const seen = new Set<string>()
  const result: ActionItem[] = []
  for (const { urgencyScore: _score, ...item } of ranked) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    result.push(item)
    if (result.length >= 12) break
  }

  return result
}
