import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

/**
 * Assign Role to User DTO
 */
export class AssignRoleDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @IsUUID()
  @IsNotEmpty()
  roleId: string

  @IsOptional()
  @IsUUID()
  locationId?: string
}
