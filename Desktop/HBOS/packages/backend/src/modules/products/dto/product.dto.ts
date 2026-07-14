import type { UUID } from '@hbos/core'

/**
 * Category Response DTO
 */
export class CategoryDto {
  id: UUID
  tenantId: UUID
  locationId?: UUID
  name: string
  description?: string
  imageUrl?: string
  displayOrder: number
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

/**
 * Product Response DTO
 */
export class ProductDto {
  id: UUID
  tenantId: UUID
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
  isActive: boolean
  status: 'active' | 'inactive' | 'discontinued'
  metadata?: Record<string, any>
  category?: CategoryDto
  createdAt: Date
  updatedAt: Date
}

/**
 * Product with category info
 */
export class ProductWithCategoryDto extends ProductDto {
  category: CategoryDto
}

/**
 * Product search result
 */
export class ProductSearchDto {
  id: UUID
  name: string
  sku?: string
  unitPrice: number
  categoryId?: UUID
  status: 'active' | 'inactive' | 'discontinued'
}
