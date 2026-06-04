import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert an ISO date string to a Facebook-style relative time string.
 *
 * Rules:
 *  - < 1 min   → "Just now"
 *  - < 60 min  → "X minutes ago"
 *  - < 24 hrs  → "X hours ago"
 *  - yesterday → "Yesterday at HH:MM"
 *  - same year → "MMM D at HH:MM"  (e.g. "Jun 3 at 10:00")
 *  - older     → "MMM D, YYYY at HH:MM" (e.g. "Dec 25, 2024 at 09:30")
 */
export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then

  // Future or < 1 min → "Just now"
  if (diffMs < 60_000) return 'Just now'

  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 60) return `${diffMin} minutes ago`

  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs} hours ago`

  const date = new Date(dateStr)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`

  // Check if it was yesterday (in the user's local timezone)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${time}`
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const thisYear = new Date().getFullYear()

  if (year === thisYear) {
    return `${month} ${day} at ${time}`
  }

  return `${month} ${day}, ${year} at ${time}`
}
