import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToMany,
} from 'typeorm'
import type { UUID } from '@hbos/core'
import { Role } from './role.entity'

/**
 * Permission Entity - Represents a permission that can be assigned to roles
 * Uses resource:action pattern (e.g., 'orders:create', 'products:update')
 */
@Entity('permissions')
@Index(['tenantId', 'code'], { unique: true })
@Index(['tenantId', 'resource'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column({ type: 'varchar', length: 100 })
  code: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  resource?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  action?: string

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[]

  // Audit fields
  @CreateDateColumn()
  createdAt: Date
}
