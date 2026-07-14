import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './database/typeorm.config'
import { AuthModule } from './modules/auth'
import { TenantsModule } from './modules/tenants'

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
