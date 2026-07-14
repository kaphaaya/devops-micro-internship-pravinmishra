/**
 * Validation utilities
 */

/**
 * Check if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if UUID is valid
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Check if password meets requirements
 * - Min 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 12) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false
  return true
}

/**
 * Check if phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Simple validation - at least 10 digits
  const phoneRegex = /^\d{10,}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Check if slug is valid
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 255
}

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0
}

/**
 * Check if number is positive
 */
export const isPositive = (value: number): boolean => {
  return value > 0
}

/**
 * Check if number is non-negative
 */
export const isNonNegative = (value: number): boolean => {
  return value >= 0
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (isEmpty(email)) {
    return { valid: false, error: 'Email is required' }
  }
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' }
  }
  if (email.length > 255) {
    return { valid: false, error: 'Email is too long' }
  }
  return { valid: true }
}

/**
 * Validate password
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (isEmpty(password)) {
    return { valid: false, error: 'Password is required' }
  }
  if (!isValidPassword(password)) {
    return {
      valid: false,
      error: 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character',
    }
  }
  return { valid: true }
}

/**
 * Sanitize string input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Check if value is null or undefined
 */
export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined
}

/**
 * Check if value is an object
 */
export const isObject = (value: any): value is Record<string, any> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Check if value is an array
 */
export const isArray = (value: any): value is any[] => {
  return Array.isArray(value)
}
