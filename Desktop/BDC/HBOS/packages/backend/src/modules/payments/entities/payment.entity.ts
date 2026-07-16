import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'
import type { UUID } from '@hbos/core'

/**
 * Payment Entity - Represents a payment transaction
 */
@Entity('payments')
@Index(['tenantId', 'transactionId'], { unique: true })
@Index(['tenantId', 'orderId'])
@Index(['tenantId', 'status'])
@Index(['tenantId', 'createdAt'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'uuid', nullable: true })
  locationId?: UUID

  @Column('uuid')
  orderId: UUID

  @Column({ type: 'uuid', nullable: true })
  customerId?: UUID

  // Transaction Identification
  @Column({ type: 'varchar', length: 100 })
  transactionId: string

  // Payment Method
  @Column({
    type: 'varchar',
    length: 50,
    default: 'card',
    enum: ['card', 'cash', 'mobile', 'check', 'bank_transfer', 'gift_card'],
  })
  paymentMethod: 'card' | 'cash' | 'mobile' | 'check' | 'bank_transfer' | 'gift_card'

  // Amount
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  processingFee: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  netAmount: number

  // Status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
    enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
  })
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'

  // Card Details (only last 4 digits for PCI compliance)
  @Column({ type: 'varchar', length: 4, nullable: true })
  cardLast4?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  cardBrand?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  cardholderName?: string

  // Stripe Integration
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentIntentId?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeChargeId?: string

  // Response Details
  @Column({ type: 'text', nullable: true })
  failureReason?: string

  @Column({ type: 'text', nullable: true })
  receiptUrl?: string

  // Refund Tracking
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  refundedAmount: number

  @Column({ type: 'uuid', nullable: true })
  refundedByPaymentId?: UUID

  @Column({ type: 'timestamp', nullable: true })
  refundedAt?: Date

  // Timestamps
  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  // Metadata
  @Column({
    type: 'jsonb',
    default: () => "'{}'",
    nullable: true,
  })
  metadata?: Record<string, any>

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
