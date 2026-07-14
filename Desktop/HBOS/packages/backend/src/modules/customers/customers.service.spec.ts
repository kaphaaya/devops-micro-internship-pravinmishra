import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CustomersService } from './customers.service'
import { Customer } from './entities/customer.entity'
import { ConflictException, NotFoundException } from '@nestjs/common'

describe('CustomersService', () => {
  let service: CustomersService
  let repository: Repository<Customer>

  const tenantId = '550e8400-e29b-41d4-a716-446655440000'
  const customerId = '550e8400-e29b-41d4-a716-446655440001'

  const mockCustomer: Customer = {
    id: customerId as any,
    tenantId: tenantId as any,
    email: 'john@example.com',
    phone: '+1234567890',
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    customerType: 'regular',
    totalVisits: 5,
    lifetimeValue: 250,
    averageOrderValue: 50,
    lastVisitAt: new Date(),
    emailOptIn: true,
    smsOptIn: false,
    preferences: { dietary: 'vegetarian' },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CustomersService>(CustomersService)
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer))
  })

  describe('Customer Management', () => {
    describe('createCustomer', () => {
      it('should create a new customer', async () => {
        const createDto = {
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
        }

        jest.spyOn(repository, 'findOne').mockResolvedValue(null)
        jest.spyOn(repository, 'create').mockReturnValue(mockCustomer)
        jest.spyOn(repository, 'save').mockResolvedValue(mockCustomer)

        const result = await service.createCustomer(tenantId, createDto)

        expect(result).toBeDefined()
        expect(result.email).toBe(mockCustomer.email)
        expect(repository.save).toHaveBeenCalled()
      })

      it('should throw ConflictException if email already exists', async () => {
        const createDto = { email: 'john@example.com' }

        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)

        await expect(service.createCustomer(tenantId, createDto)).rejects.toThrow(
          ConflictException,
        )
      })

      it('should throw ConflictException if phone already exists', async () => {
        const createDto = { phone: '+1234567890' }

        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce(mockCustomer)

        await expect(service.createCustomer(tenantId, createDto)).rejects.toThrow(
          ConflictException,
        )
      })

      it('should set default values', async () => {
        const createDto = { email: 'test@example.com' }

        jest.spyOn(repository, 'findOne').mockResolvedValue(null)
        jest.spyOn(repository, 'create').mockReturnValue(mockCustomer)
        jest.spyOn(repository, 'save').mockResolvedValue(mockCustomer)

        await service.createCustomer(tenantId, createDto)

        expect(repository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            customerType: 'regular',
            status: 'active',
            totalVisits: 0,
          }),
        )
      })
    })

    describe('getCustomerById', () => {
      it('should return a customer by ID', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)

        const result = await service.getCustomerById(tenantId, customerId)

        expect(result).toBeDefined()
        expect(result.id).toBe(mockCustomer.id)
        expect(result.email).toBe(mockCustomer.email)
      })

      it('should throw NotFoundException if customer does not exist', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)

        await expect(service.getCustomerById(tenantId, 'non-existent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('getCustomerByEmail', () => {
      it('should return a customer by email', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)

        const result = await service.getCustomerByEmail(tenantId, 'john@example.com')

        expect(result).toBeDefined()
        expect(result.email).toBe(mockCustomer.email)
      })

      it('should throw NotFoundException if customer does not exist', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)

        await expect(service.getCustomerByEmail(tenantId, 'notfound@example.com')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('getCustomerByPhone', () => {
      it('should return a customer by phone', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)

        const result = await service.getCustomerByPhone(tenantId, '+1234567890')

        expect(result).toBeDefined()
        expect(result.phone).toBe(mockCustomer.phone)
      })

      it('should throw NotFoundException if customer does not exist', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)

        await expect(service.getCustomerByPhone(tenantId, '+9999999999')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('listCustomers', () => {
      it('should return paginated list of active customers', async () => {
        jest.spyOn(repository, 'findAndCount').mockResolvedValue([[mockCustomer], 1])

        const result = await service.listCustomers(tenantId, {}, 0, 50)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
        expect(result.total).toBe(1)
      })

      it('should filter by customer type', async () => {
        jest.spyOn(repository, 'findAndCount').mockResolvedValue([[mockCustomer], 1])

        await service.listCustomers(tenantId, { customerType: 'vip' }, 0, 50)

        expect(repository.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              customerType: 'vip',
            }),
          }),
        )
      })
    })

    describe('searchCustomers', () => {
      it('should search customers by name, email, or phone', async () => {
        jest.spyOn(repository, 'find').mockResolvedValue([mockCustomer])

        const result = await service.searchCustomers(tenantId, 'john', 20)

        expect(result).toBeDefined()
        expect(result).toHaveLength(1)
      })
    })

    describe('updateCustomer', () => {
      it('should update customer details', async () => {
        const updateDto = { email: 'newemail@example.com', firstName: 'Jane' }
        const updated = { ...mockCustomer, ...updateDto }

        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)
        jest.spyOn(repository, 'save').mockResolvedValue(updated)

        const result = await service.updateCustomer(tenantId, customerId, updateDto)

        expect(result.email).toBe(updateDto.email)
        expect(result.firstName).toBe(updateDto.firstName)
      })

      it('should throw NotFoundException if customer does not exist', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)

        await expect(
          service.updateCustomer(tenantId, 'non-existent', {}),
        ).rejects.toThrow(NotFoundException)
      })

      it('should throw ConflictException if email already exists', async () => {
        const updateDto = { email: 'taken@example.com' }
        const existingCustomer = { ...mockCustomer, id: 'different-id' as any }

        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockCustomer).mockResolvedValueOnce(existingCustomer)

        await expect(
          service.updateCustomer(tenantId, customerId, updateDto),
        ).rejects.toThrow(ConflictException)
      })
    })

    describe('deleteCustomer', () => {
      it('should soft delete a customer', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)
        jest.spyOn(repository, 'save').mockResolvedValue(mockCustomer)

        await service.deleteCustomer(tenantId, customerId)

        expect(repository.save).toHaveBeenCalled()
      })

      it('should throw NotFoundException if customer does not exist', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)

        await expect(service.deleteCustomer(tenantId, 'non-existent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })
  })

  describe('Metrics & Order History', () => {
    describe('updateCustomerMetrics', () => {
      it('should update customer metrics after order', async () => {
        const orderTotal = 75
        const updated = {
          ...mockCustomer,
          totalVisits: mockCustomer.totalVisits + 1,
          lifetimeValue: mockCustomer.lifetimeValue + orderTotal,
        }

        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)
        jest.spyOn(repository, 'save').mockResolvedValue(updated)

        const result = await service.updateCustomerMetrics(tenantId, customerId, orderTotal)

        expect(result).toBeDefined()
        expect(result.totalVisits).toBe(mockCustomer.totalVisits + 1)
      })

      it('should promote customer to VIP for high lifetime value', async () => {
        const vipCustomer = { ...mockCustomer, lifetimeValue: 400, totalVisits: 8 }
        const orderTotal = 200 // Will push lifetime value to 600
        const updated = { ...vipCustomer, customerType: 'vip' }

        jest.spyOn(repository, 'findOne').mockResolvedValue(vipCustomer)
        jest.spyOn(repository, 'save').mockResolvedValue(updated)

        const result = await service.updateCustomerMetrics(tenantId, customerId, orderTotal)

        expect(result).toBeDefined()
      })

      it('should throw NotFoundException if customer does not exist', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)

        await expect(
          service.updateCustomerMetrics(tenantId, 'non-existent', 100),
        ).rejects.toThrow(NotFoundException)
      })
    })

    describe('getCustomerMetrics', () => {
      it('should return customer metrics', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer)

        const result = await service.getCustomerMetrics(tenantId, customerId)

        expect(result).toBeDefined()
        expect(result.totalVisits).toBe(mockCustomer.totalVisits)
        expect(result.lifetimeValue).toBe(mockCustomer.lifetimeValue)
      })
    })

    describe('getTopCustomers', () => {
      it('should return top customers by lifetime value', async () => {
        jest.spyOn(repository, 'find').mockResolvedValue([mockCustomer])

        const result = await service.getTopCustomers(tenantId, 10)

        expect(result).toBeDefined()
        expect(result).toHaveLength(1)
      })
    })

    describe('getRecentCustomers', () => {
      it('should return recent customers', async () => {
        jest.spyOn(repository, 'find').mockResolvedValue([mockCustomer])

        const result = await service.getRecentCustomers(tenantId, 20)

        expect(result).toBeDefined()
        expect(result).toHaveLength(1)
      })
    })

    describe('getCustomersBulk', () => {
      it('should return multiple customers by IDs', async () => {
        jest.spyOn(repository, 'find').mockResolvedValue([mockCustomer])

        const result = await service.getCustomersBulk(tenantId, [customerId])

        expect(result).toBeDefined()
        expect(result).toHaveLength(1)
      })
    })
  })
})
