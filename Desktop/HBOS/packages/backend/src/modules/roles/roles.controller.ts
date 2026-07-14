import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { AssignRoleDto } from './dto/assign-role.dto'
import { RoleDto, PermissionDto, UserRoleDto } from './dto/role.dto'

/**
 * Roles Controller
 * Handles role and permission management for RBAC
 */
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // ============================================================================
  // Role Endpoints
  // ============================================================================

  /**
   * POST /roles
   * Create a new role
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Request() req: any, @Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return this.rolesService.createRole(req.user.tenantId, createRoleDto)
  }

  /**
   * GET /roles
   * List all roles for the tenant
   */
  @Get()
  async listRoles(
    @Request() req: any,
    @Query('skip') skip = 0,
    @Query('take') take = 20,
  ): Promise<{ data: RoleDto[]; total: number }> {
    return this.rolesService.listRoles(req.user.tenantId, parseInt(skip as any), parseInt(take as any))
  }

  /**
   * GET /roles/:roleId
   * Get role by ID
   */
  @Get(':roleId')
  async getRole(@Request() req: any, @Param('roleId') roleId: string): Promise<RoleDto> {
    return this.rolesService.getRoleById(req.user.tenantId, roleId)
  }

  /**
   * PATCH /roles/:roleId
   * Update role
   */
  @Patch(':roleId')
  async updateRole(
    @Request() req: any,
    @Param('roleId') roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDto> {
    return this.rolesService.updateRole(req.user.tenantId, roleId, updateRoleDto)
  }

  /**
   * DELETE /roles/:roleId
   * Delete role
   */
  @Delete(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Request() req: any, @Param('roleId') roleId: string): Promise<void> {
    await this.rolesService.deleteRole(req.user.tenantId, roleId)
  }

  // ============================================================================
  // Permission Endpoints
  // ============================================================================

  /**
   * POST /roles/permissions
   * Create a new permission
   */
  @Post('permissions/create')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(
    @Request() req: any,
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    return this.rolesService.createPermission(req.user.tenantId, createPermissionDto)
  }

  /**
   * GET /roles/permissions
   * List all permissions for the tenant
   */
  @Get('permissions/list')
  async listPermissions(
    @Request() req: any,
    @Query('skip') skip = 0,
    @Query('take') take = 100,
  ): Promise<{ data: PermissionDto[]; total: number }> {
    return this.rolesService.listPermissions(req.user.tenantId, parseInt(skip as any), parseInt(take as any))
  }

  /**
   * GET /roles/permissions/:permissionId
   * Get permission by ID
   */
  @Get('permissions/:permissionId')
  async getPermission(
    @Request() req: any,
    @Param('permissionId') permissionId: string,
  ): Promise<PermissionDto> {
    return this.rolesService.getPermissionById(req.user.tenantId, permissionId)
  }

  /**
   * GET /roles/permissions/resource/:resource
   * Get all permissions for a resource
   */
  @Get('permissions/resource/:resource')
  async getPermissionsByResource(
    @Request() req: any,
    @Param('resource') resource: string,
  ): Promise<PermissionDto[]> {
    return this.rolesService.getPermissionsByResource(req.user.tenantId, resource)
  }

  // ============================================================================
  // User Role Assignment
  // ============================================================================

  /**
   * POST /roles/assign
   * Assign role to user
   */
  @Post('assign')
  @HttpCode(HttpStatus.CREATED)
  async assignRole(
    @Request() req: any,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<UserRoleDto> {
    return this.rolesService.assignRoleToUser(req.user.tenantId, assignRoleDto)
  }

  /**
   * DELETE /roles/:roleId/users/:userId
   * Remove role from user
   */
  @Delete(':roleId/users/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRoleFromUser(
    @Request() req: any,
    @Param('roleId') roleId: string,
    @Param('userId') userId: string,
    @Query('locationId') locationId?: string,
  ): Promise<void> {
    await this.rolesService.removeRoleFromUser(req.user.tenantId, userId, roleId, locationId)
  }

  /**
   * GET /roles/users/:userId
   * Get all roles for a user
   */
  @Get('users/:userId')
  async getUserRoles(
    @Request() req: any,
    @Param('userId') userId: string,
    @Query('locationId') locationId?: string,
  ): Promise<UserRoleDto[]> {
    return this.rolesService.getUserRoles(req.user.tenantId, userId, locationId)
  }

  /**
   * GET /roles/:roleId/users
   * Get all users with a role
   */
  @Get(':roleId/users')
  async getUsersWithRole(
    @Request() req: any,
    @Param('roleId') roleId: string,
    @Query('locationId') locationId?: string,
  ): Promise<{ userId: string; locationId?: string }[]> {
    return this.rolesService.getUsersWithRole(req.user.tenantId, roleId, locationId)
  }

  // ============================================================================
  // Permission Checking
  // ============================================================================

  /**
   * GET /roles/check-permission
   * Check if user has permission
   */
  @Get('check-permission')
  async checkPermission(
    @Request() req: any,
    @Query('permissionCode') permissionCode: string,
    @Query('locationId') locationId?: string,
  ): Promise<{ hasPermission: boolean }> {
    const hasPermission = await this.rolesService.userHasPermission(
      req.user.tenantId,
      req.user.userId,
      permissionCode,
      locationId,
    )
    return { hasPermission }
  }

  /**
   * GET /roles/my-permissions
   * Get current user's permissions
   */
  @Get('my-permissions')
  async getMyPermissions(
    @Request() req: any,
    @Query('locationId') locationId?: string,
  ): Promise<PermissionDto[]> {
    return this.rolesService.getUserPermissions(req.user.tenantId, req.user.userId, locationId)
  }

  /**
   * GET /roles/my-roles
   * Get current user's roles
   */
  @Get('my-roles')
  async getMyRoles(
    @Request() req: any,
    @Query('locationId') locationId?: string,
  ): Promise<UserRoleDto[]> {
    return this.rolesService.getUserRoles(req.user.tenantId, req.user.userId, locationId)
  }
}
