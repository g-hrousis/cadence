import { formatDistanceToNow, isToday, isPast, differenceInDays, format } from 'date-fns'

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function formatRelative(dateStr: string | null): string {
  if (!dateStr) return '—'
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  return isPast(date) && !isToday(date)
}

export function isDueToday(dateStr: string | null): boolean {
  if (!dateStr) return false
  return isToday(new Date(dateStr))
}

export function isGoingCold(lastContactedStr: string | null, thresholdDays = 14): boolean {
  if (!lastContactedStr) return true
  return differenceInDays(new Date(), new Date(lastContactedStr)) >= thresholdDays
}
