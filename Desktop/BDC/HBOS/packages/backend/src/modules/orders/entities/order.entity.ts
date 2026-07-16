import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm'
import type { UUID } from '@hbos/core'
import { OrderItem } from './order-item.entity'

/**
 * Order Entity - Represents a customer order
 */
@Entity('orders')
@Index(['tenantId', 'orderNumber'], { unique: true })
@Index(['tenantId', 'customerId'])
@Index(['tenantId', 'status'])
@Index(['tenantId', 'createdAt'])
@Index(['tenantId', 'totalAmount'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'uuid', nullable: true })
  locationId?: UUID

  @Column({ type: 'uuid', nullable: true })
  customerId?: UUID

  // Order Identification
  @Column({ type: 'varchar', length: 50 })
  orderNumber: string

  // Order Type
  @Column({
    type: 'varchar',
    length: 20,
    default: 'dine_in',
    enum: ['dine_in', 'takeout', 'delivery'],
  })
  orderType: 'dine_in' | 'takeout' | 'delivery'

  // Status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
    enum: ['pending', 'confirmed', 'in_preparation', 'ready', 'completed', 'cancelled'],
  })
  status: 'pending' | 'confirmed' | 'in_preparation' | 'ready' | 'completed' | 'cancelled'

  // Payment Status
  @Column({
    type: 'varchar',
    length: 20,
    default: 'unpaid',
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
  })
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded'

  // Pricing (using decimal for precision)
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discountAmount: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number

  // Special Information
  @Column({ type: 'text', nullable: true })
  notes?: string

  @Column({ type: 'text', nullable: true })
  internalNotes?: string

  // Table/Seat Info (for dine-in)
  @Column({ type: 'varchar', length: 50, nullable: true })
  tableNumber?: string

  // Timestamps
  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date

  // Relations
  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items?: OrderItem[]

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
