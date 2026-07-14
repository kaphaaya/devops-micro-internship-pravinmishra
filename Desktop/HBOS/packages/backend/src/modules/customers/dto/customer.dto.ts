import type { UUID } from '@hbos/core'

/**
 * Customer Response DTO
 */
export class CustomerDto {
  id: UUID
  tenantId: UUID
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  addressLine1?: string
  city?: string
  postalCode?: string
  customerType: 'regular' | 'vip' | 'vip_plus' | 'inactive'
  totalVisits: number
  lifetimeValue: number
  averageOrderValue: number
  lastVisitAt?: Date
  emailOptIn: boolean
  smsOptIn: boolean
  preferences?: Record<string, any>
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

/**
 * Customer with display name
 */
export class CustomerWithNameDto extends CustomerDto {
  displayName: string
}

/**
 * Customer search result (minimal fields)
 */
export class CustomerSearchDto {
  id: UUID
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  customerType: 'regular' | 'vip' | 'vip_plus' | 'inactive'
  totalVisits: number
  lifetimeValue: number
}

/**
 * Customer metrics
 */
export class CustomerMetricsDto {
  totalVisits: number
  lifetimeValue: number
  averageOrderValue: number
  lastVisitAt?: Date
}
