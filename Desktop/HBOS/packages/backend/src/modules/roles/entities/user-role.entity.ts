import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import type { UUID } from '@hbos/core'
import { Role } from './role.entity'

/**
 * UserRole Entity - Maps users to roles
 * Supports tenant-wide and location-specific role assignments
 */
@Entity('user_roles')
@Index(['tenantId', 'userId', 'roleId', 'locationId'], { unique: true })
@Index(['tenantId', 'userId'])
@Index(['tenantId', 'roleId'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column('uuid')
  userId: UUID

  @Column('uuid')
  roleId: UUID

  @Column({ type: 'uuid', nullable: true })
  locationId?: UUID

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role

  // Audit fields
  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
