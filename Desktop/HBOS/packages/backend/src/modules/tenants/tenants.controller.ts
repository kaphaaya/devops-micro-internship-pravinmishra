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
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { TenantsService } from './tenants.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { TenantDto, TenantWithSubscriptionDto } from './dto/tenant.dto'

/**
 * Tenants Controller
 * Handles tenant management endpoints
 */
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  /**
   * POST /tenants
   * Create a new tenant
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTenantDto: CreateTenantDto): Promise<TenantDto> {
    return this.tenantsService.create(createTenantDto)
  }

  /**
   * GET /tenants
   * List all active tenants (paginated)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 20,
  ): Promise<{ data: TenantDto[]; total: number }> {
    return this.tenantsService.findAll(parseInt(skip as any), parseInt(take as any))
  }

  /**
   * GET /tenants/:id
   * Get tenant by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<TenantDto> {
    return this.tenantsService.findById(id)
  }

  /**
   * GET /tenants/:id/subscription
   * Get tenant with subscription info
   */
  @Get(':id/subscription')
  @UseGuards(JwtAuthGuard)
  async findByIdWithSubscription(@Param('id') id: string): Promise<TenantWithSubscriptionDto> {
    return this.tenantsService.findByIdWithSubscription(id)
  }

  /**
   * GET /tenants/slug/:slug
   * Get tenant by slug
   */
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<TenantDto> {
    return this.tenantsService.findBySlug(slug)
  }

  /**
   * PATCH /tenants/:id
   * Update tenant
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDto> {
    return this.tenantsService.update(id, updateTenantDto)
  }

  /**
   * POST /tenants/:id/renew-subscription
   * Renew tenant subscription
   */
  @Post(':id/renew-subscription')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async renewSubscription(
    @Param('id') id: string,
    @Body('daysToAdd') daysToAdd = 365,
  ): Promise<TenantWithSubscriptionDto> {
    return this.tenantsService.renewSubscription(id, daysToAdd)
  }

  /**
   * POST /tenants/:id/features/:featureName/enable
   * Enable a feature for tenant
   */
  @Post(':id/features/:featureName/enable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async enableFeature(
    @Param('id') id: string,
    @Param('featureName') featureName: string,
  ): Promise<TenantDto> {
    return this.tenantsService.enableFeature(id, featureName)
  }

  /**
   * POST /tenants/:id/features/:featureName/disable
   * Disable a feature for tenant
   */
  @Post(':id/features/:featureName/disable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async disableFeature(
    @Param('id') id: string,
    @Param('featureName') featureName: string,
  ): Promise<TenantDto> {
    return this.tenantsService.disableFeature(id, featureName)
  }

  /**
   * DELETE /tenants/:id
   * Soft delete tenant
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.tenantsService.softDelete(id)
  }

  /**
   * POST /tenants/:id/restore
   * Restore deleted tenant
   */
  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string): Promise<TenantDto> {
    return this.tenantsService.restore(id)
  }
}
