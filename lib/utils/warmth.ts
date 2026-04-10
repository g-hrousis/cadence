import { differenceInDays } from 'date-fns'
import type { Contact, WarmthResult } from '@/types'

export function computeWarmth(contact: Pick<Contact, 'last_contacted' | 'contact_cadence_days'>): WarmthResult {
  if (!contact.last_contacted) {
    return { level: 'cold', label: 'Cold', daysSince: null }
  }

  const daysSince = differenceInDays(new Date(), new Date(contact.last_contacted))
  const cadence = contact.contact_cadence_days ?? 14

  if (daysSince <= Math.floor(cadence * 0.5)) {
    return { level: 'hot', label: 'Hot', daysSince }
  }
  if (daysSince <= cadence) {
    return { level: 'warm', label: 'Warm', daysSince }
  }
  if (daysSince <= cadence * 2) {
    return { level: 'cooling', label: 'Cooling', daysSince }
  }
  return { level: 'cold', label: 'Cold', daysSince }
}

export const warmthStyles: Record<string, { dot: string; badge: string }> = {
  hot:     { dot: 'bg-[#22C55E]', badge: 'bg-[rgba(34,197,94,0.08)] text-[#22C55E] border-[rgba(34,197,94,0.2)]' },
  warm:    { dot: 'bg-[#FBBF24]', badge: 'bg-[rgba(251,191,36,0.08)] text-[#FBBF24] border-[rgba(251,191,36,0.2)]' },
  cooling: { dot: 'bg-[#F97316]', badge: 'bg-[rgba(249,115,22,0.08)] text-[#F97316] border-[rgba(249,115,22,0.2)]' },
  cold:    { dot: 'bg-[#F87171]', badge: 'bg-[rgba(248,113,113,0.08)] text-[#F87171] border-[rgba(248,113,113,0.2)]' },
}
