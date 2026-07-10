/**
 * Formatting utilities
 */

/**
 * Format currency value
 */
export const formatCurrency = (
  value: number,
  currencyCode: string = 'USD',
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value)
}

/**
 * Format number with decimal places
 */
export const formatNumber = (
  value: number,
  decimals: number = 2,
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Format name in title case
 */
export const formatTitleCase = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format string to slug
 */
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate string with ellipsis
 */
export const truncate = (text: string, length: number = 100, ellipsis: string = '...'): string => {
  if (text.length <= length) return text
  return text.slice(0, length - ellipsis.length) + ellipsis
}

/**
 * Format bytes to human readable size
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format time duration in human readable format
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Format UUID to short form (first 8 chars)
 */
export const formatUUID = (uuid: string, short: boolean = false): string => {
  return short ? uuid.slice(0, 8) : uuid
}

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Format camelCase to readable text
 */
export const camelCaseToText = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Highlight search term in text
 */
export const highlightText = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

/**
 * Format quantity with unit
 */
export const formatQuantity = (quantity: number, unit: string = 'piece'): string => {
  const units: Record<string, { singular: string; plural: string }> = {
    piece: { singular: 'piece', plural: 'pieces' },
    kg: { singular: 'kg', plural: 'kg' },
    liter: { singular: 'liter', plural: 'liters' },
    unit: { singular: 'unit', plural: 'units' },
  }

  const unitInfo = units[unit] || { singular: unit, plural: unit }
  const unitLabel = quantity === 1 ? unitInfo.singular : unitInfo.plural

  return `${quantity} ${unitLabel}`
}
