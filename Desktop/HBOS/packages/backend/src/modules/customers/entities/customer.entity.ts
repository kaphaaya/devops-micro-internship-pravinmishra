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
 * Customer Entity - Represents a customer in the system
 */
@Entity('customers')
@Index(['tenantId', 'email'], { unique: true })
@Index(['tenantId', 'phone'], { unique: true })
@Index(['tenantId', 'customerType'])
@Index(['tenantId', 'status'])
@Index(['tenantId', 'createdAt'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string

  // Address
  @Column({ type: 'varchar', length: 255, nullable: true })
  addressLine1?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode?: string

  // Classification
  @Column({
    type: 'varchar',
    length: 50,
    default: 'regular',
    enum: ['regular', 'vip', 'vip_plus', 'inactive'],
  })
  customerType: 'regular' | 'vip' | 'vip_plus' | 'inactive'

  // Metrics
  @Column({ type: 'integer', default: 0 })
  totalVisits: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  lifetimeValue: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageOrderValue: number

  @Column({ type: 'timestamp', nullable: true })
  lastVisitAt?: Date

  // Communication
  @Column({ type: 'boolean', default: false })
  emailOptIn: boolean

  @Column({ type: 'boolean', default: false })
  smsOptIn: boolean

  // Preferences (dietary restrictions, seating preference, etc.)
  @Column({
    type: 'jsonb',
    default: () => "'{}'",
    nullable: true,
  })
  preferences?: Record<string, any>

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    enum: ['active', 'inactive'],
  })
  status: 'active' | 'inactive'

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
