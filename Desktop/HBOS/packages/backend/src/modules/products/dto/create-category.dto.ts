import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength, MaxLength, IsEnum } from 'class-validator'

/**
 * Create Category DTO
 */
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string

  @IsOptional()
  displayOrder?: number

  @IsOptional()
  @IsUUID()
  locationId?: string
}
