/**
 * API endpoint paths
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    PASSWORD_RESET_REQUEST: '/auth/password-reset',
    PASSWORD_RESET_CONFIRM: '/auth/password-reset-confirm',
    CHANGE_PASSWORD: '/auth/change-password',
    MFA_SETUP: '/auth/mfa/setup',
    MFA_VERIFY: '/auth/mfa/verify',
    MFA_DISABLE: '/auth/mfa/disable',
  },

  // Users
  USERS: {
    LIST: '/users',
    GET: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    DEVICES: '/users/:id/devices',
  },

  // Tenants
  TENANTS: {
    ME: '/tenants/me',
    GET: '/tenants/:id',
    UPDATE: '/tenants/:id',
    SUBSCRIPTION: '/tenants/:id/subscription',
    USAGE: '/tenants/:id/usage',
    INVITE: '/tenants/:id/invite',
  },

  // Locations
  LOCATIONS: {
    LIST: '/locations',
    GET: '/locations/:id',
    CREATE: '/locations',
    UPDATE: '/locations/:id',
    DELETE: '/locations/:id',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    GET: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    INVENTORY: '/products/:id/inventory',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    GET: '/orders/:id',
    CREATE: '/orders',
    UPDATE: '/orders/:id',
    UPDATE_STATUS: '/orders/:id/status',
    PAYMENT: '/orders/:id/payment',
    REFUND: '/orders/:id/refund',
    ITEMS: '/orders/:id/items',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    GET: '/customers/:id',
    CREATE: '/customers',
    UPDATE: '/customers/:id',
    DELETE: '/customers/:id',
    ORDERS: '/customers/:id/orders',
    LOYALTY: '/customers/:id/loyalty',
  },

  // Inventory
  INVENTORY: {
    LIST: '/inventory',
    GET: '/inventory/:id',
    ADJUST: '/inventory/adjustments',
    STOCK_COUNTS: '/inventory/stock-counts',
    TRANSFERS: '/inventory/transfers',
  },

  // Suppliers
  SUPPLIERS: {
    LIST: '/suppliers',
    GET: '/suppliers/:id',
    CREATE: '/suppliers',
    UPDATE: '/suppliers/:id',
    DELETE: '/suppliers/:id',
  },

  // Purchase Orders
  PURCHASE_ORDERS: {
    LIST: '/purchase-orders',
    GET: '/purchase-orders/:id',
    CREATE: '/purchase-orders',
    UPDATE: '/purchase-orders/:id',
    APPROVE: '/purchase-orders/:id/approve',
    RECEIVE: '/purchase-orders/:id/receive',
    CANCEL: '/purchase-orders/:id/cancel',
  },

  // Loyalty
  LOYALTY: {
    PROGRAMS: '/loyalty-programs',
    PROGRAM_GET: '/loyalty-programs/:id',
    ACCOUNTS: '/customers/:customerId/loyalty',
    REDEEM: '/loyalty/:accountId/redeem',
    ADD_POINTS: '/loyalty/:accountId/add-points',
  },

  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    CUSTOMERS: '/reports/customers',
    STAFF: '/reports/staff',
    EXPORT: '/reports/export',
  },

  // Settings
  SETTINGS: {
    ROLES: '/settings/roles',
    PERMISSIONS: '/settings/permissions',
    AUDIT_LOGS: '/settings/audit-logs',
    API_KEYS: '/settings/api-keys',
  },

  // Health & Status
  HEALTH: {
    CHECK: '/health',
    READY: '/ready',
    LIVE: '/live',
  },
} as const

/**
 * API URL builder
 */
export const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = endpoint

  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value)
    })
  }

  return url
}
