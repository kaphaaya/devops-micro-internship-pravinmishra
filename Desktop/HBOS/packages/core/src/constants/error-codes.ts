/**
 * Standard error codes across the application
 */

export const ERROR_CODES = {
  // Authentication
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_001',
    ACCOUNT_LOCKED: 'AUTH_002',
    EMAIL_NOT_VERIFIED: 'AUTH_003',
    MFA_REQUIRED: 'AUTH_004',
    INVALID_TOKEN: 'AUTH_005',
    TOKEN_EXPIRED: 'AUTH_006',
    REFRESH_TOKEN_EXPIRED: 'AUTH_007',
    MFA_SETUP_REQUIRED: 'AUTH_008',
  },

  // Authorization
  AUTHZ: {
    INSUFFICIENT_PERMISSIONS: 'AUTHZ_001',
    RESOURCE_ACCESS_DENIED: 'AUTHZ_002',
    LOCATION_ACCESS_DENIED: 'AUTHZ_003',
  },

  // Validation
  VALIDATION: {
    INVALID_EMAIL: 'VAL_001',
    INVALID_PASSWORD: 'VAL_002',
    INVALID_PHONE: 'VAL_003',
    REQUIRED_FIELD_MISSING: 'VAL_004',
    INVALID_FORMAT: 'VAL_005',
    DUPLICATE_ENTRY: 'VAL_006',
    VALUE_OUT_OF_RANGE: 'VAL_007',
  },

  // Resource Errors
  RESOURCE: {
    NOT_FOUND: 'RES_001',
    ALREADY_EXISTS: 'RES_002',
    CANNOT_DELETE: 'RES_003',
    INVALID_STATE: 'RES_004',
    CONFLICT: 'RES_005',
  },

  // Business Logic Errors
  BUSINESS: {
    INSUFFICIENT_INVENTORY: 'BIZ_001',
    INVALID_ORDER_STATUS: 'BIZ_002',
    PAYMENT_FAILED: 'BIZ_003',
    REFUND_NOT_ALLOWED: 'BIZ_004',
    PRICING_MISMATCH: 'BIZ_005',
    INVENTORY_LOCKED: 'BIZ_006',
    SUPPLIER_NOT_AVAILABLE: 'BIZ_007',
    LOCATION_LIMIT_REACHED: 'BIZ_008',
  },

  // Integration Errors
  INTEGRATION: {
    PAYMENT_GATEWAY_ERROR: 'INT_001',
    EMAIL_SERVICE_ERROR: 'INT_002',
    SMS_SERVICE_ERROR: 'INT_003',
    EXTERNAL_API_ERROR: 'INT_004',
    WEBHOOK_DELIVERY_FAILED: 'INT_005',
  },

  // System Errors
  SYSTEM: {
    INTERNAL_SERVER_ERROR: 'SYS_001',
    DATABASE_ERROR: 'SYS_002',
    CACHE_ERROR: 'SYS_003',
    SERVICE_UNAVAILABLE: 'SYS_004',
    CONFIGURATION_ERROR: 'SYS_005',
    TIMEOUT: 'SYS_006',
  },

  // Rate Limiting
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: 'RATE_001',
    QUOTA_EXCEEDED: 'RATE_002',
  },

  // Tenant Errors
  TENANT: {
    TENANT_NOT_FOUND: 'TEN_001',
    TENANT_SUSPENDED: 'TEN_002',
    SUBSCRIPTION_EXPIRED: 'TEN_003',
    FEATURE_NOT_AVAILABLE: 'TEN_004',
  },
} as const

/**
 * Error messages for each error code
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication
  AUTH_001: 'Invalid email or password',
  AUTH_002: 'Account is locked. Please try again later',
  AUTH_003: 'Please verify your email address',
  AUTH_004: 'Multi-factor authentication required',
  AUTH_005: 'Invalid or malformed token',
  AUTH_006: 'Authentication token has expired',
  AUTH_007: 'Refresh token has expired. Please login again',
  AUTH_008: 'Multi-factor authentication setup required',

  // Authorization
  AUTHZ_001: 'You do not have permission to perform this action',
  AUTHZ_002: 'You do not have access to this resource',
  AUTHZ_003: 'You do not have access to this location',

  // Validation
  VAL_001: 'Invalid email format',
  VAL_002: 'Password does not meet security requirements',
  VAL_003: 'Invalid phone number format',
  VAL_004: 'Required field is missing',
  VAL_005: 'Invalid format provided',
  VAL_006: 'This entry already exists',
  VAL_007: 'Value is out of valid range',

  // Resource
  RES_001: 'Resource not found',
  RES_002: 'Resource already exists',
  RES_003: 'Resource cannot be deleted',
  RES_004: 'Resource is in an invalid state',
  RES_005: 'Resource conflict detected',

  // Business Logic
  BIZ_001: 'Insufficient inventory',
  BIZ_002: 'Invalid order status',
  BIZ_003: 'Payment processing failed',
  BIZ_004: 'Refund is not allowed for this order',
  BIZ_005: 'Pricing mismatch detected',
  BIZ_006: 'Inventory is currently locked',
  BIZ_007: 'Supplier is not available',
  BIZ_008: 'Location limit reached for your subscription tier',

  // Integration
  INT_001: 'Payment gateway error',
  INT_002: 'Email service unavailable',
  INT_003: 'SMS service unavailable',
  INT_004: 'External API error',
  INT_005: 'Webhook delivery failed',

  // System
  SYS_001: 'Internal server error',
  SYS_002: 'Database error occurred',
  SYS_003: 'Cache error occurred',
  SYS_004: 'Service is temporarily unavailable',
  SYS_005: 'Configuration error',
  SYS_006: 'Request timeout',

  // Rate Limit
  RATE_001: 'Too many requests. Please try again later',
  RATE_002: 'Quota exceeded. Please upgrade your subscription',

  // Tenant
  TEN_001: 'Tenant not found',
  TEN_002: 'Tenant account is suspended',
  TEN_003: 'Subscription has expired',
  TEN_004: 'Feature is not available for your subscription tier',
}
