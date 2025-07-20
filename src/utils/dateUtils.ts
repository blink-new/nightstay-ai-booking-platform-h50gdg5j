// Date utility functions for booking calculations

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] // YYYY-MM-DD format
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function isDateInPast(date: string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate < today
}

export function isDateInFuture(date: string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  today.setHours(23, 59, 59, 999)
  return checkDate > today
}

export function getMinBookingDate(): string {
  // Minimum booking date is tomorrow
  const tomorrow = addDays(new Date(), 1)
  return formatDate(tomorrow)
}

export function getMaxBookingDate(): string {
  // Maximum booking date is 1 year from now
  const oneYearFromNow = addDays(new Date(), 365)
  return formatDate(oneYearFromNow)
}