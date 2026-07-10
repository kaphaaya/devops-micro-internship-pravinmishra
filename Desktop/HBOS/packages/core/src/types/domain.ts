/**
 * Domain types for business entities
 */

import type { UUID, Timestamp, ITenantEntity, EntityStatus } from './common'

/**
 * Tenant - Root organization
 */
export interface ITenant {
  id: UUID
  name: string
  slug: string
  status: EntityStatus
  tier: 'starter' | 'professional' | 'enterprise'
  subscriptionEndsAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * User account
 */
export interface IUser extends ITenantEntity {
  email: string
  fullName: string
  phone?: string
  avatarUrl?: string
  status: EntityStatus
  emailVerified: boolean
  lastLoginAt?: Timestamp
  preferredLanguage: string
  timezone: string
}

/**
 * User role
 */
export interface IRole extends ITenantEntity {
  name: string
  description?: string
  isSystem: boolean
  permissions: string[]
}

/**
 * Permission
 */
export interface IPermission extends ITenantEntity {
  code: string
  name: string
  description?: string
  resource: string
  action: string
}

/**
 * Location - Physical business unit
 */
export interface ILocation extends ITenantEntity {
  name: string
  type: 'restaurant' | 'hotel' | 'cafe' | 'bar' | 'cloud_kitchen' | 'other'
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  timezone: string
  currencyCode: string
  status: EntityStatus
}

/**
 * Product - Menu item or inventory item
 */
export interface IProduct extends ITenantEntity {
  locationId?: UUID
  categoryId?: UUID
  sku?: string
  barcode?: string
  name: string
  description?: string
  imageUrl?: string
  unitPrice: number
  costPrice?: number
  taxPercentage: number
  unitOfMeasure: string
  isMenuItem: boolean
  isInventoryItem: boolean
  isTaxable: boolean
  status: EntityStatus
  metadata?: Record<string, any>
}

/**
 * Category for products
 */
export interface ICategory extends ITenantEntity {
  locationId?: UUID
  name: string
  description?: string
  imageUrl?: string
  displayOrder: number
  status: EntityStatus
}

/**
 * Order - POS transaction
 */
export interface IOrder extends ITenantEntity {
  locationId: UUID
  orderNumber: string
  customerId?: UUID
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  createdByUserId: UUID
  processedByUserId?: UUID
  subtotal: number
  taxAmount: number
  discountAmount: number
  tipAmount: number
  totalAmount: number
  paymentMethod?: string
  paymentStatus: 'pending' | 'completed' | 'refunded'
  paymentGatewayId?: string
  paidAt?: Timestamp
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  orderType: 'dine-in' | 'takeout' | 'delivery'
  tableId?: UUID
  notes?: string
  source: 'pos' | 'online' | 'delivery_app'
  createdAt: Timestamp
  startedAt?: Timestamp
  completedAt?: Timestamp
  updatedAt: Timestamp
  items?: IOrderItem[]
}

/**
 * Order item - Line in an order
 */
export interface IOrderItem {
  id: UUID
  orderId: UUID
  productId: UUID
  quantity: number
  unitPrice: number
  taxPercentage: number
  discountAmount: number
  lineTotal: number
  notes?: string
  metadata?: Record<string, any>
}

/**
 * Customer
 */
export interface ICustomer extends ITenantEntity {
  email?: string
  phone?: string
  firstName: string
  lastName: string
  address?: string
  city?: string
  postalCode?: string
  customerType: 'regular' | 'vip' | 'vip_plus' | 'inactive'
  totalVisits: number
  lifetimeValue: number
  averageOrderValue: number
  lastVisitAt?: Timestamp
  emailOptIn: boolean
  smsOptIn: boolean
  preferences?: Record<string, any>
  status: EntityStatus
}

/**
 * Inventory stock level
 */
export interface IInventory extends ITenantEntity {
  locationId: UUID
  productId: UUID
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
  reorderPoint?: number
  reorderQuantity?: number
  unitCost?: number
  lastCountedAt?: Timestamp
  lastRestockedAt?: Timestamp
}

/**
 * Supplier
 */
export interface ISupplier extends ITenantEntity {
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  paymentTerms?: string
  taxId?: string
  status: EntityStatus
}

/**
 * Purchase order
 */
export interface IPurchaseOrder extends ITenantEntity {
  locationId: UUID
  supplierId: UUID
  poNumber: string
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'
  totalAmount?: number
  taxAmount?: number
  expectedDeliveryDate?: Date
  receivedDate?: Timestamp
  notes?: string
  createdByUserId: UUID
  approvedByUserId?: UUID
  items?: IPurchaseOrderItem[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Purchase order item
 */
export interface IPurchaseOrderItem {
  id: UUID
  purchaseOrderId: UUID
  productId: UUID
  quantityOrdered: number
  quantityReceived: number
  unitPrice: number
  lineTotal: number
}

/**
 * Loyalty program
 */
export interface ILoyaltyProgram extends ITenantEntity {
  locationId?: UUID
  name: string
  description?: string
  type: 'points' | 'tiered' | 'percentage'
  pointsPerCurrencyUnit: number
  pointsExpiryDays?: number
  status: EntityStatus
}

/**
 * Customer loyalty account
 */
export interface ICustomerLoyalty extends ITenantEntity {
  customerId: UUID
  loyaltyProgramId: UUID
  currentPoints: number
  lifetimePoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  memberSince: Timestamp
}
