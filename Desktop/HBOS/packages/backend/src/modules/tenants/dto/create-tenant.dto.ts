import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches } from 'class-validator'

/**
 * Create Tenant DTO
 * Used for creating new tenants
 */
export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Slug must be at least 2 characters' })
  @MaxLength(255, { message: 'Slug must not exceed 255 characters' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string

  @IsOptional()
  @IsString()
  tier?: 'starter' | 'professional' | 'enterprise'

  @IsOptional()
  subscriptionEndsAt?: Date
}
