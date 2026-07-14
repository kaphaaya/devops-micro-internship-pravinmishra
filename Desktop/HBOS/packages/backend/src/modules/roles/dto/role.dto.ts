import type { UUID } from '@hbos/core'

/**
 * Permission Response DTO
 */
export class PermissionDto {
  id: UUID
  code: string
  name: string
  description?: string
  resource?: string
  action?: string
  createdAt: Date
}

/**
 * Role Response DTO
 */
export class RoleDto {
  id: UUID
  tenantId: UUID
  name: string
  description?: string
  isSystem: boolean
  permissions?: PermissionDto[]
  createdAt: Date
  updatedAt: Date
}

/**
 * UserRole Response DTO
 */
export class UserRoleDto {
  id: UUID
  tenantId: UUID
  userId: UUID
  roleId: UUID
  locationId?: UUID
  role?: RoleDto
  createdAt: Date
}
