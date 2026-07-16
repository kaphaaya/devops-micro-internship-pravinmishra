import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator'

/**
 * Adjust Inventory DTO
 */
export class AdjustInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsEnum(['received', 'adjustment', 'return', 'damage', 'expired'])
  @IsNotEmpty()
  type: 'received' | 'adjustment' | 'return' | 'damage' | 'expired'

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string

  @IsOptional()
  @IsUUID()
  orderId?: string

  @IsOptional()
  metadata?: Record<string, any>
}
