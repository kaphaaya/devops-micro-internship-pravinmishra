import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import type { UUID } from '@hbos/core'

/**
 * User Entity - Represents a user account in the system
 */
@Entity('users')
@Index(['tenantId', 'email'], { unique: true })
@Index(['status'])
@Index(['createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  passwordHash: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string

  // Authentication status
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date

  // Account status
  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
    enum: ['active', 'inactive', 'suspended', 'pending'],
  })
  status: 'active' | 'inactive' | 'suspended' | 'pending'

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date

  @Column({ type: 'integer', default: 0 })
  failedLoginAttempts: number

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date

  // User preferences
  @Column({ type: 'varchar', length: 10, default: 'en' })
  preferredLanguage: string

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone: string

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

  // Relations (to be added when other modules are created)
  // @OneToMany(() => AuthenticationMethod, auth => auth.user)
  // authenticationMethods: AuthenticationMethod[]
}
