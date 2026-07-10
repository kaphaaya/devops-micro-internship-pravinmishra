/**
 * API-specific types for requests and responses
 */

import type { UUID, Timestamp } from './common'

/**
 * Authentication credentials
 */
export interface ILoginRequest {
  email: string
  password: string
}

export interface IRegisterRequest {
  email: string
  password: string
  fullName: string
  tenantName?: string
}

/**
 * JWT Token payload
 */
export interface IJwtPayload {
  userId: UUID
  tenantId: UUID
  email: string
  roles: string[]
  permissions: string[]
  iat: number
  exp: number
}

/**
 * Token response
 */
export interface ITokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

/**
 * User session
 */
export interface IUserSession {
  id: UUID
  email: string
  fullName: string
  tenantId: UUID
  roles: string[]
  permissions: string[]
  avatar?: string
}

/**
 * Pagination query parameters
 */
export interface IPaginationQuery {
  page?: number
  limit?: number
  offset?: number
}

/**
 * Sort query parameter
 */
export interface ISortQuery {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * Common query filters
 */
export interface IFilterQuery {
  search?: string
  status?: string
  startDate?: string
  endDate?: string
  [key: string]: any
}

/**
 * API error details
 */
export interface IApiError {
  code: string
  message: string
  statusCode: number
  timestamp: Timestamp
  path?: string
  details?: Record<string, any>
}

/**
 * Rate limit headers
 */
export interface IRateLimitInfo {
  limit: number
  remaining: number
  reset: number
}

/**
 * Health check response
 */
export interface IHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Timestamp
  uptime: number
  database: 'connected' | 'disconnected'
  redis: 'connected' | 'disconnected'
}
