import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './database/typeorm.config'
import { AuthModule } from './modules/auth'
import { TenantsModule } from './modules/tenants'
import { RolesModule } from './modules/roles'
import { ProductsModule } from './modules/products'
import { CustomersModule } from './modules/customers'
import { OrdersModule } from './modules/orders'
import { InventoryModule } from './modules/inventory'
import { PaymentsModule } from './modules/payments'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // Feature modules
    AuthModule,
    TenantsModule,
    RolesModule,
    ProductsModule,
    CustomersModule,
    OrdersModule,
    InventoryModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
