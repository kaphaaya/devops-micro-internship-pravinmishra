import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerDto, CustomerWithNameDto, CustomerSearchDto, CustomerMetricsDto } from './dto/customer.dto'

/**
 * Customers Controller
 * Handles customer management and profile operations
 */
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  // ============================================================================
  // Customer Management
  // ============================================================================

  /**
   * POST /customers
   * Create a new customer
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(
    @Request() req: any,
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDto> {
    return this.customersService.createCustomer(req.user.tenantId, createCustomerDto)
  }

  /**
   * GET /customers
   * List customers with filters
   */
  @Get()
  async listCustomers(
    @Request() req: any,
    @Query('customerType') customerType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ): Promise<{ data: CustomerDto[]; total: number }> {
    return this.customersService.listCustomers(
      req.user.tenantId,
      { customerType, status, search },
      parseInt(skip as any),
      parseInt(take as any),
    )
  }

  /**
   * GET /customers/search
   * Search customers by name, email, or phone
   */
  @Get('search')
  async searchCustomers(
    @Request() req: any,
    @Query('q') query: string,
    @Query('limit') limit = 20,
  ): Promise<CustomerSearchDto[]> {
    return this.customersService.searchCustomers(req.user.tenantId, query, parseInt(limit as any))
  }

  /**
   * GET /customers/by-type/:customerType
   * Get customers by type
   */
  @Get('by-type/:customerType')
  async getCustomersByType(
    @Request() req: any,
    @Param('customerType') customerType: string,
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ): Promise<{ data: CustomerDto[]; total: number }> {
    return this.customersService.getCustomersByType(
      req.user.tenantId,
      customerType,
      parseInt(skip as any),
      parseInt(take as any),
    )
  }

  /**
   * GET /customers/top
   * Get top customers by lifetime value
   */
  @Get('top')
  async getTopCustomers(
    @Request() req: any,
    @Query('limit') limit = 10,
  ): Promise<CustomerWithNameDto[]> {
    return this.customersService.getTopCustomers(req.user.tenantId, parseInt(limit as any))
  }

  /**
   * GET /customers/recent
   * Get recently active customers
   */
  @Get('recent')
  async getRecentCustomers(
    @Request() req: any,
    @Query('limit') limit = 20,
  ): Promise<CustomerWithNameDto[]> {
    return this.customersService.getRecentCustomers(req.user.tenantId, parseInt(limit as any))
  }

  /**
   * GET /customers/:customerId
   * Get customer by ID
   */
  @Get(':customerId')
  async getCustomer(
    @Request() req: any,
    @Param('customerId') customerId: string,
  ): Promise<CustomerDto> {
    return this.customersService.getCustomerById(req.user.tenantId, customerId)
  }

  /**
   * GET /customers/email/:email
   * Get customer by email
   */
  @Get('email/:email')
  async getCustomerByEmail(
    @Request() req: any,
    @Param('email') email: string,
  ): Promise<CustomerDto> {
    return this.customersService.getCustomerByEmail(req.user.tenantId, email)
  }

  /**
   * GET /customers/phone/:phone
   * Get customer by phone
   */
  @Get('phone/:phone')
  async getCustomerByPhone(
    @Request() req: any,
    @Param('phone') phone: string,
  ): Promise<CustomerDto> {
    return this.customersService.getCustomerByPhone(req.user.tenantId, phone)
  }

  /**
   * PATCH /customers/:customerId
   * Update customer
   */
  @Patch(':customerId')
  async updateCustomer(
    @Request() req: any,
    @Param('customerId') customerId: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    return this.customersService.updateCustomer(req.user.tenantId, customerId, updateCustomerDto)
  }

  /**
   * DELETE /customers/:customerId
   * Delete customer (soft delete)
   */
  @Delete(':customerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomer(
    @Request() req: any,
    @Param('customerId') customerId: string,
  ): Promise<void> {
    await this.customersService.deleteCustomer(req.user.tenantId, customerId)
  }

  // ============================================================================
  // Customer Metrics
  // ============================================================================

  /**
   * GET /customers/:customerId/metrics
   * Get customer metrics
   */
  @Get(':customerId/metrics')
  async getCustomerMetrics(
    @Request() req: any,
    @Param('customerId') customerId: string,
  ): Promise<CustomerMetricsDto> {
    return this.customersService.getCustomerMetrics(req.user.tenantId, customerId)
  }

  /**
   * POST /customers/:customerId/record-visit
   * Record order/visit and update metrics (called from orders module)
   */
  @Post(':customerId/record-visit')
  @HttpCode(HttpStatus.OK)
  async recordVisit(
    @Request() req: any,
    @Param('customerId') customerId: string,
    @Body('orderTotal') orderTotal: number,
  ): Promise<CustomerMetricsDto> {
    return this.customersService.updateCustomerMetrics(req.user.tenantId, customerId, orderTotal)
  }

  // ============================================================================
  // Bulk Operations
  // ============================================================================

  /**
   * POST /customers/bulk
   * Bulk get customers (for orders)
   */
  @Post('bulk')
  async getCustomersBulk(
    @Request() req: any,
    @Body('customerIds') customerIds: string[],
  ): Promise<CustomerDto[]> {
    return this.customersService.getCustomersBulk(req.user.tenantId, customerIds)
  }
}
