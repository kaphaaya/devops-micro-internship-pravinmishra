/**
 * Cryptography utilities
 */

/**
 * Generate random UUID v4
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate random string of specified length
 */
export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate random token
 */
export const generateToken = (length: number = 32): string => {
  return generateRandomString(length)
}

/**
 * Generate TOTP backup codes
 */
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    // Generate codes like: XXXX-XXXX-XXXX (12 alphanumeric characters)
    const code = generateRandomString(12)
      .toUpperCase()
      .match(/.{1,4}/g)
      ?.join('-')
    if (code) codes.push(code)
  }
  return codes
}

/**
 * Hash password using simple hash (for client-side validation only)
 * NOTE: For production, use bcrypt or argon2 on the backend
 */
export const hashPassword = (password: string): string => {
  // This is a simple hash for demonstration
  // NEVER use this in production - use bcrypt on backend
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16)
}

/**
 * Generate API key
 */
export const generateApiKey = (): string {
  // Format: hbos_<random_string>
  return `hbos_${generateRandomString(32)}`
}

/**
 * Validate API key format
 */
export const isValidApiKey = (apiKey: string): boolean => {
  return apiKey.startsWith('hbos_') && apiKey.length === 37
}

/**
 * Hash string using SHA-256 (client-side only)
 */
export const sha256Hash = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Encode string to base64
 */
export const encodeBase64 = (text: string): string => {
  return Buffer.from(text).toString('base64')
}

/**
 * Decode base64 string
 */
export const decodeBase64 = (base64: string): string => {
  return Buffer.from(base64, 'base64').toString('utf-8')
}

/**
 * Encrypt string using simple XOR cipher (for demonstration only)
 * NOTE: For production, use proper encryption like AES-256
 */
export const simpleEncrypt = (text: string, key: string): string => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return encodeBase64(result)
}

/**
 * Decrypt string using simple XOR cipher (for demonstration only)
 */
export const simpleDecrypt = (encrypted: string, key: string): string => {
  const text = Buffer.from(encrypted, 'base64').toString('binary')
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

/**
 * Generate HMAC signature
 */
export const generateHmac = async (message: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify HMAC signature
 */
export const verifyHmac = async (message: string, signature: string, secret: string): Promise<boolean> => {
  const computed = await generateHmac(message, secret)
  return computed === signature
}

/**
 * Generate random code (numeric)
 */
export const generateOTP = (length: number = 6): string => {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

/**
 * Mask sensitive data (e.g., credit card)
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) return data
  const masked = '*'.repeat(data.length - visibleChars)
  return masked + data.slice(-visibleChars)
}

/**
 * Create secure comparison (constant time)
 */
export const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
