/**
 * Authentication and authorization types
 */

import type { UUID } from './common'

/**
 * Authentication method types
 */
export enum AuthMethodType {
  PASSWORD = 'password',
  TOTP = 'totp',
  SMS = 'sms',
  OAUTH = 'oauth',
}

/**
 * OAuth provider
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  GITHUB = 'github',
  APPLE = 'apple',
}

/**
 * MFA setup request
 */
export interface IMfaSetupRequest {
  type: 'totp' | 'sms'
}

/**
 * MFA setup response
 */
export interface IMfaSetupResponse {
  secret?: string // For TOTP
  qrCode?: string // QR code for TOTP
  backupCodes: string[]
}

/**
 * MFA verification request
 */
export interface IMfaVerifyRequest {
  code: string
  type: 'totp' | 'sms'
}

/**
 * Password reset request
 */
export interface IPasswordResetRequest {
  email: string
}

/**
 * Password reset confirmation
 */
export interface IPasswordResetConfirm {
  token: string
  newPassword: string
}

/**
 * Change password request
 */
export interface IChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

/**
 * User device (for device management)
 */
export interface IUserDevice {
  id: UUID
  userId: UUID
  deviceName: string
  userAgent: string
  ipAddress: string
  lastUsedAt: Date
  createdAt: Date
}

/**
 * Session information
 */
export interface ISession {
  id: UUID
  userId: UUID
  tenantId: UUID
  token: string
  expiresAt: Date
  deviceId?: UUID
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  lastActivityAt: Date
}

/**
 * Permission check context
 */
export interface IPermissionContext {
  userId: UUID
  tenantId: UUID
  roles: string[]
  permissions: string[]
  locationId?: UUID // For location-specific permissions
}

/**
 * Authorization decision
 */
export interface IAuthorizationDecision {
  allowed: boolean
  reason?: string
}

/**
 * RBAC Rule
 */
export interface IRbacRule {
  resource: string
  action: string
  roles?: string[]
  condition?: (context: IPermissionContext) => boolean
}
