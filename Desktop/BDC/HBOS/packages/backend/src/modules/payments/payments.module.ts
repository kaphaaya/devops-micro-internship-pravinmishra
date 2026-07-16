import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { PaymentsController } from './payments.controller'
import { PaymentService } from './services/payment.service'
import { Payment } from './entities/payment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}
