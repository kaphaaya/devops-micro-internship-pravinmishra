import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { UserRole } from './entities/user-role.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { AssignRoleDto } from './dto/assign-role.dto'
import { RoleDto, PermissionDto, UserRoleDto } from './dto/role.dto'
import { generateUUID } from '@hbos/core'

/**
 * Roles Service
 * Handles role and permission management for RBAC
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
  ) {}

  // ============================================================================
  // Role Management
  // ============================================================================

  /**
   * Create a new role
   */
  async createRole(tenantId: string, createRoleDto: CreateRoleDto): Promise<RoleDto> {
    const { name, description, permissionIds = [] } = createRoleDto

    // Check if role already exists
    const existingRole = await this.rolesRepository.findOne({
      where: { tenantId: tenantId as any, name },
    })

    if (existingRole) {
      throw new ConflictException(`Role "${name}" already exists in this tenant`)
    }

    // Get permissions
    const permissions = permissionIds.length > 0
      ? await this.permissionsRepository.find({
          where: permissionIds.map(id => ({ id: id as any, tenantId: tenantId as any })),
        })
      : []

    // Create role
    const role = this.rolesRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      name,
      description,
      isSystem: false,
      permissions,
    })

    const savedRole = await this.rolesRepository.save(role)
    return this.mapRoleToDto(savedRole)
  }

  /**
   * Get role by ID
   */
  async getRoleById(tenantId: string, roleId: string): Promise<RoleDto> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId as any, tenantId: tenantId as any },
      relations: ['permissions'],
    })

    if (!role) {
      throw new NotFoundException(`Role not found`)
    }

    return this.mapRoleToDto(role)
  }

  /**
   * List all roles for a tenant
   */
  async listRoles(
    tenantId: string,
    skip = 0,
    take = 20,
  ): Promise<{ data: RoleDto[]; total: number }> {
    const [roles, total] = await this.rolesRepository.findAndCount({
      where: { tenantId: tenantId as any },
      relations: ['permissions'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: roles.map(r => this.mapRoleToDto(r)),
      total,
    }
  }

  /**
   * Update role
   */
  async updateRole(
    tenantId: string,
    roleId: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDto> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId as any, tenantId: tenantId as any },
      relations: ['permissions'],
    })

    if (!role) {
      throw new NotFoundException(`Role not found`)
    }

    // Prevent updating system roles
    if (role.isSystem) {
      throw new ForbiddenException('Cannot modify system roles')
    }

    // Update allowed fields
    if (updateRoleDto.name) {
      const existing = await this.rolesRepository.findOne({
        where: { tenantId: tenantId as any, name: updateRoleDto.name },
      })
      if (existing && existing.id !== role.id) {
        throw new ConflictException(`Role "${updateRoleDto.name}" already exists`)
      }
      role.name = updateRoleDto.name
    }

    if (updateRoleDto.description) {
      role.description = updateRoleDto.description
    }

    // Update permissions if provided
    if (updateRoleDto.permissionIds) {
      const permissions = await this.permissionsRepository.find({
        where: updateRoleDto.permissionIds.map(id => ({
          id: id as any,
          tenantId: tenantId as any,
        })),
      })
      role.permissions = permissions
    }

    const updatedRole = await this.rolesRepository.save(role)
    return this.mapRoleToDto(updatedRole)
  }

  /**
   * Delete role
   */
  async deleteRole(tenantId: string, roleId: string): Promise<void> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId as any, tenantId: tenantId as any },
    })

    if (!role) {
      throw new NotFoundException(`Role not found`)
    }

    if (role.isSystem) {
      throw new ForbiddenException('Cannot delete system roles')
    }

    // Check if role is assigned to any users
    const userRoleCount = await this.userRolesRepository.count({
      where: { roleId: roleId as any, tenantId: tenantId as any },
    })

    if (userRoleCount > 0) {
      throw new BadRequestException(
        `Cannot delete role that is assigned to ${userRoleCount} user(s)`,
      )
    }

    await this.rolesRepository.delete({ id: roleId as any, tenantId: tenantId as any })
  }

  // ============================================================================
  // Permission Management
  // ============================================================================

  /**
   * Create a new permission
   */
  async createPermission(
    tenantId: string,
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    const { code, name, description, resource, action } = createPermissionDto

    // Check if permission already exists
    const existingPermission = await this.permissionsRepository.findOne({
      where: { tenantId: tenantId as any, code },
    })

    if (existingPermission) {
      throw new ConflictException(`Permission "${code}" already exists`)
    }

    // Create permission
    const permission = this.permissionsRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      code,
      name,
      description,
      resource,
      action,
    })

    const savedPermission = await this.permissionsRepository.save(permission)
    return this.mapPermissionToDto(savedPermission)
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(tenantId: string, permissionId: string): Promise<PermissionDto> {
    const permission = await this.permissionsRepository.findOne({
      where: { id: permissionId as any, tenantId: tenantId as any },
    })

    if (!permission) {
      throw new NotFoundException(`Permission not found`)
    }

    return this.mapPermissionToDto(permission)
  }

  /**
   * List all permissions for a tenant
   */
  async listPermissions(
    tenantId: string,
    skip = 0,
    take = 100,
  ): Promise<{ data: PermissionDto[]; total: number }> {
    const [permissions, total] = await this.permissionsRepository.findAndCount({
      where: { tenantId: tenantId as any },
      skip,
      take,
      order: { code: 'ASC' },
    })

    return {
      data: permissions.map(p => this.mapPermissionToDto(p)),
      total,
    }
  }

  /**
   * Get permissions by resource
   */
  async getPermissionsByResource(
    tenantId: string,
    resource: string,
  ): Promise<PermissionDto[]> {
    const permissions = await this.permissionsRepository.find({
      where: { tenantId: tenantId as any, resource },
      order: { action: 'ASC' },
    })

    return permissions.map(p => this.mapPermissionToDto(p))
  }

  // ============================================================================
  // User Role Assignment
  // ============================================================================

  /**
   * Assign role to user
   */
  async assignRoleToUser(
    tenantId: string,
    assignRoleDto: AssignRoleDto,
  ): Promise<UserRoleDto> {
    const { userId, roleId, locationId } = assignRoleDto

    // Verify role exists
    const role = await this.rolesRepository.findOne({
      where: { id: roleId as any, tenantId: tenantId as any },
    })

    if (!role) {
      throw new NotFoundException(`Role not found`)
    }

    // Check if assignment already exists
    const existing = await this.userRolesRepository.findOne({
      where: {
        tenantId: tenantId as any,
        userId: userId as any,
        roleId: roleId as any,
        locationId: locationId as any,
      },
    })

    if (existing && !existing.deletedAt) {
      throw new ConflictException('User already has this role assigned')
    }

    // If soft-deleted, restore it
    if (existing && existing.deletedAt) {
      existing.deletedAt = null
      const saved = await this.userRolesRepository.save(existing)
      return this.mapUserRoleToDto(saved)
    }

    // Create new assignment
    const userRole = this.userRolesRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      userId: userId as any,
      roleId: roleId as any,
      locationId: locationId as any,
    })

    const savedUserRole = await this.userRolesRepository.save(userRole)
    return this.mapUserRoleToDto(savedUserRole)
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(
    tenantId: string,
    userId: string,
    roleId: string,
    locationId?: string,
  ): Promise<void> {
    const userRole = await this.userRolesRepository.findOne({
      where: {
        tenantId: tenantId as any,
        userId: userId as any,
        roleId: roleId as any,
        locationId: locationId as any,
      },
    })

    if (!userRole) {
      throw new NotFoundException('User role assignment not found')
    }

    await this.userRolesRepository.softDelete({ id: userRole.id })
  }

  /**
   * Get all roles for a user
   */
  async getUserRoles(
    tenantId: string,
    userId: string,
    locationId?: string,
  ): Promise<UserRoleDto[]> {
    const query = this.userRolesRepository
      .createQueryBuilder('ur')
      .leftJoinAndSelect('ur.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('ur.tenantId = :tenantId', { tenantId })
      .andWhere('ur.userId = :userId', { userId })

    if (locationId) {
      query.andWhere('(ur.locationId = :locationId OR ur.locationId IS NULL)', {
        locationId,
      })
    }

    const userRoles = await query.getMany()
    return userRoles.map(ur => this.mapUserRoleToDto(ur))
  }

  /**
   * Get all users with a role
   */
  async getUsersWithRole(
    tenantId: string,
    roleId: string,
    locationId?: string,
  ): Promise<{ userId: string; locationId?: string }[]> {
    const query = this.userRolesRepository
      .createQueryBuilder('ur')
      .select('ur.userId', 'userId')
      .addSelect('ur.locationId', 'locationId')
      .where('ur.tenantId = :tenantId', { tenantId })
      .andWhere('ur.roleId = :roleId', { roleId })

    if (locationId) {
      query.andWhere('(ur.locationId = :locationId OR ur.locationId IS NULL)', {
        locationId,
      })
    }

    const result = await query.getRawMany()
    return result
  }

  // ============================================================================
  // Permission Checking
  // ============================================================================

  /**
   * Check if user has a specific permission
   */
  async userHasPermission(
    tenantId: string,
    userId: string,
    permissionCode: string,
    locationId?: string,
  ): Promise<boolean> {
    const userRoles = await this.getUserRoles(tenantId, userId, locationId)

    if (userRoles.length === 0) {
      return false
    }

    // Check if any of the user's roles has the permission
    for (const userRole of userRoles) {
      if (!userRole.role) {
        continue
      }

      const hasPermission = userRole.role.permissions?.some(
        p => p.code === permissionCode,
      )

      if (hasPermission) {
        return true
      }
    }

    return false
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(
    tenantId: string,
    userId: string,
    locationId?: string,
  ): Promise<PermissionDto[]> {
    const userRoles = await this.getUserRoles(tenantId, userId, locationId)

    // Collect unique permissions from all roles
    const permissionMap = new Map<string, PermissionDto>()

    for (const userRole of userRoles) {
      if (!userRole.role?.permissions) {
        continue
      }

      for (const permission of userRole.role.permissions) {
        permissionMap.set(permission.id, this.mapPermissionToDto(permission))
      }
    }

    return Array.from(permissionMap.values())
  }

  /**
   * Get permission codes for a user (for JWT payload)
   */
  async getUserPermissionCodes(
    tenantId: string,
    userId: string,
    locationId?: string,
  ): Promise<string[]> {
    const permissions = await this.getUserPermissions(tenantId, userId, locationId)
    return permissions.map(p => p.code)
  }

  // ============================================================================
  // System Roles
  // ============================================================================

  /**
   * Initialize system roles for a tenant
   * Called when a tenant is created
   */
  async initializeSystemRoles(tenantId: string): Promise<void> {
    // Check if roles already exist
    const existingRoles = await this.rolesRepository.count({
      where: { tenantId: tenantId as any, isSystem: true },
    })

    if (existingRoles > 0) {
      return
    }

    const systemRoles = [
      { name: 'Super Admin', permissions: [] },
      { name: 'Admin', permissions: [] },
      { name: 'Manager', permissions: [] },
      { name: 'Staff', permissions: [] },
    ]

    for (const roleData of systemRoles) {
      const role = this.rolesRepository.create({
        id: generateUUID() as any,
        tenantId: tenantId as any,
        name: roleData.name,
        isSystem: true,
        description: `System role: ${roleData.name}`,
        permissions: [],
      })

      await this.rolesRepository.save(role)
    }
  }

  /**
   * Get system role
   */
  async getSystemRole(tenantId: string, roleName: string): Promise<RoleDto> {
    const role = await this.rolesRepository.findOne({
      where: { tenantId: tenantId as any, name: roleName, isSystem: true },
      relations: ['permissions'],
    })

    if (!role) {
      throw new NotFoundException(`System role "${roleName}" not found`)
    }

    return this.mapRoleToDto(role)
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private mapRoleToDto(role: Role): RoleDto {
    return {
      id: role.id,
      tenantId: role.tenantId,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions?.map(p => this.mapPermissionToDto(p)),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }
  }

  private mapPermissionToDto(permission: Permission): PermissionDto {
    return {
      id: permission.id,
      code: permission.code,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      createdAt: permission.createdAt,
    }
  }

  private mapUserRoleToDto(userRole: UserRole): UserRoleDto {
    return {
      id: userRole.id,
      tenantId: userRole.tenantId,
      userId: userRole.userId,
      roleId: userRole.roleId,
      locationId: userRole.locationId,
      role: userRole.role ? this.mapRoleToDto(userRole.role) : undefined,
      createdAt: userRole.createdAt,
    }
  }
}
