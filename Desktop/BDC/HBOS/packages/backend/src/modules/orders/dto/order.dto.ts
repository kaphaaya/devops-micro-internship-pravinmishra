import { IsUUID, IsString, IsNumber, IsEnum, IsOptional, IsDate } from 'class-validator'

/**
 * Order Item DTO (Response)
 */
export class OrderItemDto {
  id: string
  orderId: string
  productId: string
  productName: string
  sku?: string
  quantity: number
  unitPrice: number
  itemSubtotal: number
  taxPercentage: number
  taxAmount: number
  discountAmount: number
  itemTotal: number
  specialInstructions?: string
  preparationStatus: 'pending' | 'in_preparation' | 'ready' | 'served' | 'cancelled'
  courseNumber: number
  readyAt?: Date
  servedAt?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Order DTO (Response)
 */
export class OrderDto {
  id: string
  tenantId: string
  locationId?: string
  customerId?: string
  orderNumber: string
  orderType: 'dine_in' | 'takeout' | 'delivery'
  status: 'pending' | 'confirmed' | 'in_preparation' | 'ready' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded'
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  notes?: string
  internalNotes?: string
  tableNumber?: string
  confirmedAt?: Date
  completedAt?: Date
  cancelledAt?: Date
  items?: OrderItemDto[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Order List Query DTO
 */
export class OrderListQueryDto {
  skip?: number
  take?: number
  status?: string
  paymentStatus?: string
  customerId?: string
  startDate?: Date
  endDate?: Date
}
