import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import type { UUID } from '@hbos/core'

/**
 * AuthenticationMethod Entity - Stores MFA and OAuth credentials
 */
@Entity('authentication_methods')
@Index(['tenantId', 'userId', 'type'], { unique: true })
@Index(['isVerified'])
export class AuthenticationMethod {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @Column('uuid')
  tenantId: UUID

  @Column('uuid')
  userId: UUID

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['password', 'totp', 'sms', 'oauth'],
  })
  type: 'password' | 'totp' | 'sms' | 'oauth'

  @Column({ type: 'varchar', length: 50, nullable: true })
  provider?: string // 'google', 'microsoft', 'github', 'apple'

  // TOTP backup codes (encrypted in production)
  @Column({ type: 'text', array: true, nullable: true })
  @Exclude()
  backupCodes?: string[]

  // OAuth provider data
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerUserId?: string

  @Column({ type: 'text', nullable: true })
  @Exclude()
  providerAccessToken?: string

  @Column({ type: 'text', nullable: true })
  @Exclude()
  providerRefreshToken?: string

  // Verification
  @Column({ type: 'boolean', default: false })
  isPrimary: boolean

  @Column({ type: 'boolean', default: false })
  isVerified: boolean

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date

  // Audit
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
