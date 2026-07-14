import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator'

/**
 * Create Product DTO
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string

  @IsNumber()
  @Min(0, { message: 'Unit price must be greater than or equal to 0' })
  unitPrice: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxPercentage?: number

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unitOfMeasure?: string

  @IsOptional()
  @IsBoolean()
  isMenuItem?: boolean

  @IsOptional()
  @IsBoolean()
  isInventoryItem?: boolean

  @IsOptional()
  @IsBoolean()
  isTaxable?: boolean

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  @IsUUID()
  locationId?: string

  @IsOptional()
  metadata?: Record<string, any>
}
