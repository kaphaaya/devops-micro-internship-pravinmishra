import { IsString, IsOptional, IsArray, MinLength, MaxLength } from 'class-validator'

/**
 * Update Role DTO
 */
export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string

  @IsOptional()
  @IsArray()
  permissionIds?: string[]
}
