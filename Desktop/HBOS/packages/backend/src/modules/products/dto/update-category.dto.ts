import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator'

/**
 * Update Category DTO
 */
export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string

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
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive'
}
