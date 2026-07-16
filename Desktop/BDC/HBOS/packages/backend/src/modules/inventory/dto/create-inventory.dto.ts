import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  Min,
  MaxLength,
} from 'class-validator'

/**
 * Create Inventory DTO
 */
export class CreateInventoryDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string

  @IsOptional()
  @IsUUID()
  locationId?: string

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantityOnHand: number

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
