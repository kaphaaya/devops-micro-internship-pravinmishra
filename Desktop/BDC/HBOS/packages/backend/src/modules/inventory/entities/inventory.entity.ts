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

/**
 * Inventory Entity - Tracks stock levels for products
 */
@Entity('inventory')
@Index(['tenantId', 'productId'], { unique: true })
@Index(['tenantId', 'locationId', 'productId'], { unique: true })
@Index(['tenantId', 'status'])
@Index(['tenantId', 'quantityOnHand'])
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'uuid', nullable: true })
  locationId?: UUID

  @Column('uuid')
  productId: UUID

  // Stock Levels
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantityOnHand: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantityReserved: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantityAvailable: number

  // Reorder Settings
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  reorderLevel: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  reorderQuantity: number

  // Unit of Measure
  @Column({ type: 'varchar', length: 20, default: 'piece' })
  unitOfMeasure: string

  // Status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'in_stock',
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
  })
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'

  // Tracking
  @Column({ type: 'timestamp', nullable: true })
  lastRestockedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  lastCountedAt?: Date

  // Supplier & Location Info
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
