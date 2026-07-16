import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import type { UUID } from '@hbos/core'
import { Order } from './order.entity'

/**
 * OrderItem Entity - Represents line items in an order
 */
@Entity('order_items')
@Index(['orderId', 'productId'])
@Index(['tenantId', 'orderId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column('uuid')
  orderId: UUID

  @Column('uuid')
  productId: UUID

  // Product Information (snapshot at time of order)
  @Column({ type: 'varchar', length: 255 })
  productName: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku?: string

  // Quantity and Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  itemSubtotal: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxPercentage: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  itemTotal: number

  // Special Instructions
  @Column({ type: 'text', nullable: true })
  specialInstructions?: string

  // Preparation Status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'pending',
    enum: ['pending', 'in_preparation', 'ready', 'served', 'cancelled'],
  })
  preparationStatus: 'pending' | 'in_preparation' | 'ready' | 'served' | 'cancelled'

  @Column({ type: 'timestamp', nullable: true })
  readyAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  servedAt?: Date

  // Course number (for multi-course meals)
  @Column({ type: 'integer', default: 1 })
  courseNumber: number

  // Relations
  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order?: Order

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
