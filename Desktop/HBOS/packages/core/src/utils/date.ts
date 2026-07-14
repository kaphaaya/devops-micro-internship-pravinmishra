/**
 * Date and time utilities
 */

/**
 * Get current timestamp
 */
export const now = (): Date => new Date()

/**
 * Add days to date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add hours to date
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

/**
 * Add minutes to date
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

/**
 * Add seconds to date
 */
export const addSeconds = (date: Date, seconds: number): Date => {
  const result = new Date(date)
  result.setSeconds(result.getSeconds() + seconds)
  return result
}

/**
 * Get start of day
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of day
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get start of month
 */
export const startOfMonth = (date: Date): Date => {
  const result = new Date(date)
  result.setDate(1)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of month
 */
export const endOfMonth = (date: Date): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  result.setDate(0)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = startOfDay(new Date())
  const checkDate = startOfDay(date)
  return today.getTime() === checkDate.getTime()
}

/**
 * Check if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date()
}

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date()
}

/**
 * Get difference in days between two dates
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((date2.getTime() - date1.getTime()) / msPerDay)
}

/**
 * Get difference in hours between two dates
 */
export const getHoursDifference = (date1: Date, date2: Date): number => {
  const msPerHour = 60 * 60 * 1000
  return Math.floor((date2.getTime() - date1.getTime()) / msPerHour)
}

/**
 * Format date to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString()
}

/**
 * Format date to locale string
 */
export const toLocaleString = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale)
}

/**
 * Format date and time to locale string
 */
export const toLocaleDateTimeString = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleString(locale)
}

/**
 * Format date to short format (MM/DD/YYYY)
 */
export const toShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US')
}

/**
 * Format date to long format (Month Day, Year)
 */
export const toLongDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format time (HH:MM:SS)
 */
export const toTime = (date: Date, includeSeconds: boolean = true): string => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date, locale: string = 'en-US'): string => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffSecs = Math.round(diffMs / 1000)

  if (Math.abs(diffSecs) < 60) {
    return rtf.format(diffSecs, 'second')
  }

  const diffMins = Math.round(diffSecs / 60)
  if (Math.abs(diffMins) < 60) {
    return rtf.format(diffMins, 'minute')
  }

  const diffHours = Math.round(diffMins / 60)
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour')
  }

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, 'day')
  }

  const diffWeeks = Math.round(diffDays / 7)
  if (Math.abs(diffWeeks) < 4) {
    return rtf.format(diffWeeks, 'week')
  }

  const diffMonths = Math.round(diffDays / 30)
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, 'month')
  }

  const diffYears = Math.round(diffMonths / 12)
  return rtf.format(diffYears, 'year')
}

/**
 * Parse date string
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    return new Date(dateString)
  } catch {
    return null
  }
}

/**
 * Get age from birth date
 */
export const getAge = (birthDate: Date): number => {
  const ageDiff = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDiff)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
