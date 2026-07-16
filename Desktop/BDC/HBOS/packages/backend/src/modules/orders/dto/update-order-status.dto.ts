import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

/**
 * Update Order Status DTO
 */
export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'confirmed', 'in_preparation', 'ready', 'completed', 'cancelled'])
  @IsNotEmpty()
  status: 'pending' | 'confirmed' | 'in_preparation' | 'ready' | 'completed' | 'cancelled'

  @IsOptional()
  @IsString()
  @MaxLength(500)
  internalNotes?: string
}
