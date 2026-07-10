/**
 * System limits and constraints
 */

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const

// Authentication
export const AUTH = {
  JWT_EXPIRY_SECONDS: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7 days
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_MAX_LENGTH: 128,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCK_DURATION_MINUTES: 15,
  MFA_CODE_LENGTH: 6,
  BACKUP_CODES_COUNT: 10,
} as const

// File upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE_MB: 10,
  MAX_IMAGE_SIZE_MB: 5,
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'csv', 'xlsx'],
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const

// Rate limiting (per tier)
export const RATE_LIMIT = {
  STARTER: {
    REQUESTS_PER_HOUR: 1000,
    REQUESTS_PER_MINUTE: 50,
  },
  PROFESSIONAL: {
    REQUESTS_PER_HOUR: 10000,
    REQUESTS_PER_MINUTE: 500,
  },
  ENTERPRISE: {
    REQUESTS_PER_HOUR: 100000,
    REQUESTS_PER_MINUTE: 5000,
  },
} as const

// Database
export const DATABASE = {
  MAX_CONNECTION_POOL: 10,
  MIN_CONNECTION_POOL: 2,
  QUERY_TIMEOUT_MS: 30000,
  STATEMENT_TIMEOUT_MS: 60000,
} as const

// Cache
export const CACHE = {
  DEFAULT_TTL_SECONDS: 5 * 60, // 5 minutes
  SESSION_TTL_SECONDS: 7 * 24 * 60 * 60, // 7 days
  QUERY_CACHE_TTL_SECONDS: 60, // 1 minute
} as const

// Business logic
export const BUSINESS = {
  MAX_LOCATIONS_PER_TENANT: {
    starter: 1,
    professional: 10,
    enterprise: -1, // Unlimited
  },
  MAX_USERS_PER_TENANT: {
    starter: 5,
    professional: 50,
    enterprise: -1, // Unlimited
  },
  MAX_API_KEYS_PER_TENANT: {
    starter: 1,
    professional: 5,
    enterprise: -1, // Unlimited
  },
} as const

// String lengths
export const STRING_LENGTHS = {
  NAME_MIN: 2,
  NAME_MAX: 255,
  EMAIL_MAX: 255,
  PHONE_MAX: 20,
  SLUG_MAX: 255,
  DESCRIPTION_MAX: 5000,
  NOTES_MAX: 10000,
} as const

// Timeouts
export const TIMEOUTS = {
  API_REQUEST_MS: 30000,
  EMAIL_SEND_MS: 10000,
  SMS_SEND_MS: 10000,
  WEBHOOK_MS: 5000,
} as const

// Data retention
export const DATA_RETENTION = {
  AUDIT_LOG_DAYS: 730, // 2 years
  TRANSACTION_HISTORY_DAYS: 2555, // 7 years
  SOFT_DELETE_RECOVERY_DAYS: 90,
  SESSIONS_DAYS: 30,
} as const
