/**
 * Common types used across HBOS
 */

export type UUID = string & { readonly __brand: 'UUID' }

export type Timestamp = Date

/**
 * Generic pagination metadata
 */
export interface IPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Paginated response wrapper
 */
export interface IPaginatedResponse<T> {
  data: T[]
  pagination: IPagination
}

/**
 * Generic API response wrapper
 */
export interface IApiResponse<T> {
  statusCode: number
  message: string
  data: T
  timestamp: Timestamp
}

/**
 * Generic error response
 */
export interface IErrorResponse {
  statusCode: number
  error: string
  message: string
  timestamp: Timestamp
  path?: string
  details?: Record<string, any>
}

/**
 * Entity status enum
 */
export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
  PENDING = 'pending',
  ARCHIVED = 'archived',
}

/**
 * Subscription tier
 */
export enum SubscriptionTier {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

/**
 * Generic entity with standard fields
 */
export interface IEntity {
  id: UUID
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt?: Timestamp
}

/**
 * Tenant-scoped entity
 */
export interface ITenantEntity extends IEntity {
  tenantId: UUID
}

/**
 * Query parameters for filtering, sorting, pagination
 */
export interface IQueryParams {
  page?: number
  limit?: number
  sort?: string // "fieldName" or "-fieldName" (descending)
  search?: string
  filter?: Record<string, any>
}

/**
 * Result type for operations that can succeed or fail
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

/**
 * Utility to create successful result
 */
export const Ok = <T>(value: T): Result<T> => ({ ok: true, value })

/**
 * Utility to create error result
 */
export const Err = <E = Error>(error: E): Result<any, E> => ({ ok: false, error })
