import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RolesService } from './roles.service'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { UserRole } from './entities/user-role.entity'
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common'

describe('RolesService', () => {
  let service: RolesService
  let roleRepository: Repository<Role>
  let permissionRepository: Repository<Permission>
  let userRoleRepository: Repository<UserRole>

  const tenantId = '550e8400-e29b-41d4-a716-446655440000'
  const userId = '550e8400-e29b-41d4-a716-446655440001'
  const roleId = '550e8400-e29b-41d4-a716-446655440002'
  const permissionId = '550e8400-e29b-41d4-a716-446655440003'

  const mockPermission: Permission = {
    id: permissionId as any,
    tenantId: tenantId as any,
    code: 'orders:create',
    name: 'Create Orders',
    description: 'Permission to create orders',
    resource: 'orders',
    action: 'create',
    roles: [],
    createdAt: new Date(),
  }

  const mockRole: Role = {
    id: roleId as any,
    tenantId: tenantId as any,
    name: 'Manager',
    description: 'Manager role',
    isSystem: false,
    permissions: [mockPermission],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const mockUserRole: UserRole = {
    id: '550e8400-e29b-41d4-a716-446655440004' as any,
    tenantId: tenantId as any,
    userId: userId as any,
    roleId: roleId as any,
    locationId: null,
    role: mockRole,
    createdAt: new Date(),
    deletedAt: null,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            softDelete: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role))
    permissionRepository = module.get<Repository<Permission>>(getRepositoryToken(Permission))
    userRoleRepository = module.get<Repository<UserRole>>(getRepositoryToken(UserRole))
  })

  describe('Role Management', () => {
    describe('createRole', () => {
      it('should create a new role', async () => {
        const createDto = { name: 'New Role', description: 'A new role' }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(permissionRepository, 'find').mockResolvedValue([])
        jest.spyOn(roleRepository, 'create').mockReturnValue(mockRole)
        jest.spyOn(roleRepository, 'save').mockResolvedValue(mockRole)

        const result = await service.createRole(tenantId, createDto)

        expect(result).toBeDefined()
        expect(result.name).toBe(mockRole.name)
        expect(roleRepository.save).toHaveBeenCalled()
      })

      it('should throw ConflictException if role name already exists', async () => {
        const createDto = { name: 'Manager' }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)

        await expect(service.createRole(tenantId, createDto)).rejects.toThrow(ConflictException)
      })

      it('should add permissions to role if provided', async () => {
        const createDto = { name: 'New Role', permissionIds: [permissionId] }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(permissionRepository, 'find').mockResolvedValue([mockPermission])
        jest.spyOn(roleRepository, 'create').mockReturnValue(mockRole)
        jest.spyOn(roleRepository, 'save').mockResolvedValue(mockRole)

        await service.createRole(tenantId, createDto)

        expect(permissionRepository.find).toHaveBeenCalled()
      })
    })

    describe('getRoleById', () => {
      it('should return a role by ID', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)

        const result = await service.getRoleById(tenantId, roleId)

        expect(result).toBeDefined()
        expect(result.id).toBe(mockRole.id)
        expect(result.name).toBe(mockRole.name)
      })

      it('should throw NotFoundException if role does not exist', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null)

        await expect(service.getRoleById(tenantId, 'non-existent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('listRoles', () => {
      it('should return paginated list of roles', async () => {
        jest.spyOn(roleRepository, 'findAndCount').mockResolvedValue([[mockRole], 1])

        const result = await service.listRoles(tenantId, 0, 20)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
        expect(result.total).toBe(1)
      })
    })

    describe('updateRole', () => {
      it('should update role details', async () => {
        const updateDto = { name: 'Updated Manager' }
        const updatedRole = { ...mockRole, name: updateDto.name }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)
        jest.spyOn(roleRepository, 'save').mockResolvedValue(updatedRole)

        const result = await service.updateRole(tenantId, roleId, updateDto)

        expect(result.name).toBe(updateDto.name)
      })

      it('should throw ForbiddenException when updating system role', async () => {
        const systemRole = { ...mockRole, isSystem: true }
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(systemRole)

        await expect(service.updateRole(tenantId, roleId, {})).rejects.toThrow(
          ForbiddenException,
        )
      })

      it('should throw NotFoundException if role does not exist', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null)

        await expect(service.updateRole(tenantId, 'non-existent', {})).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('deleteRole', () => {
      it('should delete a role', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)
        jest.spyOn(userRoleRepository, 'count').mockResolvedValue(0)
        jest.spyOn(roleRepository, 'delete').mockResolvedValue({ affected: 1 } as any)

        await service.deleteRole(tenantId, roleId)

        expect(roleRepository.delete).toHaveBeenCalled()
      })

      it('should throw ForbiddenException when deleting system role', async () => {
        const systemRole = { ...mockRole, isSystem: true }
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(systemRole)

        await expect(service.deleteRole(tenantId, roleId)).rejects.toThrow(ForbiddenException)
      })

      it('should throw error if role is assigned to users', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)
        jest.spyOn(userRoleRepository, 'count').mockResolvedValue(5)

        await expect(service.deleteRole(tenantId, roleId)).rejects.toThrow()
      })
    })
  })

  describe('Permission Management', () => {
    describe('createPermission', () => {
      it('should create a new permission', async () => {
        const createDto = { code: 'products:read', name: 'Read Products' }

        jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(permissionRepository, 'create').mockReturnValue(mockPermission)
        jest.spyOn(permissionRepository, 'save').mockResolvedValue(mockPermission)

        const result = await service.createPermission(tenantId, createDto)

        expect(result).toBeDefined()
        expect(result.code).toBe(mockPermission.code)
      })

      it('should throw ConflictException if permission code exists', async () => {
        const createDto = { code: 'orders:create', name: 'Create Orders' }

        jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(mockPermission)

        await expect(service.createPermission(tenantId, createDto)).rejects.toThrow(
          ConflictException,
        )
      })
    })

    describe('getPermissionById', () => {
      it('should return a permission by ID', async () => {
        jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(mockPermission)

        const result = await service.getPermissionById(tenantId, permissionId)

        expect(result).toBeDefined()
        expect(result.id).toBe(mockPermission.id)
      })

      it('should throw NotFoundException if permission does not exist', async () => {
        jest.spyOn(permissionRepository, 'findOne').mockResolvedValue(null)

        await expect(
          service.getPermissionById(tenantId, 'non-existent'),
        ).rejects.toThrow(NotFoundException)
      })
    })

    describe('listPermissions', () => {
      it('should return paginated list of permissions', async () => {
        jest
          .spyOn(permissionRepository, 'findAndCount')
          .mockResolvedValue([[mockPermission], 1])

        const result = await service.listPermissions(tenantId, 0, 100)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
        expect(result.total).toBe(1)
      })
    })

    describe('getPermissionsByResource', () => {
      it('should return permissions for a resource', async () => {
        jest.spyOn(permissionRepository, 'find').mockResolvedValue([mockPermission])

        const result = await service.getPermissionsByResource(tenantId, 'orders')

        expect(result).toHaveLength(1)
        expect(result[0].resource).toBe('orders')
      })
    })
  })

  describe('User Role Assignment', () => {
    describe('assignRoleToUser', () => {
      it('should assign role to user', async () => {
        const assignDto = { userId, roleId }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)
        jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(userRoleRepository, 'create').mockReturnValue(mockUserRole)
        jest.spyOn(userRoleRepository, 'save').mockResolvedValue(mockUserRole)

        const result = await service.assignRoleToUser(tenantId, assignDto)

        expect(result).toBeDefined()
        expect(result.userId).toBe(userId)
        expect(result.roleId).toBe(roleId)
      })

      it('should throw NotFoundException if role does not exist', async () => {
        const assignDto = { userId, roleId }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null)

        await expect(service.assignRoleToUser(tenantId, assignDto)).rejects.toThrow(
          NotFoundException,
        )
      })

      it('should throw ConflictException if assignment already exists', async () => {
        const assignDto = { userId, roleId }

        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)
        jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(mockUserRole)

        await expect(service.assignRoleToUser(tenantId, assignDto)).rejects.toThrow(
          ConflictException,
        )
      })
    })

    describe('removeRoleFromUser', () => {
      it('should remove role from user', async () => {
        jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(mockUserRole)
        jest.spyOn(userRoleRepository, 'softDelete').mockResolvedValue({ affected: 1 } as any)

        await service.removeRoleFromUser(tenantId, userId, roleId)

        expect(userRoleRepository.softDelete).toHaveBeenCalled()
      })

      it('should throw NotFoundException if assignment does not exist', async () => {
        jest.spyOn(userRoleRepository, 'findOne').mockResolvedValue(null)

        await expect(
          service.removeRoleFromUser(tenantId, userId, roleId),
        ).rejects.toThrow(NotFoundException)
      })
    })
  })

  describe('Permission Checking', () => {
    describe('userHasPermission', () => {
      it('should return true if user has permission', async () => {
        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([mockUserRole]),
        }

        jest.spyOn(userRoleRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any)

        const result = await service.userHasPermission(tenantId, userId, 'orders:create')

        expect(result).toBe(true)
      })

      it('should return false if user does not have permission', async () => {
        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([]),
        }

        jest.spyOn(userRoleRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any)

        const result = await service.userHasPermission(tenantId, userId, 'orders:delete')

        expect(result).toBe(false)
      })
    })
  })

  describe('System Roles', () => {
    describe('initializeSystemRoles', () => {
      it('should create system roles if they do not exist', async () => {
        jest.spyOn(roleRepository, 'count').mockResolvedValue(0)
        jest.spyOn(roleRepository, 'create').mockReturnValue(mockRole)
        jest.spyOn(roleRepository, 'save').mockResolvedValue(mockRole)

        await service.initializeSystemRoles(tenantId)

        expect(roleRepository.save).toHaveBeenCalled()
      })

      it('should not create system roles if they already exist', async () => {
        jest.spyOn(roleRepository, 'count').mockResolvedValue(4)

        await service.initializeSystemRoles(tenantId)

        expect(roleRepository.save).not.toHaveBeenCalled()
      })
    })

    describe('getSystemRole', () => {
      it('should return a system role', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(mockRole)

        const result = await service.getSystemRole(tenantId, 'Manager')

        expect(result).toBeDefined()
        expect(result.name).toBe('Manager')
      })

      it('should throw NotFoundException if system role does not exist', async () => {
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null)

        await expect(service.getSystemRole(tenantId, 'NonExistent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })
  })
})
