import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  IsEnum,
  IsBoolean,
} from 'class-validator'

/**
 * Update Customer DTO
 */
export class UpdateCustomerDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsPhoneNumber()
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine1?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string

  @IsOptional()
  @IsEnum(['regular', 'vip', 'vip_plus', 'inactive'])
  customerType?: 'regular' | 'vip' | 'vip_plus' | 'inactive'

  @IsOptional()
  @IsBoolean()
  emailOptIn?: boolean

  @IsOptional()
  @IsBoolean()
  smsOptIn?: boolean

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive'

  @IsOptional()
  preferences?: Record<string, any>
}
