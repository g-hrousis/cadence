export interface Contact {
  id: string
  user_id: string
  name: string
  email: string | null
  company: string | null
  role: string | null
  tags: string[]
  last_contacted: string | null
  next_follow_up: string | null
  contact_cadence_days: number
  notes: string
  created_at: string
}

export interface Opportunity {
  id: string
  user_id: string
  title: string
  type: 'job' | 'referral' | 'coffee_chat' | 'interview'
  status: 'applied' | 'networking' | 'interviewing' | 'offer' | 'rejected'
  created_at: string
  updated_at: string
}

export interface OpportunityWithContacts extends Opportunity {
  contacts?: Contact[]
}

export interface Interaction {
  id: string
  user_id: string
  contact_id: string
  date: string
  channel: 'linkedin' | 'email' | 'call' | 'in_person'
  outcome: 'no_response' | 'responded' | 'follow_up_needed'
  notes: string
}

export interface InteractionWithContact extends Interaction {
  contacts: { name: string } | null
}

export interface Task {
  id: string
  user_id: string
  title: string
  due_date: string | null
  linked_contact_id: string | null
  linked_opportunity_id: string | null
  status: 'pending' | 'completed'
  source: 'manual' | 'auto_follow_up' | 'auto_cold' | 'auto_deadline'
  snoozed_until: string | null
  created_at: string
}

export interface TaskWithRelations extends Task {
  contacts: { name: string } | null
  opportunities: { title: string } | null
}

// ─── Action Feed ────────────────────────────────────────────────────────────

export type ActionPriority = 1 | 2 | 3 | 4  // 1 = most urgent

export type ActionType =
  | 'overdue_task'
  | 'due_today_task'
  | 'never_contacted'
  | 'cold_contact'
  | 'stale_opportunity'
  | 'due_soon_task'

export interface ActionItem {
  id: string
  priority: ActionPriority
  type: ActionType
  headline: string
  subtext: string
  contactId?: string
  contactName?: string
  opportunityId?: string
  taskId?: string
}

// ─── Warmth ─────────────────────────────────────────────────────────────────

export type WarmthLevel = 'hot' | 'warm' | 'cooling' | 'cold'

export interface WarmthResult {
  level: WarmthLevel
  label: string
  daysSince: number | null
}
