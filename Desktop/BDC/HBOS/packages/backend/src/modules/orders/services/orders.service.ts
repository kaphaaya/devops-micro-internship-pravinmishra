import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, In, IsNull } from 'typeorm'
import { Order } from '../entities/order.entity'
import { OrderItem } from '../entities/order-item.entity'
import { CreateOrderDto } from '../dto/create-order.dto'
import { CreateOrderItemDto } from '../dto/create-order-item.dto'
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto'
import { OrderDto, OrderItemDto } from '../dto/order.dto'
import { OrderCalculationService } from './order-calculation.service'
import { generateUUID } from '@hbos/core'

/**
 * Orders Service
 * Handles order management and lifecycle
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private calculationService: OrderCalculationService,
  ) {}

  /**
   * Generate unique order number
   */
  private generateOrderNumber(tenantId: string): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    return `ORD-${timestamp}${random}`
  }

  /**
   * Create a new order
   */
  async createOrder(tenantId: string, createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const { orderType, customerId, locationId, tableNumber, notes, items } = createOrderDto

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item')
    }

    const order = this.ordersRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      orderType,
      customerId: customerId as any,
      locationId: locationId as any,
      tableNumber,
      notes,
      orderNumber: this.generateOrderNumber(tenantId),
      status: 'pending',
      paymentStatus: 'unpaid',
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
    })

    const savedOrder = await this.ordersRepository.save(order)

    // Add items and calculate totals
    const orderItems: OrderItem[] = []
    for (const itemDto of items) {
      const item = await this.addItemToOrder(tenantId, savedOrder.id, itemDto, false)
      orderItems.push(item)
    }

    // Recalculate order totals
    await this.recalculateOrderTotals(tenantId, savedOrder.id)

    const updatedOrder = await this.getOrderById(tenantId, savedOrder.id)
    return updatedOrder
  }

  /**
   * Add item to order (internal - no item exists yet)
   */
  private async addItemToOrder(
    tenantId: string,
    orderId: string,
    createItemDto: CreateOrderItemDto,
    shouldRecalculate = true,
  ): Promise<OrderItem> {
    const { productId, quantity, specialInstructions, courseNumber } = createItemDto

    // In a real app, fetch from ProductsService
    // For now, we'll just store the product reference
    // The controller will validate the product exists

    const item = this.orderItemsRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      orderId: orderId as any,
      productId: productId as any,
      productName: '', // Will be populated by controller
      quantity: quantity as any,
      unitPrice: 0 as any, // Will be populated by controller
      specialInstructions,
      courseNumber: courseNumber || 1,
      preparationStatus: 'pending',
    })

    const savedItem = await this.orderItemsRepository.save(item)

    if (shouldRecalculate) {
      await this.recalculateOrderTotals(tenantId, orderId)
    }

    return savedItem
  }

  /**
   * Recalculate order totals based on items
   */
  private async recalculateOrderTotals(tenantId: string, orderId: string): Promise<void> {
    const items = await this.orderItemsRepository.find({
      where: { tenantId: tenantId as any, orderId: orderId as any, deletedAt: IsNull() },
    })

    if (items.length === 0) return

    // Calculate item totals
    let subtotal = 0
    let taxAmount = 0

    for (const item of items) {
      const itemSubtotal = this.calculationService.calculateItemSubtotal(
        parseFloat(item.quantity.toString()),
        parseFloat(item.unitPrice.toString()),
      )
      const itemTax = this.calculationService.calculateItemTax(
        itemSubtotal,
        parseFloat(item.taxPercentage.toString()),
      )

      subtotal += itemSubtotal
      taxAmount += itemTax

      // Update item totals
      item.itemSubtotal = itemSubtotal as any
      item.taxAmount = itemTax as any
      item.itemTotal = this.calculationService.calculateOrderTotal(itemSubtotal, itemTax, 0) as any
      await this.orderItemsRepository.save(item)
    }

    // Update order totals
    const order = await this.ordersRepository.findOne({
      where: { id: orderId as any, tenantId: tenantId as any },
    })

    if (order) {
      order.subtotal = subtotal as any
      order.taxAmount = taxAmount as any
      order.totalAmount = this.calculationService.calculateOrderTotal(subtotal, taxAmount, 0) as any
      await this.ordersRepository.save(order)
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(tenantId: string, orderId: string): Promise<OrderDto> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId as any, tenantId: tenantId as any },
      relations: ['items'],
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    return this.mapOrderToDto(order)
  }

  /**
   * List orders with filtering
   */
  async listOrders(
    tenantId: string,
    options: {
      skip?: number
      take?: number
      status?: string
      paymentStatus?: string
      customerId?: string
      startDate?: Date
      endDate?: Date
    } = {},
  ): Promise<{ data: OrderDto[]; total: number }> {
    const { skip = 0, take = 50, status, paymentStatus, customerId, startDate, endDate } = options

    const where: any = { tenantId: tenantId as any }

    if (status) {
      where.status = status
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }
    if (customerId) {
      where.customerId = customerId as any
    }
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    const [orders, total] = await this.ordersRepository.findAndCount({
      where,
      relations: ['items'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: orders.map(order => this.mapOrderToDto(order)),
      total,
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(tenantId: string, orderId: string, updateDto: UpdateOrderStatusDto): Promise<OrderDto> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId as any, tenantId: tenantId as any },
      relations: ['items'],
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    const { status, internalNotes } = updateDto

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in_preparation', 'cancelled'],
      in_preparation: ['ready', 'cancelled'],
      ready: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    }

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`,
      )
    }

    order.status = status as any
    if (internalNotes) {
      order.internalNotes = internalNotes
    }

    // Set timestamps based on status
    if (status === 'confirmed') {
      order.confirmedAt = new Date()
    } else if (status === 'completed') {
      order.completedAt = new Date()
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date()
    }

    const updated = await this.ordersRepository.save(order)
    return this.mapOrderToDto(updated)
  }

  /**
   * Get items for order
   */
  async getOrderItems(tenantId: string, orderId: string): Promise<OrderItemDto[]> {
    const items = await this.orderItemsRepository.find({
      where: { tenantId: tenantId as any, orderId: orderId as any, deletedAt: IsNull() },
      order: { courseNumber: 'ASC', createdAt: 'ASC' },
    })

    return items.map(item => this.mapOrderItemToDto(item))
  }

  /**
   * Update order item preparation status
   */
  async updateItemPreparationStatus(
    tenantId: string,
    orderId: string,
    itemId: string,
    preparationStatus: string,
  ): Promise<OrderItemDto> {
    const item = await this.orderItemsRepository.findOne({
      where: {
        id: itemId as any,
        tenantId: tenantId as any,
        orderId: orderId as any,
      },
    })

    if (!item) {
      throw new NotFoundException('Order item not found')
    }

    item.preparationStatus = preparationStatus as any

    if (preparationStatus === 'ready') {
      item.readyAt = new Date()
    } else if (preparationStatus === 'served') {
      item.servedAt = new Date()
    }

    const updated = await this.orderItemsRepository.save(item)
    return this.mapOrderItemToDto(updated)
  }

  /**
   * Remove item from order
   */
  async removeItemFromOrder(tenantId: string, orderId: string, itemId: string): Promise<void> {
    const item = await this.orderItemsRepository.findOne({
      where: {
        id: itemId as any,
        tenantId: tenantId as any,
        orderId: orderId as any,
      },
    })

    if (!item) {
      throw new NotFoundException('Order item not found')
    }

    // Soft delete
    await this.orderItemsRepository.softRemove(item)

    // Recalculate order totals
    await this.recalculateOrderTotals(tenantId, orderId)
  }

  /**
   * Cancel order
   */
  async cancelOrder(tenantId: string, orderId: string, reason?: string): Promise<OrderDto> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId as any, tenantId: tenantId as any },
      relations: ['items'],
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (['completed', 'cancelled'].includes(order.status)) {
      throw new BadRequestException(`Cannot cancel order with status: ${order.status}`)
    }

    order.status = 'cancelled' as any
    order.cancelledAt = new Date()
    if (reason) {
      order.internalNotes = reason
    }

    const updated = await this.ordersRepository.save(order)
    return this.mapOrderToDto(updated)
  }

  /**
   * Map entity to DTO
   */
  private mapOrderToDto(order: Order): OrderDto {
    return {
      id: order.id,
      tenantId: order.tenantId,
      locationId: order.locationId,
      customerId: order.customerId,
      orderNumber: order.orderNumber,
      orderType: order.orderType,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: parseFloat(order.subtotal.toString()),
      taxAmount: parseFloat(order.taxAmount.toString()),
      discountAmount: parseFloat(order.discountAmount.toString()),
      totalAmount: parseFloat(order.totalAmount.toString()),
      notes: order.notes,
      internalNotes: order.internalNotes,
      tableNumber: order.tableNumber,
      confirmedAt: order.confirmedAt,
      completedAt: order.completedAt,
      cancelledAt: order.cancelledAt,
      items: order.items?.map(item => this.mapOrderItemToDto(item)),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  /**
   * Map item entity to DTO
   */
  private mapOrderItemToDto(item: OrderItem): OrderItemDto {
    return {
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: parseFloat(item.quantity.toString()),
      unitPrice: parseFloat(item.unitPrice.toString()),
      itemSubtotal: parseFloat(item.itemSubtotal.toString()),
      taxPercentage: parseFloat(item.taxPercentage.toString()),
      taxAmount: parseFloat(item.taxAmount.toString()),
      discountAmount: parseFloat(item.discountAmount.toString()),
      itemTotal: parseFloat(item.itemTotal.toString()),
      specialInstructions: item.specialInstructions,
      preparationStatus: item.preparationStatus,
      courseNumber: item.courseNumber,
      readyAt: item.readyAt,
      servedAt: item.servedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  }
}
