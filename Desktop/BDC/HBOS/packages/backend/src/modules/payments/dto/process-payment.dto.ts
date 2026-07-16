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
 * Process Payment DTO
 */
export class ProcessPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string

  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number

  @IsEnum(['card', 'cash', 'mobile', 'check', 'bank_transfer', 'gift_card'])
  @IsNotEmpty()
  paymentMethod: 'card' | 'cash' | 'mobile' | 'check' | 'bank_transfer' | 'gift_card'

  // For card payments
  @IsOptional()
  @IsString()
  stripePaymentMethodId?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cardholderName?: string

  // For other methods
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string

  @IsOptional()
  metadata?: Record<string, any>
}
