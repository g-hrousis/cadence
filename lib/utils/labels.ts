type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange'

export function opportunityStatusLabel(status: string): string {
  const map: Record<string, string> = {
    applied: 'Applied',
    networking: 'Networking',
    interviewing: 'Interviewing',
    offer: 'Offer',
    rejected: 'Rejected',
  }
  return map[status] ?? status
}

export function opportunityStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    applied: 'blue',
    networking: 'purple',
    interviewing: 'yellow',
    offer: 'green',
    rejected: 'red',
  }
  return map[status] ?? 'gray'
}

export function opportunityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    job: 'Job',
    referral: 'Referral',
    coffee_chat: 'Coffee Chat',
    interview: 'Interview',
  }
  return map[type] ?? type
}

export function channelLabel(channel: string): string {
  const map: Record<string, string> = {
    linkedin: 'LinkedIn',
    email: 'Email',
    call: 'Call',
    in_person: 'In Person',
  }
  return map[channel] ?? channel
}

export function outcomeLabel(outcome: string): string {
  const map: Record<string, string> = {
    no_response: 'No Response',
    responded: 'Responded',
    follow_up_needed: 'Follow-up Needed',
  }
  return map[outcome] ?? outcome
}

export function outcomeVariant(outcome: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    no_response: 'gray',
    responded: 'green',
    follow_up_needed: 'yellow',
  }
  return map[outcome] ?? 'gray'
}
