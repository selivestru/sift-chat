const DAY_IN_MS = 24 * 60 * 60 * 1_000
const RELATIVE_DATE_LIMIT_DAYS = 35

const getLocalCalendarDay = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

export const formatDateAdded = (dateAdded: string, now = new Date()) => {
  const date = new Date(dateAdded)

  if (Number.isNaN(date.getTime())) return '—'

  const daysAgo = Math.floor((getLocalCalendarDay(now) - getLocalCalendarDay(date)) / DAY_IN_MS)

  if (daysAgo < 0 || daysAgo >= RELATIVE_DATE_LIMIT_DAYS) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 7) return `${daysAgo} days ago`

  const weeksAgo = Math.floor(daysAgo / 7)
  return `${weeksAgo} ${weeksAgo === 1 ? 'week' : 'weeks'} ago`
}
