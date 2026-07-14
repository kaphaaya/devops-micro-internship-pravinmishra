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
import { Category } from './category.entity'

/**
 * Product Entity - Menu items and inventory items
 */
@Entity('products')
@Index(['tenantId', 'locationId'])
@Index(['tenantId', 'sku'], { unique: true })
@Index(['tenantId', 'categoryId'])
@Index(['tenantId', 'status'])
@Index(['tenantId', 'isMenuitem'])
@Index(['tenantId', 'isInventoryItem'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'uuid', nullable: true })
  locationId?: UUID

  @Column({ type: 'uuid', nullable: true })
  categoryId?: UUID

  // Product Info
  @Column({ type: 'varchar', length: 100, nullable: true })
  sku?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode?: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string

  // Pricing
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice?: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxPercentage: number

  // Measurement
  @Column({
    type: 'varchar',
    length: 20,
    default: 'piece',
  })
  unitOfMeasure: string

  // Flags
  @Column({ type: 'boolean', default: true })
  isMenuItem: boolean

  @Column({ type: 'boolean', default: false })
  isInventoryItem: boolean

  @Column({ type: 'boolean', default: true })
  isTaxable: boolean

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    enum: ['active', 'inactive', 'discontinued'],
  })
  status: 'active' | 'inactive' | 'discontinued'

  // Metadata (allergens, ingredients, preparation time, etc.)
  @Column({
    type: 'jsonb',
    default: () => "'{}'",
    nullable: true,
  })
  metadata?: Record<string, any>

  @ManyToOne(() => Category, category => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: Category

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
