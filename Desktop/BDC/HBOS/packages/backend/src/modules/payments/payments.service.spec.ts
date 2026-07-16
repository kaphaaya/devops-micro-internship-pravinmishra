import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PaymentService } from './services/payment.service'
import { Payment } from './entities/payment.entity'

describe('PaymentService', () => {
  let service: PaymentService
  let paymentRepository: any
  let configService: any

  const mockTenantId = 'tenant-123'
  const mockOrderId = 'order-123'
  const mockPaymentId = 'payment-123'

  beforeEach(async () => {
    paymentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      find: jest.fn(),
    }

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'STRIPE_SECRET_KEY') {
          return process.env.STRIPE_SECRET_KEY || null
        }
        return null
      }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: paymentRepository,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile()

    service = module.get<PaymentService>(PaymentService)
  })

  describe('processPayment', () => {
    it('should process a cash payment', async () => {
      const processDto = {
        orderId: mockOrderId,
        amount: 100,
        paymentMethod: 'cash' as const,
      }

      const mockPayment = {
        id: mockPaymentId,
        tenantId: mockTenantId,
        orderId: mockOrderId,
        transactionId: 'TXN-123456',
        paymentMethod: 'cash',
        amount: 100,
        status: 'succeeded',
        processingFee: 0,
        netAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      paymentRepository.create.mockReturnValue(mockPayment)
      paymentRepository.save.mockResolvedValue(mockPayment)

      const result = await service.processPayment(mockTenantId, processDto)

      expect(result).toBeDefined()
      expect(result.status).toBe('succeeded')
      expect(result.processingFee).toBe(0)
      expect(paymentRepository.save).toHaveBeenCalled()
    })

    it('should process a mobile payment as pending', async () => {
      const processDto = {
        orderId: mockOrderId,
        amount: 50,
        paymentMethod: 'mobile' as const,
      }

      const mockPayment = {
        id: mockPaymentId,
        tenantId: mockTenantId,
        orderId: mockOrderId,
        transactionId: 'TXN-123456',
        paymentMethod: 'mobile',
        amount: 50,
        status: 'pending',
      }

      paymentRepository.create.mockReturnValue(mockPayment)
      paymentRepository.save.mockResolvedValue(mockPayment)

      const result = await service.processPayment(mockTenantId, processDto)

      expect(result.status).toBe('pending')
    })
  })

  describe('getPaymentById', () => {
    it('should return payment if found', async () => {
      const mockPayment = {
        id: mockPaymentId,
        tenantId: mockTenantId,
        orderId: mockOrderId,
        status: 'succeeded',
        amount: 100,
        processingFee: 2.9,
        netAmount: 97.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      paymentRepository.findOne.mockResolvedValue(mockPayment)

      const result = await service.getPaymentById(mockTenantId, mockPaymentId)

      expect(result).toBeDefined()
      expect(result.id).toBe(mockPaymentId)
      expect(result.status).toBe('succeeded')
    })

    it('should throw NotFoundException if not found', async () => {
      paymentRepository.findOne.mockResolvedValue(null)

      await expect(service.getPaymentById(mockTenantId, mockPaymentId)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('getOrderPayments', () => {
    it('should return all payments for an order', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          orderId: mockOrderId,
          amount: 50,
          status: 'succeeded',
        },
        {
          id: 'payment-2',
          orderId: mockOrderId,
          amount: 50,
          status: 'succeeded',
        },
      ]

      paymentRepository.find.mockResolvedValue(mockPayments)

      const result = await service.getOrderPayments(mockTenantId, mockOrderId)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('payment-1')
    })
  })

  describe('listPayments', () => {
    it('should return list of payments', async () => {
      const mockPayments = [
        {
          id: mockPaymentId,
          status: 'succeeded',
          amount: 100,
        },
      ]

      paymentRepository.findAndCount.mockResolvedValue([mockPayments, 1])

      const result = await service.listPayments(mockTenantId, { skip: 0, take: 50 })

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should filter by status', async () => {
      paymentRepository.findAndCount.mockResolvedValue([[], 0])

      await service.listPayments(mockTenantId, { status: 'succeeded' })

      expect(paymentRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'succeeded' }),
        }),
      )
    })
  })

  describe('refundPayment', () => {
    it('should refund a payment', async () => {
      const refundDto = {
        amount: 50,
        reason: 'Customer requested refund',
      }

      const mockPayment = {
        id: mockPaymentId,
        tenantId: mockTenantId,
        orderId: mockOrderId,
        status: 'succeeded',
        amount: 100,
        refundedAmount: 0,
      }

      paymentRepository.findOne.mockResolvedValue(mockPayment)
      paymentRepository.save.mockResolvedValue({
        ...mockPayment,
        refundedAmount: 50,
      })

      const result = await service.refundPayment(mockTenantId, mockPaymentId, refundDto)

      expect(result.refundedAmount).toBe(50)
      expect(paymentRepository.save).toHaveBeenCalled()
    })

    it('should throw error if payment is not succeeded', async () => {
      const refundDto = {
        amount: 50,
        reason: 'Refund',
      }

      const mockPayment = {
        id: mockPaymentId,
        status: 'pending',
      }

      paymentRepository.findOne.mockResolvedValue(mockPayment)

      await expect(service.refundPayment(mockTenantId, mockPaymentId, refundDto)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw error if refunding more than available', async () => {
      const refundDto = {
        amount: 150,
        reason: 'Refund',
      }

      const mockPayment = {
        id: mockPaymentId,
        status: 'succeeded',
        amount: 100,
        refundedAmount: 0,
      }

      paymentRepository.findOne.mockResolvedValue(mockPayment)

      await expect(service.refundPayment(mockTenantId, mockPaymentId, refundDto)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('getPaymentByTransactionId', () => {
    it('should return payment by transaction ID', async () => {
      const mockPayment = {
        id: mockPaymentId,
        transactionId: 'TXN-123456',
        status: 'succeeded',
      }

      paymentRepository.findOne.mockResolvedValue(mockPayment)

      const result = await service.getPaymentByTransactionId(mockTenantId, 'TXN-123456')

      expect(result).toBeDefined()
      expect(result.transactionId).toBe('TXN-123456')
    })
  })
})
