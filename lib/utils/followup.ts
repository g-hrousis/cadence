// Dynamic follow-up configuration based on channel × outcome.
//
// Reasoning per cell:
//
// LinkedIn × no_response   → 5d  LinkedIn DMs get buried. Give it time before nudging.
// LinkedIn × responded      → 7d  Conversation is live; let it breathe.
// LinkedIn × follow_up_needed → 3d  They engaged — don't let momentum die.
//
// Email × no_response      → 7d  Email is deliberate. A week is professional before re-pinging.
// Email × responded         → 5d  Email chains move fast. Reply window is shorter.
// Email × follow_up_needed → 2d  Active thread — keep it going.
//
// Call × no_response       → 2d  Missed calls need a quick follow-up while still relevant.
// Call × responded          → 5d  Good conversation — send a recap soon.
// Call × follow_up_needed  → 1d  Post-call action items should land the next day.
//
// In Person × no_response  → 1d  Just met them — follow up while you're top of mind.
// In Person × responded     → 3d  Warm meeting — follow up while context is fresh.
// In Person × follow_up_needed → 1d  Strike while the iron is hot.

export type Channel = 'linkedin' | 'email' | 'call' | 'in_person'
export type Outcome = 'no_response' | 'responded' | 'follow_up_needed'

export interface FollowUpConfig {
  /** Days from interaction date until follow-up task is due */
  days: number
  /** Auto-task title — call with the contact's name */
  taskTitle: (name: string) => string
  /** One-line description shown in the form */
  description: string
  /** Whether to create an auto-task at all */
  createTask: boolean
}

const CONFIG: Record<Channel, Record<Outcome, FollowUpConfig>> = {
  linkedin: {
    no_response: {
      days: 5,
      taskTitle: name => `Follow up on LinkedIn with ${name}`,
      description: 'LinkedIn follow-up in 5 days — messages get buried.',
      createTask: true,
    },
    responded: {
      days: 7,
      taskTitle: name => `Continue conversation with ${name} on LinkedIn`,
      description: 'No task — they responded. Normal cadence applies.',
      createTask: false,
    },
    follow_up_needed: {
      days: 3,
      taskTitle: name => `Continue conversation with ${name} on LinkedIn`,
      description: 'Follow-up in 3 days — keep the momentum going.',
      createTask: true,
    },
  },
  email: {
    no_response: {
      days: 7,
      taskTitle: name => `Send follow-up email to ${name}`,
      description: 'Follow-up email in 7 days — professional window.',
      createTask: true,
    },
    responded: {
      days: 5,
      taskTitle: name => `Reply to ${name}`,
      description: 'No task — they responded. Reply when ready.',
      createTask: false,
    },
    follow_up_needed: {
      days: 2,
      taskTitle: name => `Reply to ${name}'s email`,
      description: 'Follow-up in 2 days — email threads move fast.',
      createTask: true,
    },
  },
  call: {
    no_response: {
      days: 2,
      taskTitle: name => `Try calling ${name} again`,
      description: 'Follow-up call in 2 days — missed calls fade quickly.',
      createTask: true,
    },
    responded: {
      days: 5,
      taskTitle: name => `Send recap to ${name} from your call`,
      description: 'No task — send a recap email when ready.',
      createTask: false,
    },
    follow_up_needed: {
      days: 1,
      taskTitle: name => `Send follow-up to ${name} after your call`,
      description: 'Follow-up tomorrow — post-call action items land best within 24h.',
      createTask: true,
    },
  },
  in_person: {
    no_response: {
      days: 1,
      taskTitle: name => `Follow up with ${name} after meeting`,
      description: 'Follow-up tomorrow — you just met, stay top of mind.',
      createTask: true,
    },
    responded: {
      days: 3,
      taskTitle: name => `Follow up with ${name}`,
      description: 'No task — follow up in a few days while context is fresh.',
      createTask: false,
    },
    follow_up_needed: {
      days: 1,
      taskTitle: name => `Action item from your meeting with ${name}`,
      description: 'Follow-up tomorrow — strike while the iron is hot.',
      createTask: true,
    },
  },
}

export function getFollowUpConfig(channel: Channel, outcome: Outcome): FollowUpConfig {
  return CONFIG[channel]?.[outcome] ?? {
    days: 7,
    taskTitle: name => `Follow up with ${name}`,
    description: 'Follow-up in 7 days.',
    createTask: true,
  }
}
