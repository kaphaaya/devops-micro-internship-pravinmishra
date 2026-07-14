import { IsString, IsOptional, MinLength, MaxLength, Matches, IsEnum } from 'class-validator'

/**
 * Update Tenant DTO
 * Used for updating tenant details (name, tier, status, etc.)
 */
export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string

  @IsOptional()
  @IsEnum(['starter', 'professional', 'enterprise'])
  tier?: 'starter' | 'professional' | 'enterprise'

  @IsOptional()
  @IsEnum(['active', 'suspended', 'deleted'])
  status?: 'active' | 'suspended' | 'deleted'

  @IsOptional()
  subscriptionEndsAt?: Date

  @IsOptional()
  features?: Record<string, boolean>
}
