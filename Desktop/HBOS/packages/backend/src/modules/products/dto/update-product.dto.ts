import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator'

/**
 * Update Product DTO
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string

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

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number

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
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsEnum(['active', 'inactive', 'discontinued'])
  status?: 'active' | 'inactive' | 'discontinued'

  @IsOptional()
  @IsUUID()
  categoryId?: string

  @IsOptional()
  metadata?: Record<string, any>
}
