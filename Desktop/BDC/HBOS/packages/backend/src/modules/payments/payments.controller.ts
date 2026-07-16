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
import { PaymentService } from './services/payment.service'
import { ProcessPaymentDto } from './dto/process-payment.dto'
import { RefundPaymentDto } from './dto/refund-payment.dto'
import { PaymentDto, PaymentIntentDto } from './dto/payment.dto'

/**
 * Payments Controller
 * Handles payment processing endpoints
 */
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentService: PaymentService) {}

  /**
   * POST /payments/intent
   * Create a payment intent for card payment (Stripe)
   */
  @Post('intent')
  @HttpCode(HttpStatus.CREATED)
  async createPaymentIntent(
    @Request() req: any,
    @Body() body: { orderId: string; amount: number },
  ): Promise<PaymentIntentDto> {
    return this.paymentService.createPaymentIntent(req.user.tenantId, body.orderId, body.amount)
  }

  /**
   * POST /payments/process
   * Process a payment (card, cash, mobile, etc.)
   */
  @Post('process')
  @HttpCode(HttpStatus.CREATED)
  async processPayment(
    @Request() req: any,
    @Body() processPaymentDto: ProcessPaymentDto,
  ): Promise<PaymentDto> {
    return this.paymentService.processPayment(req.user.tenantId, processPaymentDto)
  }

  /**
   * POST /payments/:paymentId/confirm
   * Confirm payment (after 3D Secure or async verification)
   */
  @Post(':paymentId/confirm')
  async confirmPayment(@Request() req: any, @Param('paymentId') paymentId: string): Promise<PaymentDto> {
    return this.paymentService.confirmPayment(req.user.tenantId, paymentId)
  }

  /**
   * GET /payments
   * List payments with optional filtering
   */
  @Get()
  async listPayments(
    @Request() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: PaymentDto[]; total: number }> {
    const options: any = {
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 50,
    }

    if (status) options.status = status
    if (paymentMethod) options.paymentMethod = paymentMethod
    if (startDate) options.startDate = new Date(startDate)
    if (endDate) options.endDate = new Date(endDate)

    return this.paymentService.listPayments(req.user.tenantId, options)
  }

  /**
   * GET /payments/:paymentId
   * Get payment details
   */
  @Get(':paymentId')
  async getPayment(@Request() req: any, @Param('paymentId') paymentId: string): Promise<PaymentDto> {
    return this.paymentService.getPaymentById(req.user.tenantId, paymentId)
  }

  /**
   * GET /payments/transaction/:transactionId
   * Get payment by transaction ID
   */
  @Get('transaction/:transactionId')
  async getPaymentByTransaction(
    @Request() req: any,
    @Param('transactionId') transactionId: string,
  ): Promise<PaymentDto> {
    return this.paymentService.getPaymentByTransactionId(req.user.tenantId, transactionId)
  }

  /**
   * GET /payments/order/:orderId
   * Get all payments for an order
   */
  @Get('order/:orderId')
  async getOrderPayments(@Request() req: any, @Param('orderId') orderId: string): Promise<PaymentDto[]> {
    return this.paymentService.getOrderPayments(req.user.tenantId, orderId)
  }

  /**
   * POST /payments/:paymentId/refund
   * Refund a payment
   */
  @Post(':paymentId/refund')
  async refundPayment(
    @Request() req: any,
    @Param('paymentId') paymentId: string,
    @Body() refundPaymentDto: RefundPaymentDto,
  ): Promise<PaymentDto> {
    return this.paymentService.refundPayment(req.user.tenantId, paymentId, refundPaymentDto)
  }
}
