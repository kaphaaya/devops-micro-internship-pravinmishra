import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator'

/**
 * Refund Payment DTO
 */
export class RefundPaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string

  @IsOptional()
  metadata?: Record<string, any>
}
