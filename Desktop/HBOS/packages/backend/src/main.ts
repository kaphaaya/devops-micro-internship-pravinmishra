import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security
  app.use(helmet())

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('HBOS API')
    .setDescription('Hospitality Business Operating System API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('tenants', 'Tenant management')
    .addTag('orders', 'Order management')
    .addTag('products', 'Product management')
    .addTag('inventory', 'Inventory management')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = parseInt(process.env.API_PORT || '3001', 10)
  const host = process.env.API_HOST || 'localhost'

  await app.listen(port, host, () => {
    console.log(`[HBOS] API Server running on http://${host}:${port}`)
    console.log(`[HBOS] Swagger API Docs: http://${host}:${port}/api/docs`)
    console.log(`[HBOS] Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

bootstrap().catch((error) => {
  console.error('[HBOS] Failed to start server:', error)
  process.exit(1)
})
