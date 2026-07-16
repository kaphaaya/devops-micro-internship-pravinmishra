/**
 * Payment DTO (Response)
 */
export class PaymentDto {
  id: string
  tenantId: string
  locationId?: string
  orderId: string
  customerId?: string
  transactionId: string
  paymentMethod: 'card' | 'cash' | 'mobile' | 'check' | 'bank_transfer' | 'gift_card'
  amount: number
  processingFee: number
  netAmount: number
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
  cardLast4?: string
  cardBrand?: string
  cardholderName?: string
  failureReason?: string
  receiptUrl?: string
  refundedAmount: number
  refundedAt?: Date
  processedAt?: Date
  completedAt?: Date
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment Intent DTO (for Stripe integration)
 */
export class PaymentIntentDto {
  clientSecret: string
  paymentIntentId: string
  amount: number
  status: string
}
