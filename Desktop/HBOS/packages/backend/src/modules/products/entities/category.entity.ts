import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm'
import type { UUID } from '@hbos/core'
import { Product } from './product.entity'

/**
 * Category Entity - Product categories for menu organization
 */
@Entity('categories')
@Index(['tenantId', 'locationId', 'name'], { unique: true })
@Index(['tenantId', 'status'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'uuid', nullable: true })
  locationId?: UUID

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string

  @Column({ type: 'integer', default: 0 })
  displayOrder: number

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    enum: ['active', 'inactive'],
  })
  status: 'active' | 'inactive'

  @OneToMany(() => Product, product => product.category)
  products: Product[]

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
