import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsEnum,
  IsBoolean,
} from 'class-validator'

/**
 * Create Customer DTO
 */
export class CreateCustomerDto {
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
  preferences?: Record<string, any>
}
