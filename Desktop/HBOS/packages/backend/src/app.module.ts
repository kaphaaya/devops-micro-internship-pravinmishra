import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './database/typeorm.config'
import { AuthModule } from './modules/auth'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // Feature modules
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
