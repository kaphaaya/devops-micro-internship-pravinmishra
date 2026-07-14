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
 * Tenant Entity - Represents an organization/business in the system
 * Supports multi-tenancy with Row-Level Security (RLS)
 */
@Entity('tenants')
@Index(['slug'], { unique: true })
@Index(['status'])
@Index(['createdAt'])
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    enum: ['active', 'suspended', 'deleted'],
  })
  status: 'active' | 'suspended' | 'deleted'

  @Column({
    type: 'varchar',
    length: 50,
    default: 'starter',
    enum: ['starter', 'professional', 'enterprise'],
  })
  tier: 'starter' | 'professional' | 'enterprise'

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndsAt?: Date

  @Column({
    type: 'jsonb',
    default: () => "'{}'",
    nullable: true,
  })
  features?: Record<string, boolean>

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
