import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

/**
 * Update Inventory DTO
 */
export class UpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderQuantity?: number

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unitOfMeasure?: string

  @IsOptional()
  metadata?: Record<string, any>
}
