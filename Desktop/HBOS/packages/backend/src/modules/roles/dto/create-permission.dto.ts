import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * Create Permission DTO
 */
export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Code must not exceed 100 characters' })
  code: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  resource?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  action?: string
}
