import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersController } from './orders.controller'
import { OrdersService } from './services/orders.service'
import { OrderCalculationService } from './services/order-calculation.service'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService, OrderCalculationService],
  exports: [OrdersService, OrderCalculationService],
})
export class OrdersModule {}
