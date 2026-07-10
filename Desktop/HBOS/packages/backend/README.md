# @hbos/backend

HBOS Backend - NestJS API Server for hospitality management.

## Features

- NestJS 10 - Progressive Node.js framework
- TypeScript - Type-safe backend
- PostgreSQL - Robust relational database
- TypeORM - ORM for database operations
- JWT Authentication - Secure API access
- Swagger API Documentation - Interactive API docs
- Bull Job Queue - Background jobs
- Redis Caching - Performance optimization
- Docker Support - Container deployment

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root application module
├── modules/                   # Feature modules
│   ├── auth/                 # Authentication module
│   ├── users/                # User management
│   ├── tenants/              # Tenant management
│   ├── orders/               # Order management
│   ├── products/             # Product management
│   ├── inventory/            # Inventory management
│   └── ...
├── common/                    # Shared utilities
│   ├── decorators/           # Custom decorators
│   ├── guards/               # Auth guards
│   ├── filters/              # Exception filters
│   ├── interceptors/         # Request/response interceptors
│   ├── middleware/           # Middleware
│   ├── pipes/                # Validation pipes
│   ├── services/             # Common services
│   └── exceptions/           # Custom exceptions
├── database/
│   ├── typeorm.config.ts     # TypeORM configuration
│   ├── entities/             # Database entities
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Database seeding
│   └── subscribers/          # Entity subscribers
└── config/                    # Application config

dist/                         # Compiled output
```

## Setup

```bash
pnpm install

# Setup database (from root)
docker-compose up -d
pnpm db:migrate
pnpm db:seed

# Start dev server
pnpm dev
```

Server runs on http://localhost:3001
API Docs: http://localhost:3001/api/docs

## Environment Variables

See `.env.example` in root:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `REDIS_HOST`, `REDIS_PORT`
- `JWT_SECRET`, `JWT_EXPIRY`
- `API_PORT`, `API_HOST`
- `CORS_ORIGIN`

## Building

```bash
pnpm build
pnpm start
```

## Testing

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Coverage report
pnpm test:e2e       # End-to-end tests
```

## Database

```bash
# Run pending migrations
pnpm db:migrate

# Create a new migration
pnpm db:migrate:create src/database/migrations/migration_name

# Rollback last migration
pnpm db:rollback

# Seed database
pnpm db:seed
```

## API Documentation

Swagger UI: http://localhost:3001/api/docs

## Modules

### Auth Module
- User registration
- Login with JWT
- Multi-factor authentication
- Password reset
- Token refresh

### Users Module
- User profile management
- Role assignment
- Permission management

### Tenants Module
- Tenant creation and management
- Subscription management
- Usage tracking

### Orders Module
- Order creation and management
- Order item tracking
- Payment processing
- Order status tracking

### Products Module
- Product catalog
- Product categories
- Menu management
- Pricing

### Inventory Module
- Stock level tracking
- Inventory adjustments
- Purchase orders
- Supplier management

## Architecture

- **Modular Design**: Feature-based module organization
- **Middleware**: Tenant context, logging, error handling
- **Guards**: JWT authentication, role-based access
- **Decorators**: Custom decorators for tenant/user context
- **Interceptors**: Request logging, response transformation
- **Pipes**: Input validation and transformation
- **Filters**: Global exception handling

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Row-level security (RLS) via database
- Input validation and sanitization
- SQL injection prevention via ORM
- CORS configuration
- Helmet security headers

## Performance

- Query optimization
- Database indexing
- Redis caching
- Connection pooling
- Pagination support
- Request rate limiting

## Contributing

Follow the [CONTRIBUTING.md](../../CONTRIBUTING.md) guide.

## Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cache**: Redis
- **Jobs**: Bull
- **Auth**: JWT + Passport
- **Testing**: Vitest
- **API Docs**: Swagger/OpenAPI
