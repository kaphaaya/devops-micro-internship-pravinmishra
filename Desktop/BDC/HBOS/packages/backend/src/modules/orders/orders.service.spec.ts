import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { OrdersService } from './services/orders.service'
import { OrderCalculationService } from './services/order-calculation.service'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'

describe('OrdersService', () => {
  let service: OrdersService
  let ordersRepository: any
  let orderItemsRepository: any
  let calculationService: OrderCalculationService

  const mockTenantId = 'tenant-123'
  const mockOrderId = 'order-123'
  const mockCustomerId = 'customer-123'
  const mockProductId = 'product-123'

  beforeEach(async () => {
    ordersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      softRemove: jest.fn(),
    }

    orderItemsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softRemove: jest.fn(),
    }

    calculationService = {
      calculateItemSubtotal: jest.fn((qty, price) => qty * price),
      calculateItemTax: jest.fn((subtotal, tax) => (subtotal * tax) / 100),
      calculateOrderSubtotal: jest.fn(items => items.reduce((a, b) => a + b, 0)),
      calculateOrderTax: jest.fn(items => items.reduce((a, b) => a + b, 0)),
      calculateOrderTotal: jest.fn((sub, tax, discount) => sub + tax - discount),
      round: jest.fn(value => Math.round(value * 100) / 100),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: ordersRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: orderItemsRepository,
        },
        {
          provide: OrderCalculationService,
          useValue: calculationService,
        },
      ],
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  describe('createOrder', () => {
    it('should create a new order with items', async () => {
      const createOrderDto = {
        orderType: 'dine_in',
        customerId: mockCustomerId,
        tableNumber: '5',
        items: [
          {
            productId: mockProductId,
            quantity: 2,
          },
        ],
      }

      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
        orderNumber: 'ORD-123456',
        status: 'pending',
        paymentStatus: 'unpaid',
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
      }

      ordersRepository.create.mockReturnValue(mockOrder)
      ordersRepository.save.mockResolvedValue(mockOrder)
      orderItemsRepository.find.mockResolvedValue([])

      const result = await service.createOrder(mockTenantId, createOrderDto as any)

      expect(ordersRepository.create).toHaveBeenCalled()
      expect(result).toBeDefined()
    })

    it('should throw error if order has no items', async () => {
      const createOrderDto = {
        orderType: 'dine_in',
        customerId: mockCustomerId,
        items: [],
      }

      await expect(service.createOrder(mockTenantId, createOrderDto as any)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('getOrderById', () => {
    it('should return order if found', async () => {
      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
        orderNumber: 'ORD-123456',
        status: 'pending',
        paymentStatus: 'unpaid',
        subtotal: 100,
        taxAmount: 10,
        discountAmount: 0,
        totalAmount: 110,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ordersRepository.findOne.mockResolvedValue(mockOrder)

      const result = await service.getOrderById(mockTenantId, mockOrderId)

      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockOrderId, tenantId: mockTenantId },
        relations: ['items'],
      })
      expect(result.id).toBe(mockOrderId)
    })

    it('should throw NotFoundException if order not found', async () => {
      ordersRepository.findOne.mockResolvedValue(null)

      await expect(service.getOrderById(mockTenantId, mockOrderId)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('listOrders', () => {
    it('should return list of orders with pagination', async () => {
      const mockOrders = [
        {
          id: mockOrderId,
          tenantId: mockTenantId,
          status: 'completed',
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ordersRepository.findAndCount.mockResolvedValue([mockOrders, 1])

      const result = await service.listOrders(mockTenantId, { skip: 0, take: 50 })

      expect(ordersRepository.findAndCount).toHaveBeenCalled()
      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should filter orders by status', async () => {
      ordersRepository.findAndCount.mockResolvedValue([[], 0])

      await service.listOrders(mockTenantId, { status: 'completed' })

      expect(ordersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'completed' }),
        }),
      )
    })

    it('should filter orders by customerId', async () => {
      ordersRepository.findAndCount.mockResolvedValue([[], 0])

      await service.listOrders(mockTenantId, { customerId: mockCustomerId })

      expect(ordersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ customerId: mockCustomerId }),
        }),
      )
    })
  })

  describe('updateOrderStatus', () => {
    it('should update order status with valid transition', async () => {
      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
        status: 'pending',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ordersRepository.findOne.mockResolvedValue(mockOrder)
      ordersRepository.save.mockResolvedValue({
        ...mockOrder,
        status: 'confirmed',
      })

      const result = await service.updateOrderStatus(mockTenantId, mockOrderId, {
        status: 'confirmed',
      })

      expect(result.status).toBe('confirmed')
    })

    it('should throw error on invalid status transition', async () => {
      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
        status: 'completed',
        items: [],
      }

      ordersRepository.findOne.mockResolvedValue(mockOrder)

      await expect(
        service.updateOrderStatus(mockTenantId, mockOrderId, {
          status: 'pending',
        }),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw NotFoundException if order not found', async () => {
      ordersRepository.findOne.mockResolvedValue(null)

      await expect(
        service.updateOrderStatus(mockTenantId, mockOrderId, {
          status: 'confirmed',
        }),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('cancelOrder', () => {
    it('should cancel a pending order', async () => {
      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
        status: 'pending',
        items: [],
      }

      ordersRepository.findOne.mockResolvedValue(mockOrder)
      ordersRepository.save.mockResolvedValue({
        ...mockOrder,
        status: 'cancelled',
        cancelledAt: new Date(),
      })

      const result = await service.cancelOrder(mockTenantId, mockOrderId)

      expect(result.status).toBe('cancelled')
    })

    it('should throw error if order is already completed', async () => {
      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
        status: 'completed',
        items: [],
      }

      ordersRepository.findOne.mockResolvedValue(mockOrder)

      await expect(service.cancelOrder(mockTenantId, mockOrderId)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw NotFoundException if order not found', async () => {
      ordersRepository.findOne.mockResolvedValue(null)

      await expect(service.cancelOrder(mockTenantId, mockOrderId)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('removeItemFromOrder', () => {
    it('should remove item and recalculate totals', async () => {
      const mockItem = {
        id: 'item-123',
        tenantId: mockTenantId,
        orderId: mockOrderId,
      }

      const mockOrder = {
        id: mockOrderId,
        tenantId: mockTenantId,
      }

      orderItemsRepository.findOne.mockResolvedValue(mockItem)
      orderItemsRepository.softRemove.mockResolvedValue(mockItem)
      orderItemsRepository.find.mockResolvedValue([])
      ordersRepository.findOne.mockResolvedValue(mockOrder)
      ordersRepository.save.mockResolvedValue(mockOrder)

      await service.removeItemFromOrder(mockTenantId, mockOrderId, 'item-123')

      expect(orderItemsRepository.softRemove).toHaveBeenCalled()
    })

    it('should throw NotFoundException if item not found', async () => {
      orderItemsRepository.findOne.mockResolvedValue(null)

      await expect(service.removeItemFromOrder(mockTenantId, mockOrderId, 'item-123')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('getOrderItems', () => {
    it('should return order items', async () => {
      const mockItems = [
        {
          id: 'item-1',
          orderId: mockOrderId,
          productName: 'Pizza',
          quantity: 2,
          unitPrice: 15,
          itemSubtotal: 30,
          itemTotal: 33,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      orderItemsRepository.find.mockResolvedValue(mockItems)

      const result = await service.getOrderItems(mockTenantId, mockOrderId)

      expect(orderItemsRepository.find).toHaveBeenCalled()
      expect(result).toHaveLength(1)
      expect(result[0].productName).toBe('Pizza')
    })
  })

  describe('updateItemPreparationStatus', () => {
    it('should update item preparation status', async () => {
      const mockItem = {
        id: 'item-123',
        tenantId: mockTenantId,
        orderId: mockOrderId,
        preparationStatus: 'pending',
      }

      orderItemsRepository.findOne.mockResolvedValue(mockItem)
      orderItemsRepository.save.mockResolvedValue({
        ...mockItem,
        preparationStatus: 'ready',
      })

      const result = await service.updateItemPreparationStatus(
        mockTenantId,
        mockOrderId,
        'item-123',
        'ready',
      )

      expect(result.preparationStatus).toBe('ready')
    })

    it('should throw NotFoundException if item not found', async () => {
      orderItemsRepository.findOne.mockResolvedValue(null)

      await expect(
        service.updateItemPreparationStatus(mockTenantId, mockOrderId, 'item-123', 'ready'),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
