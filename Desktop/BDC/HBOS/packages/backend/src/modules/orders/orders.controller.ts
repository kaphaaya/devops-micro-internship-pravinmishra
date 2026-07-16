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
import { OrdersService } from './services/orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { CreateOrderItemDto } from './dto/create-order-item.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { OrderDto, OrderItemDto } from './dto/order.dto'

/**
 * Orders Controller
 * Handles order management endpoints
 */
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  /**
   * POST /orders
   * Create a new order
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Request() req: any, @Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    return this.ordersService.createOrder(req.user.tenantId, createOrderDto)
  }

  /**
   * GET /orders
   * List orders with optional filtering
   */
  @Get()
  async listOrders(
    @Request() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: OrderDto[]; total: number }> {
    const options: any = {
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 50,
    }

    if (status) options.status = status
    if (paymentStatus) options.paymentStatus = paymentStatus
    if (customerId) options.customerId = customerId
    if (startDate) options.startDate = new Date(startDate)
    if (endDate) options.endDate = new Date(endDate)

    return this.ordersService.listOrders(req.user.tenantId, options)
  }

  /**
   * GET /orders/:orderId
   * Get order details
   */
  @Get(':orderId')
  async getOrder(@Request() req: any, @Param('orderId') orderId: string): Promise<OrderDto> {
    return this.ordersService.getOrderById(req.user.tenantId, orderId)
  }

  /**
   * PATCH /orders/:orderId/status
   * Update order status
   */
  @Patch(':orderId/status')
  async updateOrderStatus(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return this.ordersService.updateOrderStatus(req.user.tenantId, orderId, updateStatusDto)
  }

  /**
   * GET /orders/:orderId/items
   * Get order items
   */
  @Get(':orderId/items')
  async getOrderItems(@Request() req: any, @Param('orderId') orderId: string): Promise<OrderItemDto[]> {
    return this.ordersService.getOrderItems(req.user.tenantId, orderId)
  }

  /**
   * POST /orders/:orderId/items
   * Add item to order
   */
  @Post(':orderId/items')
  @HttpCode(HttpStatus.CREATED)
  async addItemToOrder(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Body() createItemDto: CreateOrderItemDto,
  ): Promise<OrderItemDto> {
    // Note: In production, you would validate the product exists in ProductsService
    // and fetch pricing/tax info. For now, this is a placeholder.
    throw new Error('addItemToOrder not yet implemented - needs ProductsService integration')
  }

  /**
   * PATCH /orders/:orderId/items/:itemId/status
   * Update item preparation status
   */
  @Patch(':orderId/items/:itemId/status')
  async updateItemStatus(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() body: { preparationStatus: string },
  ): Promise<OrderItemDto> {
    return this.ordersService.updateItemPreparationStatus(
      req.user.tenantId,
      orderId,
      itemId,
      body.preparationStatus,
    )
  }

  /**
   * DELETE /orders/:orderId/items/:itemId
   * Remove item from order
   */
  @Delete(':orderId/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.ordersService.removeItemFromOrder(req.user.tenantId, orderId, itemId)
  }

  /**
   * POST /orders/:orderId/cancel
   * Cancel order
   */
  @Post(':orderId/cancel')
  async cancelOrder(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Body() body?: { reason?: string },
  ): Promise<OrderDto> {
    return this.ordersService.cancelOrder(req.user.tenantId, orderId, body?.reason)
  }
}
