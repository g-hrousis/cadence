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
  hot:     { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  warm:    { dot: 'bg-yellow-400',  badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  cooling: { dot: 'bg-orange-400',  badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  cold:    { dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border-red-200' },
}
