import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { Payment } from '../entities/payment.entity'
import { ProcessPaymentDto } from '../dto/process-payment.dto'
import { RefundPaymentDto } from '../dto/refund-payment.dto'
import { PaymentDto, PaymentIntentDto } from '../dto/payment.dto'
import { generateUUID } from '@hbos/core'

/**
 * Payment Service
 * Handles payment processing and transaction management
 * Integrated with Stripe for card payments
 */
@Injectable()
export class PaymentService {
  private stripe: any

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {
    // Initialize Stripe if API key is configured
    const stripeKey = this.configService.get('STRIPE_SECRET_KEY')
    if (stripeKey) {
      const Stripe = require('stripe')
      this.stripe = new Stripe(stripeKey)
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    return `TXN-${timestamp}${random}`
  }

  /**
   * Create payment intent for card payment (Stripe)
   */
  async createPaymentIntent(
    tenantId: string,
    orderId: string,
    amount: number,
  ): Promise<PaymentIntentDto> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured')
    }

    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          tenantId,
          orderId,
        },
      })

      return {
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        amount,
        status: intent.status,
      }
    } catch (error) {
      throw new BadRequestException(`Failed to create payment intent: ${error.message}`)
    }
  }

  /**
   * Process payment (for card, cash, mobile, etc.)
   */
  async processPayment(
    tenantId: string,
    processDto: ProcessPaymentDto,
  ): Promise<PaymentDto> {
    const { orderId, amount, paymentMethod, stripePaymentMethodId, cardholderName, notes, metadata } =
      processDto

    // Generate transaction ID
    const transactionId = this.generateTransactionId()

    // Create payment record
    const payment = this.paymentRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      orderId: orderId as any,
      transactionId,
      paymentMethod,
      amount: amount as any,
      status: 'processing',
      cardholderName,
      metadata,
    })

    // For card payments, process with Stripe
    if (paymentMethod === 'card' && stripePaymentMethodId) {
      try {
        const intent = await this.stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          payment_method: stripePaymentMethodId,
          confirm: true,
          metadata: {
            tenantId,
            orderId,
            transactionId,
          },
        })

        payment.stripePaymentIntentId = intent.id
        payment.stripeChargeId = intent.latest_charge as any

        if (intent.status === 'succeeded') {
          payment.status = 'succeeded' as any
          payment.processingFee = Math.round(amount * 0.029 + 0.30) as any // ~2.9% + $0.30
          payment.netAmount = (amount - parseFloat(payment.processingFee.toString())) as any
          payment.processedAt = new Date()
          payment.completedAt = new Date()

          // Extract card details
          if (intent.charges?.data?.[0]?.payment_method_details?.card) {
            const cardDetails = intent.charges.data[0].payment_method_details.card
            payment.cardLast4 = cardDetails.last4
            payment.cardBrand = cardDetails.brand
          }
        } else if (intent.status === 'requires_action') {
          payment.status = 'pending' as any
        } else {
          payment.status = 'failed' as any
          payment.failureReason = intent.last_payment_error?.message || 'Payment processing failed'
        }
      } catch (error) {
        payment.status = 'failed' as any
        payment.failureReason = error.message
      }
    } else if (paymentMethod === 'cash') {
      // Cash payments are immediately succeeded (payment in person)
      payment.status = 'succeeded' as any
      payment.processingFee = 0 as any // No fee for cash
      payment.netAmount = amount as any
      payment.processedAt = new Date()
      payment.completedAt = new Date()
    } else if (paymentMethod === 'mobile') {
      // Mobile payments (Apple Pay, Google Pay via Stripe) are marked for confirmation
      payment.status = 'pending' as any
    } else if (['check', 'bank_transfer'].includes(paymentMethod)) {
      // These require manual verification
      payment.status = 'pending' as any
    }

    const saved = await this.paymentRepository.save(payment)
    return this.mapToDto(saved)
  }

  /**
   * Confirm payment (used after 3D Secure or other async verification)
   */
  async confirmPayment(tenantId: string, paymentId: string): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId as any, tenantId: tenantId as any },
    })

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    if (payment.stripePaymentIntentId) {
      try {
        const intent = await this.stripe.paymentIntents.retrieve(payment.stripePaymentIntentId)

        if (intent.status === 'succeeded') {
          payment.status = 'succeeded' as any
          payment.processedAt = new Date()
          payment.completedAt = new Date()
          payment.processingFee = Math.round(
            parseFloat(payment.amount.toString()) * 0.029 + 0.30,
          ) as any
          payment.netAmount = (
            parseFloat(payment.amount.toString()) - parseFloat(payment.processingFee.toString())
          ) as any
        } else if (intent.status === 'processing') {
          payment.status = 'processing' as any
        } else {
          payment.status = 'failed' as any
          payment.failureReason = intent.last_payment_error?.message || 'Payment failed'
        }
      } catch (error) {
        throw new BadRequestException(`Failed to confirm payment: ${error.message}`)
      }
    }

    return this.mapToDto(await this.paymentRepository.save(payment))
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(tenantId: string, paymentId: string): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId as any, tenantId: tenantId as any },
    })

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    return this.mapToDto(payment)
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(tenantId: string, transactionId: string): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { tenantId: tenantId as any, transactionId },
    })

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    return this.mapToDto(payment)
  }

  /**
   * Get payments for order
   */
  async getOrderPayments(tenantId: string, orderId: string): Promise<PaymentDto[]> {
    const payments = await this.paymentRepository.find({
      where: { tenantId: tenantId as any, orderId: orderId as any, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    })

    return payments.map(p => this.mapToDto(p))
  }

  /**
   * List payments with filtering
   */
  async listPayments(
    tenantId: string,
    options: {
      skip?: number
      take?: number
      status?: string
      paymentMethod?: string
      startDate?: Date
      endDate?: Date
    } = {},
  ): Promise<{ data: PaymentDto[]; total: number }> {
    const { skip = 0, take = 50, status, paymentMethod, startDate, endDate } = options

    const where: any = { tenantId: tenantId as any }

    if (status) {
      where.status = status
    }
    if (paymentMethod) {
      where.paymentMethod = paymentMethod
    }
    if (startDate && endDate) {
      where.createdAt = {
        _gte: startDate,
        _lte: endDate,
      }
    }

    const [payments, total] = await this.paymentRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: payments.map(p => this.mapToDto(p)),
      total,
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(
    tenantId: string,
    paymentId: string,
    refundDto: RefundPaymentDto,
  ): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId as any, tenantId: tenantId as any },
    })

    if (!payment) {
      throw new NotFoundException('Payment not found')
    }

    if (payment.status !== 'succeeded') {
      throw new BadRequestException('Only succeeded payments can be refunded')
    }

    const { amount, reason, metadata } = refundDto
    const refundableAmount =
      parseFloat(payment.amount.toString()) - parseFloat(payment.refundedAmount.toString())

    if (amount > refundableAmount) {
      throw new BadRequestException(`Cannot refund more than ${refundableAmount}`)
    }

    // Process refund via Stripe if it was a card payment
    if (payment.stripeChargeId) {
      try {
        await this.stripe.refunds.create({
          charge: payment.stripeChargeId,
          amount: Math.round(amount * 100),
          metadata: {
            reason: reason || 'Refund',
          },
        })
      } catch (error) {
        throw new BadRequestException(`Failed to process refund: ${error.message}`)
      }
    }

    // Create refund payment record
    const refundPayment = this.paymentRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      orderId: payment.orderId,
      transactionId: `REFUND-${payment.transactionId}`,
      paymentMethod: payment.paymentMethod,
      amount: -amount as any, // Negative for refunds
      status: 'succeeded' as any,
      refundedByPaymentId: payment.id,
      processedAt: new Date(),
      completedAt: new Date(),
      metadata,
    })

    await this.paymentRepository.save(refundPayment)

    // Update original payment
    payment.refundedAmount = (parseFloat(payment.refundedAmount.toString()) + amount) as any
    if (parseFloat(payment.refundedAmount.toString()) >= parseFloat(payment.amount.toString())) {
      payment.status = 'refunded' as any
    }
    payment.refundedAt = new Date()

    await this.paymentRepository.save(payment)
    return this.mapToDto(payment)
  }

  /**
   * Map payment entity to DTO
   */
  private mapToDto(payment: Payment): PaymentDto {
    return {
      id: payment.id,
      tenantId: payment.tenantId,
      locationId: payment.locationId,
      orderId: payment.orderId,
      customerId: payment.customerId,
      transactionId: payment.transactionId,
      paymentMethod: payment.paymentMethod,
      amount: parseFloat(payment.amount.toString()),
      processingFee: parseFloat(payment.processingFee.toString()),
      netAmount: parseFloat(payment.netAmount.toString()),
      status: payment.status,
      cardLast4: payment.cardLast4,
      cardBrand: payment.cardBrand,
      cardholderName: payment.cardholderName,
      failureReason: payment.failureReason,
      receiptUrl: payment.receiptUrl,
      refundedAmount: parseFloat(payment.refundedAmount.toString()),
      refundedAt: payment.refundedAt,
      processedAt: payment.processedAt,
      completedAt: payment.completedAt,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }
}
