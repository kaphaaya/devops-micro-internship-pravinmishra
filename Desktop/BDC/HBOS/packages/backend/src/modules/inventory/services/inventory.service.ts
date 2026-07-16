import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { Inventory } from '../entities/inventory.entity'
import { InventoryAudit } from '../entities/inventory-audit.entity'
import { CreateInventoryDto } from '../dto/create-inventory.dto'
import { UpdateInventoryDto } from '../dto/update-inventory.dto'
import { AdjustInventoryDto } from '../dto/adjust-inventory.dto'
import { InventoryDto, InventoryAuditDto } from '../dto/inventory.dto'
import { generateUUID } from '@hbos/core'

/**
 * Inventory Service
 * Manages stock levels and inventory tracking
 */
@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryAudit)
    private auditRepository: Repository<InventoryAudit>,
  ) {}

  /**
   * Create inventory for a product
   */
  async createInventory(tenantId: string, createDto: CreateInventoryDto): Promise<InventoryDto> {
    const { productId, locationId, quantityOnHand, reorderLevel, reorderQuantity, unitOfMeasure, metadata } = createDto

    // Check for existing inventory
    const existing = await this.inventoryRepository.findOne({
      where: {
        tenantId: tenantId as any,
        productId: productId as any,
        locationId: locationId as any,
      },
    })

    if (existing) {
      throw new ConflictException('Inventory already exists for this product and location')
    }

    const inventory = this.inventoryRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      productId: productId as any,
      locationId: locationId as any,
      quantityOnHand: quantityOnHand as any,
      quantityReserved: 0,
      quantityAvailable: quantityOnHand as any,
      reorderLevel: reorderLevel || 0,
      reorderQuantity: reorderQuantity || 0,
      unitOfMeasure: unitOfMeasure || 'piece',
      status: this.calculateStatus(quantityOnHand, reorderLevel || 0),
      metadata,
    })

    const saved = await this.inventoryRepository.save(inventory)

    // Create initial audit entry
    await this.auditRepository.save({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      inventoryId: saved.id,
      productId: productId as any,
      type: 'initial',
      quantityChanged: quantityOnHand as any,
      quantityBefore: 0 as any,
      quantityAfter: quantityOnHand as any,
      notes: 'Initial inventory creation',
    })

    return this.mapToDto(saved)
  }

  /**
   * Get inventory by ID
   */
  async getInventoryById(tenantId: string, inventoryId: string): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: inventoryId as any, tenantId: tenantId as any },
    })

    if (!inventory) {
      throw new NotFoundException('Inventory not found')
    }

    return this.mapToDto(inventory)
  }

  /**
   * Get inventory for product (with optional location)
   */
  async getInventoryByProduct(tenantId: string, productId: string, locationId?: string): Promise<InventoryDto> {
    const where: any = { tenantId: tenantId as any, productId: productId as any }

    if (locationId) {
      where.locationId = locationId as any
    } else {
      where.locationId = IsNull()
    }

    const inventory = await this.inventoryRepository.findOne({ where })

    if (!inventory) {
      throw new NotFoundException('Inventory not found for product')
    }

    return this.mapToDto(inventory)
  }

  /**
   * List inventories for tenant
   */
  async listInventories(
    tenantId: string,
    options: {
      skip?: number
      take?: number
      locationId?: string
      status?: string
      lowStockOnly?: boolean
    } = {},
  ): Promise<{ data: InventoryDto[]; total: number }> {
    const { skip = 0, take = 50, locationId, status, lowStockOnly } = options

    const where: any = { tenantId: tenantId as any }

    if (locationId) {
      where.locationId = locationId as any
    }
    if (status) {
      where.status = status
    }
    if (lowStockOnly) {
      where.status = 'low_stock'
    }

    const [inventories, total] = await this.inventoryRepository.findAndCount({
      where,
      skip,
      take,
      order: { updatedAt: 'DESC' },
    })

    return {
      data: inventories.map(inv => this.mapToDto(inv)),
      total,
    }
  }

  /**
   * Adjust inventory quantity
   */
  async adjustInventory(
    tenantId: string,
    inventoryId: string,
    adjustDto: AdjustInventoryDto,
  ): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: inventoryId as any, tenantId: tenantId as any },
    })

    if (!inventory) {
      throw new NotFoundException('Inventory not found')
    }

    const { quantity, type, notes, orderId, metadata } = adjustDto

    // Validate adjustment
    const newQuantity = parseFloat(inventory.quantityOnHand.toString()) + quantity
    if (newQuantity < 0) {
      throw new BadRequestException('Adjustment would result in negative inventory')
    }

    // Record audit
    const quantityBefore = parseFloat(inventory.quantityOnHand.toString())
    const quantityAfter = newQuantity

    await this.auditRepository.save({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      inventoryId: inventory.id,
      productId: inventory.productId,
      type: type as any,
      quantityChanged: quantity as any,
      quantityBefore: quantityBefore as any,
      quantityAfter: quantityAfter as any,
      orderId: orderId as any,
      notes,
      metadata,
    })

    // Update inventory
    inventory.quantityOnHand = newQuantity as any
    inventory.quantityAvailable = (newQuantity - parseFloat(inventory.quantityReserved.toString())) as any
    inventory.status = this.calculateStatus(newQuantity, parseFloat(inventory.reorderLevel.toString())) as any
    inventory.lastRestockedAt = type === 'received' ? new Date() : inventory.lastRestockedAt

    const updated = await this.inventoryRepository.save(inventory)
    return this.mapToDto(updated)
  }

  /**
   * Decrement inventory for order
   */
  async decrementForOrder(
    tenantId: string,
    productId: string,
    quantity: number,
    orderId: string,
    locationId?: string,
  ): Promise<InventoryDto> {
    const where: any = { tenantId: tenantId as any, productId: productId as any }

    if (locationId) {
      where.locationId = locationId as any
    } else {
      where.locationId = IsNull()
    }

    const inventory = await this.inventoryRepository.findOne({ where })

    if (!inventory) {
      throw new NotFoundException('Inventory not found for product')
    }

    const quantityAvailable = parseFloat(inventory.quantityAvailable.toString())
    if (quantityAvailable < quantity) {
      throw new BadRequestException(
        `Insufficient inventory. Available: ${quantityAvailable}, Requested: ${quantity}`,
      )
    }

    // Record audit
    const quantityBefore = parseFloat(inventory.quantityOnHand.toString())
    const quantityAfter = quantityBefore - quantity

    await this.auditRepository.save({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      inventoryId: inventory.id,
      productId: productId as any,
      type: 'sold',
      quantityChanged: -quantity as any,
      quantityBefore: quantityBefore as any,
      quantityAfter: quantityAfter as any,
      orderId: orderId as any,
      notes: `Order ${orderId}`,
    })

    // Update inventory
    inventory.quantityOnHand = quantityAfter as any
    inventory.quantityAvailable = (quantityAfter - parseFloat(inventory.quantityReserved.toString())) as any
    inventory.status = this.calculateStatus(quantityAfter, parseFloat(inventory.reorderLevel.toString())) as any

    const updated = await this.inventoryRepository.save(inventory)
    return this.mapToDto(updated)
  }

  /**
   * Update inventory settings (reorder levels, etc.)
   */
  async updateInventory(
    tenantId: string,
    inventoryId: string,
    updateDto: UpdateInventoryDto,
  ): Promise<InventoryDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: inventoryId as any, tenantId: tenantId as any },
    })

    if (!inventory) {
      throw new NotFoundException('Inventory not found')
    }

    const { reorderLevel, reorderQuantity, unitOfMeasure, metadata } = updateDto

    if (reorderLevel !== undefined) {
      inventory.reorderLevel = reorderLevel as any
      // Recalculate status based on new reorder level
      inventory.status = this.calculateStatus(
        parseFloat(inventory.quantityOnHand.toString()),
        reorderLevel,
      ) as any
    }
    if (reorderQuantity !== undefined) {
      inventory.reorderQuantity = reorderQuantity as any
    }
    if (unitOfMeasure !== undefined) {
      inventory.unitOfMeasure = unitOfMeasure
    }
    if (metadata !== undefined) {
      inventory.metadata = metadata
    }

    const updated = await this.inventoryRepository.save(inventory)
    return this.mapToDto(updated)
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(tenantId: string, locationId?: string, take = 50): Promise<InventoryDto[]> {
    const where: any = { tenantId: tenantId as any, status: 'low_stock' }

    if (locationId) {
      where.locationId = locationId as any
    }

    const inventories = await this.inventoryRepository.find({
      where,
      take,
      order: { quantityOnHand: 'ASC' },
    })

    return inventories.map(inv => this.mapToDto(inv))
  }

  /**
   * Get inventory audit history
   */
  async getAuditHistory(
    tenantId: string,
    inventoryId: string,
    options: { skip?: number; take?: number } = {},
  ): Promise<{ data: InventoryAuditDto[]; total: number }> {
    const { skip = 0, take = 50 } = options

    const [audits, total] = await this.auditRepository.findAndCount({
      where: { tenantId: tenantId as any, inventoryId: inventoryId as any },
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: audits.map(audit => this.mapAuditToDto(audit)),
      total,
    }
  }

  /**
   * Calculate inventory status based on quantity and reorder level
   */
  private calculateStatus(quantityOnHand: number, reorderLevel: number): string {
    const quantity = parseFloat(quantityOnHand.toString())
    const level = parseFloat(reorderLevel.toString())

    if (quantity <= 0) {
      return 'out_of_stock'
    } else if (quantity <= level) {
      return 'low_stock'
    } else {
      return 'in_stock'
    }
  }

  /**
   * Map entity to DTO
   */
  private mapToDto(inventory: Inventory): InventoryDto {
    return {
      id: inventory.id,
      tenantId: inventory.tenantId,
      locationId: inventory.locationId,
      productId: inventory.productId,
      quantityOnHand: parseFloat(inventory.quantityOnHand.toString()),
      quantityReserved: parseFloat(inventory.quantityReserved.toString()),
      quantityAvailable: parseFloat(inventory.quantityAvailable.toString()),
      reorderLevel: parseFloat(inventory.reorderLevel.toString()),
      reorderQuantity: parseFloat(inventory.reorderQuantity.toString()),
      unitOfMeasure: inventory.unitOfMeasure,
      status: inventory.status,
      lastRestockedAt: inventory.lastRestockedAt,
      lastCountedAt: inventory.lastCountedAt,
      metadata: inventory.metadata,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    }
  }

  /**
   * Map audit entity to DTO
   */
  private mapAuditToDto(audit: InventoryAudit): InventoryAuditDto {
    return {
      id: audit.id,
      tenantId: audit.tenantId,
      inventoryId: audit.inventoryId,
      productId: audit.productId,
      type: audit.type,
      quantityChanged: parseFloat(audit.quantityChanged.toString()),
      quantityBefore: parseFloat(audit.quantityBefore.toString()),
      quantityAfter: parseFloat(audit.quantityAfter.toString()),
      orderId: audit.orderId,
      userId: audit.userId,
      notes: audit.notes,
      metadata: audit.metadata,
      createdAt: audit.createdAt,
    }
  }
}
