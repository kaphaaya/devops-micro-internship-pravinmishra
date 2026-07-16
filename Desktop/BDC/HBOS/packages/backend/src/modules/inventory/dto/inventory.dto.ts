/**
 * Inventory DTO (Response)
 */
export class InventoryDto {
  id: string
  tenantId: string
  locationId?: string
  productId: string
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
  reorderLevel: number
  reorderQuantity: number
  unitOfMeasure: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  lastRestockedAt?: Date
  lastCountedAt?: Date
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

/**
 * Inventory Audit DTO (Response)
 */
export class InventoryAuditDto {
  id: string
  tenantId: string
  inventoryId: string
  productId: string
  type: 'initial' | 'received' | 'sold' | 'adjustment' | 'return' | 'damage' | 'count' | 'expired'
  quantityChanged: number
  quantityBefore: number
  quantityAfter: number
  orderId?: string
  userId?: string
  notes?: string
  metadata?: Record<string, any>
  createdAt: Date
}
