import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant } from './entities/tenant.entity'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'
import { TenantDto, TenantWithSubscriptionDto } from './dto/tenant.dto'
import { generateUUID } from '@hbos/core'

/**
 * Tenants Service
 * Handles tenant management, subscriptions, and multi-tenancy operations
 */
@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  /**
   * Create a new tenant
   */
  async create(createTenantDto: CreateTenantDto): Promise<TenantDto> {
    const { name, slug, tier = 'starter' } = createTenantDto

    // Check if slug already exists
    const existingTenant = await this.tenantsRepository.findOne({
      where: { slug },
    })

    if (existingTenant) {
      throw new ConflictException(`Tenant with slug "${slug}" already exists`)
    }

    // Create tenant
    const tenant = this.tenantsRepository.create({
      id: generateUUID() as any,
      name,
      slug,
      tier,
      status: 'active',
      features: this.getDefaultFeatures(tier),
      subscriptionEndsAt: this.calculateSubscriptionEndDate(tier),
    })

    const savedTenant = await this.tenantsRepository.save(tenant)
    return this.mapToDto(savedTenant)
  }

  /**
   * Get tenant by ID
   */
  async findById(id: string): Promise<TenantDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`)
    }

    if (tenant.status === 'deleted') {
      throw new NotFoundException(`Tenant with ID "${id}" has been deleted`)
    }

    return this.mapToDto(tenant)
  }

  /**
   * Get tenant by slug
   */
  async findBySlug(slug: string): Promise<TenantDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { slug },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with slug "${slug}" not found`)
    }

    if (tenant.status === 'deleted') {
      throw new NotFoundException(`Tenant with slug "${slug}" has been deleted`)
    }

    return this.mapToDto(tenant)
  }

  /**
   * Get tenant with subscription info
   */
  async findByIdWithSubscription(id: string): Promise<TenantWithSubscriptionDto> {
    const tenant = await this.findById(id)

    const now = new Date()
    const isSubscriptionActive = !tenant.subscriptionEndsAt || tenant.subscriptionEndsAt > now
    const daysUntilExpiration = tenant.subscriptionEndsAt
      ? Math.ceil((tenant.subscriptionEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : undefined

    return {
      ...tenant,
      isSubscriptionActive,
      daysUntilExpiration: isSubscriptionActive ? daysUntilExpiration : 0,
    }
  }

  /**
   * List all active tenants
   */
  async findAll(skip = 0, take = 20): Promise<{ data: TenantDto[]; total: number }> {
    const [tenants, total] = await this.tenantsRepository.findAndCount({
      where: { status: 'active' },
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: tenants.map(t => this.mapToDto(t)),
      total,
    }
  }

  /**
   * Update tenant
   */
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`)
    }

    if (tenant.status === 'deleted') {
      throw new BadRequestException('Cannot update a deleted tenant')
    }

    // Update allowed fields
    if (updateTenantDto.name) {
      tenant.name = updateTenantDto.name
    }
    if (updateTenantDto.tier) {
      tenant.tier = updateTenantDto.tier
      // Reset features based on new tier
      tenant.features = this.getDefaultFeatures(updateTenantDto.tier)
    }
    if (updateTenantDto.status) {
      tenant.status = updateTenantDto.status
    }
    if (updateTenantDto.subscriptionEndsAt !== undefined) {
      tenant.subscriptionEndsAt = updateTenantDto.subscriptionEndsAt
    }
    if (updateTenantDto.features) {
      tenant.features = { ...tenant.features, ...updateTenantDto.features }
    }

    const updatedTenant = await this.tenantsRepository.save(tenant)
    return this.mapToDto(updatedTenant)
  }

  /**
   * Soft delete tenant
   */
  async softDelete(id: string): Promise<void> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`)
    }

    if (tenant.status === 'deleted') {
      throw new BadRequestException('Tenant is already deleted')
    }

    // Soft delete by marking status as deleted
    tenant.status = 'deleted'
    tenant.deletedAt = new Date()
    await this.tenantsRepository.save(tenant)
  }

  /**
   * Restore deleted tenant
   */
  async restore(id: string): Promise<TenantDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any, status: 'deleted' },
    })

    if (!tenant) {
      throw new NotFoundException(`Deleted tenant with ID "${id}" not found`)
    }

    tenant.status = 'active'
    tenant.deletedAt = null
    const restored = await this.tenantsRepository.save(tenant)
    return this.mapToDto(restored)
  }

  /**
   * Renew subscription for tenant
   */
  async renewSubscription(id: string, daysToAdd = 365): Promise<TenantWithSubscriptionDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`)
    }

    if (tenant.status === 'deleted') {
      throw new BadRequestException('Cannot renew subscription for deleted tenant')
    }

    const now = new Date()
    const startDate = tenant.subscriptionEndsAt && tenant.subscriptionEndsAt > now
      ? tenant.subscriptionEndsAt
      : now

    tenant.subscriptionEndsAt = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    await this.tenantsRepository.save(tenant)

    return this.findByIdWithSubscription(id)
  }

  /**
   * Check if tenant subscription is active
   */
  async isSubscriptionActive(tenantId: string): Promise<boolean> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: tenantId as any },
    })

    if (!tenant || tenant.status !== 'active') {
      return false
    }

    if (!tenant.subscriptionEndsAt) {
      return true
    }

    return tenant.subscriptionEndsAt > new Date()
  }

  /**
   * Check if tenant has feature enabled
   */
  async hasFeature(tenantId: string, featureName: string): Promise<boolean> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: tenantId as any },
    })

    if (!tenant) {
      return false
    }

    return tenant.features?.[featureName] === true
  }

  /**
   * Enable feature for tenant
   */
  async enableFeature(id: string, featureName: string): Promise<TenantDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`)
    }

    if (!tenant.features) {
      tenant.features = {}
    }

    tenant.features[featureName] = true
    const updated = await this.tenantsRepository.save(tenant)
    return this.mapToDto(updated)
  }

  /**
   * Disable feature for tenant
   */
  async disableFeature(id: string, featureName: string): Promise<TenantDto> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: id as any },
    })

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${id}" not found`)
    }

    if (!tenant.features) {
      tenant.features = {}
    }

    tenant.features[featureName] = false
    const updated = await this.tenantsRepository.save(tenant)
    return this.mapToDto(updated)
  }

  /**
   * Get default features for a tier
   */
  private getDefaultFeatures(tier: string): Record<string, boolean> {
    const featureMatrix: Record<string, Record<string, boolean>> = {
      starter: {
        pos: true,
        inventory: true,
        orders: true,
        customers: true,
        reporting: false,
        crm: false,
        advanced_inventory: false,
        multi_location: false,
      },
      professional: {
        pos: true,
        inventory: true,
        orders: true,
        customers: true,
        reporting: true,
        crm: true,
        advanced_inventory: true,
        multi_location: false,
      },
      enterprise: {
        pos: true,
        inventory: true,
        orders: true,
        customers: true,
        reporting: true,
        crm: true,
        advanced_inventory: true,
        multi_location: true,
      },
    }

    return featureMatrix[tier] || featureMatrix.starter
  }

  /**
   * Calculate subscription end date based on tier
   */
  private calculateSubscriptionEndDate(tier: string): Date {
    const now = new Date()
    // Default: 30 days from now
    const expirationDays = {
      starter: 30,
      professional: 365,
      enterprise: 365, // Enterprise billed annually
    }

    const days = expirationDays[tier] || 30
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  }

  /**
   * Map Tenant entity to DTO
   */
  private mapToDto(tenant: Tenant): TenantDto {
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
      tier: tenant.tier,
      subscriptionEndsAt: tenant.subscriptionEndsAt,
      features: tenant.features,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    }
  }
}
