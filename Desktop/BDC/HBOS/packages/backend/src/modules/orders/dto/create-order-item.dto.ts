import {
  IsUUID,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator'

/**
 * Create Order Item DTO
 */
export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string

  @IsNumber()
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  quantity: number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialInstructions?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  courseNumber?: number
}
