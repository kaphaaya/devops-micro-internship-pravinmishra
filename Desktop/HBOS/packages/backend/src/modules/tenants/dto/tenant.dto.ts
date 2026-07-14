import type { UUID } from '@hbos/core'

/**
 * Tenant Response DTO
 * Used for API responses when returning tenant data
 */
export class TenantDto {
  id: UUID
  name: string
  slug: string
  status: 'active' | 'suspended' | 'deleted'
  tier: 'starter' | 'professional' | 'enterprise'
  subscriptionEndsAt?: Date
  features?: Record<string, boolean>
  createdAt: Date
  updatedAt: Date
}

/**
 * Tenant with subscription info
 */
export class TenantWithSubscriptionDto extends TenantDto {
  isSubscriptionActive: boolean
  daysUntilExpiration?: number
}
