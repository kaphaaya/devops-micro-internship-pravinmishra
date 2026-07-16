import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import type { UUID } from '@hbos/core'
import { Inventory } from './inventory.entity'

/**
 * InventoryAudit Entity - Audit trail for inventory changes
 */
@Entity('inventory_audit')
@Index(['tenantId', 'inventoryId', 'createdAt'])
@Index(['tenantId', 'productId', 'createdAt'])
@Index(['tenantId', 'type'])
export class InventoryAudit {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column('uuid')
  inventoryId: UUID

  @Column('uuid')
  productId: UUID

  // Audit Type
  @Column({
    type: 'varchar',
    length: 50,
    enum: ['initial', 'received', 'sold', 'adjustment', 'return', 'damage', 'count', 'expired'],
  })
  type: 'initial' | 'received' | 'sold' | 'adjustment' | 'return' | 'damage' | 'count' | 'expired'

  // Quantity Change
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityChanged: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityBefore: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantityAfter: number

  // References
  @Column({ type: 'uuid', nullable: true })
  orderId?: UUID

  @Column({ type: 'uuid', nullable: true })
  userId?: UUID

  // Notes
  @Column({ type: 'text', nullable: true })
  notes?: string

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

  // Relations
  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory?: Inventory
}
