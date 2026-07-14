import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TenantsService } from './tenants.service'
import { Tenant } from './entities/tenant.entity'
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common'

describe('TenantsService', () => {
  let service: TenantsService
  let repository: Repository<Tenant>

  const mockTenant: Tenant = {
    id: '550e8400-e29b-41d4-a716-446655440000' as any,
    name: 'Test Restaurant',
    slug: 'test-restaurant',
    status: 'active',
    tier: 'professional',
    subscriptionEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    features: {
      pos: true,
      inventory: true,
      crm: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<TenantsService>(TenantsService)
    repository = module.get<Repository<Tenant>>(getRepositoryToken(Tenant))
  })

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createDto = {
        name: 'New Restaurant',
        slug: 'new-restaurant',
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(null)
      jest.spyOn(repository, 'create').mockReturnValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(mockTenant)

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(result.name).toBe(mockTenant.name)
      expect(result.slug).toBe(mockTenant.slug)
      expect(repository.findOne).toHaveBeenCalled()
      expect(repository.save).toHaveBeenCalled()
    })

    it('should throw ConflictException if slug already exists', async () => {
      const createDto = {
        name: 'Duplicate Restaurant',
        slug: 'test-restaurant',
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)

      await expect(service.create(createDto)).rejects.toThrow(ConflictException)
    })

    it('should set default tier to starter', async () => {
      const createDto = {
        name: 'New Restaurant',
        slug: 'new-restaurant',
      }

      jest.spyOn(repository, 'findOne').mockResolvedValue(null)
      jest.spyOn(repository, 'create').mockReturnValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(mockTenant)

      await service.create(createDto)

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tier: 'starter',
        }),
      )
    })
  })

  describe('findById', () => {
    it('should return a tenant by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)

      const result = await service.findById(mockTenant.id)

      expect(result).toBeDefined()
      expect(result.id).toBe(mockTenant.id)
      expect(result.name).toBe(mockTenant.name)
    })

    it('should throw NotFoundException if tenant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw NotFoundException if tenant is deleted', async () => {
      const deletedTenant = { ...mockTenant, status: 'deleted' as const }
      jest.spyOn(repository, 'findOne').mockResolvedValue(deletedTenant)

      await expect(service.findById(mockTenant.id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findBySlug', () => {
    it('should return a tenant by slug', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)

      const result = await service.findBySlug(mockTenant.slug)

      expect(result).toBeDefined()
      expect(result.slug).toBe(mockTenant.slug)
    })

    it('should throw NotFoundException if tenant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.findBySlug('non-existent')).rejects.toThrow(NotFoundException)
    })
  })

  describe('findByIdWithSubscription', () => {
    it('should return tenant with active subscription info', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)

      const result = await service.findByIdWithSubscription(mockTenant.id)

      expect(result).toBeDefined()
      expect(result.isSubscriptionActive).toBe(true)
      expect(result.daysUntilExpiration).toBeGreaterThan(0)
    })

    it('should return isSubscriptionActive as false if subscription expired', async () => {
      const expiredTenant = {
        ...mockTenant,
        subscriptionEndsAt: new Date(Date.now() - 1000),
      }
      jest.spyOn(repository, 'findOne').mockResolvedValue(expiredTenant)

      const result = await service.findByIdWithSubscription(mockTenant.id)

      expect(result.isSubscriptionActive).toBe(false)
    })

    it('should return isSubscriptionActive as true if no subscription end date', async () => {
      const tenantNoExpiry = { ...mockTenant, subscriptionEndsAt: null }
      jest.spyOn(repository, 'findOne').mockResolvedValue(tenantNoExpiry)

      const result = await service.findByIdWithSubscription(mockTenant.id)

      expect(result.isSubscriptionActive).toBe(true)
    })
  })

  describe('findAll', () => {
    it('should return paginated list of active tenants', async () => {
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[mockTenant], 1])

      const result = await service.findAll(0, 20)

      expect(result).toBeDefined()
      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should apply pagination correctly', async () => {
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0])

      await service.findAll(10, 50)

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 50,
        }),
      )
    })
  })

  describe('update', () => {
    it('should update tenant details', async () => {
      const updateDto = { name: 'Updated Name', tier: 'enterprise' }
      const updatedTenant = { ...mockTenant, ...updateDto }

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTenant)

      const result = await service.update(mockTenant.id, updateDto)

      expect(result.name).toBe(updateDto.name)
      expect(result.tier).toBe(updateDto.tier)
    })

    it('should throw NotFoundException if tenant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException)
    })

    it('should throw BadRequestException if trying to update deleted tenant', async () => {
      const deletedTenant = { ...mockTenant, status: 'deleted' as const }
      jest.spyOn(repository, 'findOne').mockResolvedValue(deletedTenant)

      await expect(service.update(mockTenant.id, {})).rejects.toThrow(BadRequestException)
    })
  })

  describe('softDelete', () => {
    it('should soft delete a tenant', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(mockTenant)

      await service.softDelete(mockTenant.id)

      expect(repository.save).toHaveBeenCalled()
    })

    it('should throw NotFoundException if tenant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.softDelete('non-existent-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('restore', () => {
    it('should restore a deleted tenant', async () => {
      const deletedTenant = { ...mockTenant, status: 'deleted' as const, deletedAt: new Date() }
      const restoredTenant = { ...deletedTenant, status: 'active' as const, deletedAt: null }

      jest.spyOn(repository, 'findOne').mockResolvedValue(deletedTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(restoredTenant)

      const result = await service.restore(mockTenant.id)

      expect(result.status).toBe('active')
    })
  })

  describe('renewSubscription', () => {
    it('should renew subscription for tenant', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(mockTenant)

      const result = await service.renewSubscription(mockTenant.id, 365)

      expect(result).toBeDefined()
      expect(result.isSubscriptionActive).toBe(true)
    })

    it('should throw NotFoundException if tenant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.renewSubscription('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('hasFeature', () => {
    it('should return true if feature is enabled', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)

      const result = await service.hasFeature(mockTenant.id, 'pos')

      expect(result).toBe(true)
    })

    it('should return false if feature is disabled', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)

      const result = await service.hasFeature(mockTenant.id, 'non-existent-feature')

      expect(result).toBe(false)
    })

    it('should return false if tenant does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      const result = await service.hasFeature('non-existent-id', 'pos')

      expect(result).toBe(false)
    })
  })

  describe('enableFeature', () => {
    it('should enable a feature for tenant', async () => {
      const updatedTenant = {
        ...mockTenant,
        features: { ...mockTenant.features, newFeature: true },
      }
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTenant)

      const result = await service.enableFeature(mockTenant.id, 'newFeature')

      expect(result).toBeDefined()
      expect(repository.save).toHaveBeenCalled()
    })
  })

  describe('disableFeature', () => {
    it('should disable a feature for tenant', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTenant)
      jest.spyOn(repository, 'save').mockResolvedValue(mockTenant)

      const result = await service.disableFeature(mockTenant.id, 'pos')

      expect(result).toBeDefined()
      expect(repository.save).toHaveBeenCalled()
    })
  })
})
