import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { InventoryService } from './services/inventory.service'
import { Inventory } from './entities/inventory.entity'
import { InventoryAudit } from './entities/inventory-audit.entity'

describe('InventoryService', () => {
  let service: InventoryService
  let inventoryRepository: any
  let auditRepository: any

  const mockTenantId = 'tenant-123'
  const mockProductId = 'product-123'
  const mockInventoryId = 'inventory-123'
  const mockLocationId = 'location-123'

  beforeEach(async () => {
    inventoryRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      find: jest.fn(),
    }

    auditRepository = {
      save: jest.fn(),
      findAndCount: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: inventoryRepository,
        },
        {
          provide: getRepositoryToken(InventoryAudit),
          useValue: auditRepository,
        },
      ],
    }).compile()

    service = module.get<InventoryService>(InventoryService)
  })

  describe('createInventory', () => {
    it('should create inventory for a product', async () => {
      const createDto = {
        productId: mockProductId,
        quantityOnHand: 100,
        reorderLevel: 20,
        reorderQuantity: 50,
      }

      const mockInventory = {
        id: mockInventoryId,
        tenantId: mockTenantId,
        productId: mockProductId,
        quantityOnHand: 100,
        quantityReserved: 0,
        quantityAvailable: 100,
        reorderLevel: 20,
        status: 'in_stock',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      inventoryRepository.create.mockReturnValue(mockInventory)
      inventoryRepository.save.mockResolvedValue(mockInventory)
      inventoryRepository.findOne.mockResolvedValue(null)
      auditRepository.save.mockResolvedValue({})

      const result = await service.createInventory(mockTenantId, createDto as any)

      expect(result).toBeDefined()
      expect(result.id).toBe(mockInventoryId)
      expect(inventoryRepository.save).toHaveBeenCalled()
    })

    it('should throw ConflictException if inventory already exists', async () => {
      const createDto = {
        productId: mockProductId,
        quantityOnHand: 100,
      }

      inventoryRepository.findOne.mockResolvedValue({ id: mockInventoryId })

      await expect(service.createInventory(mockTenantId, createDto as any)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('getInventoryById', () => {
    it('should return inventory if found', async () => {
      const mockInventory = {
        id: mockInventoryId,
        tenantId: mockTenantId,
        productId: mockProductId,
        quantityOnHand: 100,
        quantityReserved: 0,
        quantityAvailable: 100,
        status: 'in_stock',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      inventoryRepository.findOne.mockResolvedValue(mockInventory)

      const result = await service.getInventoryById(mockTenantId, mockInventoryId)

      expect(result).toBeDefined()
      expect(result.id).toBe(mockInventoryId)
    })

    it('should throw NotFoundException if not found', async () => {
      inventoryRepository.findOne.mockResolvedValue(null)

      await expect(service.getInventoryById(mockTenantId, mockInventoryId)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('listInventories', () => {
    it('should return list of inventories', async () => {
      const mockInventories = [
        {
          id: mockInventoryId,
          tenantId: mockTenantId,
          quantityOnHand: 100,
          status: 'in_stock',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      inventoryRepository.findAndCount.mockResolvedValue([mockInventories, 1])

      const result = await service.listInventories(mockTenantId, { skip: 0, take: 50 })

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should filter by low stock status', async () => {
      inventoryRepository.findAndCount.mockResolvedValue([[], 0])

      await service.listInventories(mockTenantId, { lowStockOnly: true })

      expect(inventoryRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'low_stock' }),
        }),
      )
    })
  })

  describe('adjustInventory', () => {
    it('should adjust inventory quantity', async () => {
      const adjustDto = {
        quantity: 50,
        type: 'received',
        notes: 'Restocking',
      }

      const mockInventory = {
        id: mockInventoryId,
        tenantId: mockTenantId,
        productId: mockProductId,
        quantityOnHand: 100,
        quantityReserved: 0,
        quantityAvailable: 100,
        reorderLevel: 20,
        status: 'in_stock',
      }

      inventoryRepository.findOne.mockResolvedValue(mockInventory)
      inventoryRepository.save.mockResolvedValue({
        ...mockInventory,
        quantityOnHand: 150,
        quantityAvailable: 150,
      })
      auditRepository.save.mockResolvedValue({})

      const result = await service.adjustInventory(mockTenantId, mockInventoryId, adjustDto as any)

      expect(result.quantityOnHand).toBe(150)
      expect(inventoryRepository.save).toHaveBeenCalled()
      expect(auditRepository.save).toHaveBeenCalled()
    })

    it('should throw error if adjustment would result in negative inventory', async () => {
      const adjustDto = {
        quantity: -150,
        type: 'adjustment',
      }

      const mockInventory = {
        id: mockInventoryId,
        quantityOnHand: 100,
        quantityReserved: 0,
        reorderLevel: 20,
      }

      inventoryRepository.findOne.mockResolvedValue(mockInventory)

      await expect(service.adjustInventory(mockTenantId, mockInventoryId, adjustDto as any)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw NotFoundException if inventory not found', async () => {
      const adjustDto = {
        quantity: 50,
        type: 'received',
      }

      inventoryRepository.findOne.mockResolvedValue(null)

      await expect(service.adjustInventory(mockTenantId, mockInventoryId, adjustDto as any)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('decrementForOrder', () => {
    it('should decrement inventory for order', async () => {
      const mockInventory = {
        id: mockInventoryId,
        tenantId: mockTenantId,
        productId: mockProductId,
        quantityOnHand: 100,
        quantityReserved: 0,
        quantityAvailable: 100,
        reorderLevel: 20,
        status: 'in_stock',
      }

      inventoryRepository.findOne.mockResolvedValue(mockInventory)
      inventoryRepository.save.mockResolvedValue({
        ...mockInventory,
        quantityOnHand: 90,
        quantityAvailable: 90,
      })
      auditRepository.save.mockResolvedValue({})

      const result = await service.decrementForOrder(
        mockTenantId,
        mockProductId,
        10,
        'order-456',
      )

      expect(result.quantityOnHand).toBe(90)
      expect(auditRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sold',
        }),
      )
    })

    it('should throw error if insufficient inventory', async () => {
      const mockInventory = {
        tenantId: mockTenantId,
        productId: mockProductId,
        quantityOnHand: 5,
        quantityReserved: 0,
        quantityAvailable: 5,
      }

      inventoryRepository.findOne.mockResolvedValue(mockInventory)

      await expect(
        service.decrementForOrder(mockTenantId, mockProductId, 10, 'order-456'),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('updateInventory', () => {
    it('should update inventory settings', async () => {
      const updateDto = {
        reorderLevel: 50,
        reorderQuantity: 100,
      }

      const mockInventory = {
        id: mockInventoryId,
        tenantId: mockTenantId,
        quantityOnHand: 100,
        reorderLevel: 20,
        reorderQuantity: 50,
        status: 'in_stock',
      }

      inventoryRepository.findOne.mockResolvedValue(mockInventory)
      inventoryRepository.save.mockResolvedValue({
        ...mockInventory,
        reorderLevel: 50,
        reorderQuantity: 100,
      })

      const result = await service.updateInventory(mockTenantId, mockInventoryId, updateDto as any)

      expect(result.reorderLevel).toBe(50)
      expect(result.reorderQuantity).toBe(100)
    })
  })

  describe('getLowStockItems', () => {
    it('should return low stock items', async () => {
      const mockLowStockItems = [
        {
          id: mockInventoryId,
          quantityOnHand: 5,
          status: 'low_stock',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      inventoryRepository.find.mockResolvedValue(mockLowStockItems)

      const result = await service.getLowStockItems(mockTenantId)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('low_stock')
    })
  })

  describe('getAuditHistory', () => {
    it('should return audit history for inventory', async () => {
      const mockAudits = [
        {
          id: 'audit-1',
          type: 'initial',
          quantityChanged: 100,
          createdAt: new Date(),
        },
      ]

      auditRepository.findAndCount.mockResolvedValue([mockAudits, 1])

      const result = await service.getAuditHistory(mockTenantId, mockInventoryId)

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })
})
