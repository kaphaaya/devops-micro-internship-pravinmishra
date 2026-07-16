import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { InventoryService } from './services/inventory.service'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'
import { AdjustInventoryDto } from './dto/adjust-inventory.dto'
import { InventoryDto, InventoryAuditDto } from './dto/inventory.dto'

/**
 * Inventory Controller
 * Handles inventory management endpoints
 */
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  /**
   * POST /inventory
   * Create inventory for a product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInventory(
    @Request() req: any,
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<InventoryDto> {
    return this.inventoryService.createInventory(req.user.tenantId, createInventoryDto)
  }

  /**
   * GET /inventory
   * List inventory with optional filtering
   */
  @Get()
  async listInventories(
    @Request() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('locationId') locationId?: string,
    @Query('status') status?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
  ): Promise<{ data: InventoryDto[]; total: number }> {
    return this.inventoryService.listInventories(req.user.tenantId, {
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 50,
      locationId,
      status,
      lowStockOnly: lowStockOnly === 'true',
    })
  }

  /**
   * GET /inventory/product/:productId
   * Get inventory for a product
   */
  @Get('product/:productId')
  async getInventoryByProduct(
    @Request() req: any,
    @Param('productId') productId: string,
    @Query('locationId') locationId?: string,
  ): Promise<InventoryDto> {
    return this.inventoryService.getInventoryByProduct(req.user.tenantId, productId, locationId)
  }

  /**
   * GET /inventory/low-stock
   * Get low stock items
   */
  @Get('low-stock')
  async getLowStockItems(
    @Request() req: any,
    @Query('locationId') locationId?: string,
    @Query('take') take?: string,
  ): Promise<InventoryDto[]> {
    return this.inventoryService.getLowStockItems(
      req.user.tenantId,
      locationId,
      take ? parseInt(take) : 50,
    )
  }

  /**
   * GET /inventory/:inventoryId
   * Get inventory details
   */
  @Get(':inventoryId')
  async getInventory(@Request() req: any, @Param('inventoryId') inventoryId: string): Promise<InventoryDto> {
    return this.inventoryService.getInventoryById(req.user.tenantId, inventoryId)
  }

  /**
   * PATCH /inventory/:inventoryId
   * Update inventory settings (reorder level, etc.)
   */
  @Patch(':inventoryId')
  async updateInventory(
    @Request() req: any,
    @Param('inventoryId') inventoryId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<InventoryDto> {
    return this.inventoryService.updateInventory(req.user.tenantId, inventoryId, updateInventoryDto)
  }

  /**
   * POST /inventory/:inventoryId/adjust
   * Adjust inventory quantity (receive, return, damage, etc.)
   */
  @Post(':inventoryId/adjust')
  async adjustInventory(
    @Request() req: any,
    @Param('inventoryId') inventoryId: string,
    @Body() adjustInventoryDto: AdjustInventoryDto,
  ): Promise<InventoryDto> {
    return this.inventoryService.adjustInventory(req.user.tenantId, inventoryId, adjustInventoryDto)
  }

  /**
   * GET /inventory/:inventoryId/audit
   * Get inventory audit history
   */
  @Get(':inventoryId/audit')
  async getAuditHistory(
    @Request() req: any,
    @Param('inventoryId') inventoryId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<{ data: InventoryAuditDto[]; total: number }> {
    return this.inventoryService.getAuditHistory(req.user.tenantId, inventoryId, {
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 50,
    })
  }
}
