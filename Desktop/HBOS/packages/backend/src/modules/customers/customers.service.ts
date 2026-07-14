import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, In } from 'typeorm'
import { Customer } from './entities/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerDto, CustomerWithNameDto, CustomerSearchDto, CustomerMetricsDto } from './dto/customer.dto'
import { generateUUID } from '@hbos/core'

/**
 * Customers Service
 * Handles customer management, profile updates, and metrics
 */
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  // ============================================================================
  // Customer Management
  // ============================================================================

  /**
   * Create a new customer
   */
  async createCustomer(tenantId: string, createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    const { email, phone } = createCustomerDto

    // Check for duplicate email (per tenant)
    if (email) {
      const existing = await this.customersRepository.findOne({
        where: { tenantId: tenantId as any, email },
      })
      if (existing) {
        throw new ConflictException(`Customer with email "${email}" already exists`)
      }
    }

    // Check for duplicate phone (per tenant)
    if (phone) {
      const existing = await this.customersRepository.findOne({
        where: { tenantId: tenantId as any, phone },
      })
      if (existing) {
        throw new ConflictException(`Customer with phone "${phone}" already exists`)
      }
    }

    const customer = this.customersRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      email,
      phone,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      addressLine1: createCustomerDto.addressLine1,
      city: createCustomerDto.city,
      postalCode: createCustomerDto.postalCode,
      customerType: createCustomerDto.customerType || 'regular',
      emailOptIn: createCustomerDto.emailOptIn || false,
      smsOptIn: createCustomerDto.smsOptIn || false,
      preferences: createCustomerDto.preferences || {},
      status: 'active',
      totalVisits: 0,
      lifetimeValue: 0,
      averageOrderValue: 0,
    })

    const saved = await this.customersRepository.save(customer)
    return this.mapCustomerToDto(saved)
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(tenantId: string, customerId: string): Promise<CustomerDto> {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId as any, tenantId: tenantId as any },
    })

    if (!customer) {
      throw new NotFoundException(`Customer not found`)
    }

    return this.mapCustomerToDto(customer)
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(tenantId: string, email: string): Promise<CustomerDto> {
    const customer = await this.customersRepository.findOne({
      where: { tenantId: tenantId as any, email },
    })

    if (!customer) {
      throw new NotFoundException(`Customer with email "${email}" not found`)
    }

    return this.mapCustomerToDto(customer)
  }

  /**
   * Get customer by phone
   */
  async getCustomerByPhone(tenantId: string, phone: string): Promise<CustomerDto> {
    const customer = await this.customersRepository.findOne({
      where: { tenantId: tenantId as any, phone },
    })

    if (!customer) {
      throw new NotFoundException(`Customer with phone "${phone}" not found`)
    }

    return this.mapCustomerToDto(customer)
  }

  /**
   * List customers for tenant
   */
  async listCustomers(
    tenantId: string,
    filters?: {
      customerType?: string
      status?: string
      search?: string
    },
    skip = 0,
    take = 50,
  ): Promise<{ data: CustomerDto[]; total: number }> {
    const where: any = { tenantId: tenantId as any }

    if (filters?.customerType) {
      where.customerType = filters.customerType
    }

    if (filters?.status) {
      where.status = filters.status
    } else {
      where.status = 'active'
    }

    if (filters?.search) {
      // Search by name or email
      where.firstName = ILike(`%${filters.search}%`)
    }

    const [customers, total] = await this.customersRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: customers.map(c => this.mapCustomerToDto(c)),
      total,
    }
  }

  /**
   * Search customers by name, email, or phone
   */
  async searchCustomers(
    tenantId: string,
    query: string,
    limit = 20,
  ): Promise<CustomerSearchDto[]> {
    const customers = await this.customersRepository.find({
      where: [
        { tenantId: tenantId as any, firstName: ILike(`%${query}%`) },
        { tenantId: tenantId as any, lastName: ILike(`%${query}%`) },
        { tenantId: tenantId as any, email: ILike(`%${query}%`) },
        { tenantId: tenantId as any, phone: ILike(`%${query}%`) },
      ],
      select: [
        'id',
        'email',
        'phone',
        'firstName',
        'lastName',
        'customerType',
        'totalVisits',
        'lifetimeValue',
      ],
      take: limit,
    })

    // Remove duplicates
    const uniqueCustomers = Array.from(
      new Map(customers.map(c => [c.id, c])).values(),
    )

    return uniqueCustomers.map(c => ({
      id: c.id,
      email: c.email,
      phone: c.phone,
      firstName: c.firstName,
      lastName: c.lastName,
      customerType: c.customerType,
      totalVisits: c.totalVisits,
      lifetimeValue: parseFloat(c.lifetimeValue as any),
    }))
  }

  /**
   * Get customers by type (VIP, regular, etc.)
   */
  async getCustomersByType(
    tenantId: string,
    customerType: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: CustomerDto[]; total: number }> {
    const [customers, total] = await this.customersRepository.findAndCount({
      where: { tenantId: tenantId as any, customerType: customerType as any },
      skip,
      take,
      order: { lifetimeValue: 'DESC' },
    })

    return {
      data: customers.map(c => this.mapCustomerToDto(c)),
      total,
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(
    tenantId: string,
    customerId: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId as any, tenantId: tenantId as any },
    })

    if (!customer) {
      throw new NotFoundException(`Customer not found`)
    }

    // Check email uniqueness if changed
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existing = await this.customersRepository.findOne({
        where: { tenantId: tenantId as any, email: updateCustomerDto.email },
      })
      if (existing) {
        throw new ConflictException(`Customer with email "${updateCustomerDto.email}" already exists`)
      }
    }

    // Check phone uniqueness if changed
    if (updateCustomerDto.phone && updateCustomerDto.phone !== customer.phone) {
      const existing = await this.customersRepository.findOne({
        where: { tenantId: tenantId as any, phone: updateCustomerDto.phone },
      })
      if (existing) {
        throw new ConflictException(`Customer with phone "${updateCustomerDto.phone}" already exists`)
      }
    }

    // Update allowed fields
    if (updateCustomerDto.email !== undefined) customer.email = updateCustomerDto.email
    if (updateCustomerDto.phone !== undefined) customer.phone = updateCustomerDto.phone
    if (updateCustomerDto.firstName !== undefined) customer.firstName = updateCustomerDto.firstName
    if (updateCustomerDto.lastName !== undefined) customer.lastName = updateCustomerDto.lastName
    if (updateCustomerDto.addressLine1 !== undefined) customer.addressLine1 = updateCustomerDto.addressLine1
    if (updateCustomerDto.city !== undefined) customer.city = updateCustomerDto.city
    if (updateCustomerDto.postalCode !== undefined) customer.postalCode = updateCustomerDto.postalCode
    if (updateCustomerDto.customerType !== undefined) customer.customerType = updateCustomerDto.customerType
    if (updateCustomerDto.emailOptIn !== undefined) customer.emailOptIn = updateCustomerDto.emailOptIn
    if (updateCustomerDto.smsOptIn !== undefined) customer.smsOptIn = updateCustomerDto.smsOptIn
    if (updateCustomerDto.status !== undefined) customer.status = updateCustomerDto.status
    if (updateCustomerDto.preferences !== undefined) {
      customer.preferences = { ...customer.preferences, ...updateCustomerDto.preferences }
    }

    const updated = await this.customersRepository.save(customer)
    return this.mapCustomerToDto(updated)
  }

  /**
   * Soft delete customer
   */
  async deleteCustomer(tenantId: string, customerId: string): Promise<void> {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId as any, tenantId: tenantId as any },
    })

    if (!customer) {
      throw new NotFoundException(`Customer not found`)
    }

    customer.status = 'inactive'
    customer.deletedAt = new Date()
    await this.customersRepository.save(customer)
  }

  // ============================================================================
  // Metrics & Order History
  // ============================================================================

  /**
   * Update customer metrics after order
   */
  async updateCustomerMetrics(
    tenantId: string,
    customerId: string,
    orderTotal: number,
  ): Promise<CustomerMetricsDto> {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId as any, tenantId: tenantId as any },
    })

    if (!customer) {
      throw new NotFoundException(`Customer not found`)
    }

    // Update metrics
    customer.totalVisits += 1
    customer.lifetimeValue = parseFloat(customer.lifetimeValue as any) + orderTotal
    customer.averageOrderValue = parseFloat(
      (parseFloat(customer.lifetimeValue as any) / customer.totalVisits).toFixed(2),
    ) as any
    customer.lastVisitAt = new Date()

    // Update customer type based on lifetime value
    const lifetimeValue = parseFloat(customer.lifetimeValue as any)
    if (lifetimeValue > 1000) {
      customer.customerType = 'vip_plus'
    } else if (lifetimeValue > 500) {
      customer.customerType = 'vip'
    }

    const updated = await this.customersRepository.save(customer)
    return this.mapCustomerMetricsToDto(updated)
  }

  /**
   * Get customer metrics
   */
  async getCustomerMetrics(tenantId: string, customerId: string): Promise<CustomerMetricsDto> {
    const customer = await this.customersRepository.findOne({
      where: { id: customerId as any, tenantId: tenantId as any },
      select: ['totalVisits', 'lifetimeValue', 'averageOrderValue', 'lastVisitAt'],
    })

    if (!customer) {
      throw new NotFoundException(`Customer not found`)
    }

    return this.mapCustomerMetricsToDto(customer)
  }

  /**
   * Get top customers by lifetime value
   */
  async getTopCustomers(
    tenantId: string,
    limit = 10,
  ): Promise<CustomerWithNameDto[]> {
    const customers = await this.customersRepository.find({
      where: { tenantId: tenantId as any, status: 'active' },
      order: { lifetimeValue: 'DESC' },
      take: limit,
    })

    return customers.map(c => ({
      ...this.mapCustomerToDto(c),
      displayName: this.getDisplayName(c),
    }))
  }

  /**
   * Get recent customers
   */
  async getRecentCustomers(
    tenantId: string,
    limit = 20,
  ): Promise<CustomerWithNameDto[]> {
    const customers = await this.customersRepository.find({
      where: { tenantId: tenantId as any, status: 'active' },
      order: { lastVisitAt: 'DESC' },
      take: limit,
    })

    return customers.map(c => ({
      ...this.mapCustomerToDto(c),
      displayName: this.getDisplayName(c),
    }))
  }

  /**
   * Bulk get customers (for orders, etc.)
   */
  async getCustomersBulk(tenantId: string, customerIds: string[]): Promise<CustomerDto[]> {
    const customers = await this.customersRepository.find({
      where: { id: In(customerIds as any[]), tenantId: tenantId as any },
    })

    return customers.map(c => this.mapCustomerToDto(c))
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getDisplayName(customer: Customer): string {
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`
    }
    if (customer.firstName) {
      return customer.firstName
    }
    if (customer.lastName) {
      return customer.lastName
    }
    return customer.email || customer.phone || 'Unknown Customer'
  }

  private mapCustomerToDto(customer: Customer): CustomerDto {
    return {
      id: customer.id,
      tenantId: customer.tenantId,
      email: customer.email,
      phone: customer.phone,
      firstName: customer.firstName,
      lastName: customer.lastName,
      addressLine1: customer.addressLine1,
      city: customer.city,
      postalCode: customer.postalCode,
      customerType: customer.customerType,
      totalVisits: customer.totalVisits,
      lifetimeValue: parseFloat(customer.lifetimeValue as any),
      averageOrderValue: parseFloat(customer.averageOrderValue as any),
      lastVisitAt: customer.lastVisitAt,
      emailOptIn: customer.emailOptIn,
      smsOptIn: customer.smsOptIn,
      preferences: customer.preferences,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }
  }

  private mapCustomerMetricsToDto(customer: Customer): CustomerMetricsDto {
    return {
      totalVisits: customer.totalVisits,
      lifetimeValue: parseFloat(customer.lifetimeValue as any),
      averageOrderValue: parseFloat(customer.averageOrderValue as any),
      lastVisitAt: customer.lastVisitAt,
    }
  }
}
