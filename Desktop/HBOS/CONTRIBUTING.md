# Contributing to HBOS

Welcome! This guide will help you get started developing on HBOS.

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: v8.0.0 or higher (package manager)
- **PostgreSQL**: v15 or higher
- **Docker**: For local development services
- **Git**: For version control

## Setup Development Environment

### 1. Clone Repository

```bash
git clone https://github.com/hospitality/hbos.git
cd HBOS
```

### 2. Install Dependencies

```bash
# Install root and all workspace dependencies
pnpm install

# Verify installation
pnpm --version  # Should be v8.0.0+
node --version  # Should be v20.0.0+
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values (for development, defaults work fine)
# Database defaults to: hbos:hbos_dev_password@localhost:5432/hbos_development
```

### 4. Start Local Services

```bash
# Start PostgreSQL, Redis, Nginx in Docker
docker-compose up -d

# Optional: Include dev tools (Adminer, Redis Commander)
docker-compose up -d --profile dev

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f postgres  # PostgreSQL logs
docker-compose logs -f redis     # Redis logs
```

### 5. Database Setup

```bash
# Run migrations to create tables
pnpm db:migrate

# Seed demo data (users, products, orders)
pnpm db:seed

# Generate ORM types (Prisma/TypeORM)
pnpm db:generate
```

### 6. Start Development Servers

```bash
# Start all development servers (frontend + backend)
pnpm dev

# Or start individually:
# Terminal 1: Frontend (Next.js)
cd packages/frontend && pnpm dev

# Terminal 2: Backend (NestJS)
cd packages/backend && pnpm dev
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Storybook**: http://localhost:6006
- **Adminer** (DB UI): http://localhost:8080
- **Redis Commander**: http://localhost:8081

### Demo Credentials

After seeding, login with:
- **Email**: admin@hbos.io
- **Password**: admin_password_123
- **Tenant**: demo-tenant

## Project Structure

```
/HBOS/
├── packages/
│   ├── core/              # Shared types, utilities, constants
│   ├── frontend/          # Next.js 14 web application
│   ├── backend/           # NestJS 10 API server
│   ├── design-system/     # Component library + Storybook
│   └── mobile/            # React Native (Phase 4)
├── docs/                  # Complete documentation
├── docker-compose.yml     # Local development services
└── docker/                # Docker configurations
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for fixes:
git checkout -b fix/bug-description
```

**Branch naming conventions**:
- `feature/module-name-feature-description` – New features
- `fix/module-name-bug-description` – Bug fixes
- `refactor/module-name-change-description` – Refactoring
- `docs/section-topic` – Documentation updates
- `chore/task-description` – Maintenance tasks

### 2. Make Changes

#### Code Style

- **Language**: TypeScript (strict mode)
- **Formatting**: Prettier (auto-format on save)
- **Linting**: ESLint (strict rules)

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint code
pnpm lint

# Fix lint errors
pnpm lint:fix
```

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Test additions/changes
- `chore`: Maintenance
- `perf`: Performance improvement
- `ci`: CI/CD changes

**Examples**:
```bash
git commit -m "feat(orders): add split bill functionality"
git commit -m "fix(inventory): correct stock calculation"
git commit -m "docs(api): add authentication examples"
```

### 3. Testing

#### Run Tests

```bash
# Run all tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Coverage report
pnpm test:coverage

# Test specific package
pnpm test --scope=@hbos/backend
```

#### Write Tests

**Frontend** (React components):
```typescript
// packages/frontend/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

**Backend** (NestJS services):
```typescript
// packages/backend/src/modules/orders/orders.service.spec.ts
import { Test } from '@nestjs/testing'
import { OrdersService } from './orders.service'

describe('OrdersService', () => {
  let service: OrdersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile()
    service = module.get<OrdersService>(OrdersService)
  })

  it('should create an order', async () => {
    const result = await service.create({ ... })
    expect(result).toHaveProperty('id')
  })
})
```

### 4. Type Safety

```bash
# Check types across all packages
pnpm type-check

# Generate types from database
pnpm db:generate
```

### 5. Database Changes

For schema changes:

```bash
# Create migration
pnpm db:create-migration create_table_name

# Run migrations
pnpm db:migrate

# Rollback (development only)
pnpm db:rollback
```

### 6. Build & Test Before Push

```bash
# Type check
pnpm type-check

# Lint
pnpm lint:fix

# Test
pnpm test

# Build all packages
pnpm build
```

### 7. Push & Create Pull Request

```bash
# Push to your branch
git push origin feature/your-feature-name

# Create PR on GitHub
# - Link relevant issues
# - Write clear description
# - Add screenshots if UI changes
# - Request reviewers
```

## Pull Request Guidelines

### PR Title

Keep it clear and descriptive (under 70 chars):
- `feat: add order split billing feature`
- `fix: correct inventory quantity calculation`
- `docs: update API authentication guide`

### PR Description

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] Manual testing done

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guide
- [ ] Types are correct
- [ ] Tests pass locally
- [ ] Database migrations complete
- [ ] Documentation updated
```

### Review Process

1. Automated checks run (linting, types, tests)
2. Code review by 1-2 team members
3. Approval and merge to main
4. Deployment to staging/production

## Common Tasks

### Add a New Component

```bash
# 1. Create component in design-system
touch packages/design-system/src/components/primitives/YourComponent/YourComponent.tsx

# 2. Create Storybook story
touch packages/design-system/src/components/primitives/YourComponent/YourComponent.stories.tsx

# 3. Create tests
touch packages/design-system/src/components/primitives/YourComponent/YourComponent.test.tsx

# 4. Export from index
# Add to packages/design-system/src/index.ts
```

### Add a Backend Module

```bash
# 1. Generate module scaffolding
cd packages/backend
nest generate module src/modules/your-module

# 2. Generate service
nest generate service src/modules/your-module

# 3. Generate controller
nest generate controller src/modules/your-module

# 4. Add database entities and migrations
# See docs/08-backend/01-setup.md for patterns

# 5. Add tests for service
```

### Add an API Endpoint

```typescript
// packages/backend/src/modules/orders/orders.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll()
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id)
  }
}
```

### Add a Frontend Page

```bash
# 1. Create page directory
mkdir -p packages/frontend/app/(dashboard)/orders/new

# 2. Create page component
cat > packages/frontend/app/(dashboard)/orders/new/page.tsx << 'EOF'
'use client'

export default function CreateOrderPage() {
  return (
    <div>
      <h1>Create Order</h1>
      {/* Your component */}
    </div>
  )
}
EOF
```

## Debugging

### Frontend Debugging

```bash
# VS Code: Use debugger
# In launch.json:
{
  "type": "chrome",
  "request": "attach",
  "name": "Attach Chrome",
  "port": 9222,
  "pathMapping": {
    "/": "${workspaceRoot}/packages/frontend",
    "/_next": "${workspaceRoot}/packages/frontend/.next"
  }
}

# Browser DevTools
# Open Chrome DevTools (F12)
# Sources tab to set breakpoints
```

### Backend Debugging

```bash
# NestJS debug mode
NODE_DEBUG=* npm run dev:backend

# VS Code Debugger (launch.json)
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "program": "${workspaceRoot}/packages/backend/node_modules/@nestjs/cli/bin/nest.js",
  "args": ["start", "--debug"],
  "cwd": "${workspaceRoot}/packages/backend"
}
```

### Database Debugging

```bash
# Connect directly
docker-compose exec postgres psql -U hbos -d hbos_development

# View queries in logs
docker-compose logs -f postgres | grep -E "ERROR|QUERY"

# Redis commands
docker-compose exec redis redis-cli
> KEYS *         # List all keys
> GET key_name   # Get value
> FLUSHDB        # Clear database
```

## Performance Optimization

### Frontend

```bash
# Analyze bundle size
pnpm run analyze --scope=@hbos/frontend

# Lighthouse audit
# http://localhost:3000 -> Chrome DevTools -> Lighthouse
```

### Backend

```bash
# Profile endpoints
# Use NestJS logger with performance metrics

# Database query analysis
EXPLAIN ANALYZE SELECT * FROM orders WHERE tenant_id = 'uuid'
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :3001
lsof -i :5432
lsof -i :6379

# Kill process
kill -9 <PID>

# Or change port in .env.local
PORT=3002
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Redis Connection Failed

```bash
# Check if Redis is running
docker-compose ps redis

# Test connection
redis-cli -p 6379 ping

# Should return: PONG
```

### Migration Errors

```bash
# Rollback last migration (dev only)
pnpm db:rollback

# Reset entire database (dev only)
docker-compose exec postgres psql -U hbos -d hbos_development -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
pnpm db:migrate
pnpm db:seed
```

## Documentation

When adding features, update documentation:

- **API Changes**: Update `docs/02-api/` with new endpoints
- **Database Changes**: Update `docs/03-database/` with schema changes
- **Architecture Changes**: Add ADR (Architecture Decision Record) in docs
- **Setup Changes**: Update README.md and CONTRIBUTING.md

## Code Review Checklist

Before requesting review, verify:

- [ ] Code follows style guide (`pnpm format`, `pnpm lint:fix`)
- [ ] All types are correct (`pnpm type-check`)
- [ ] Tests pass (`pnpm test`)
- [ ] Builds without errors (`pnpm build`)
- [ ] Database migrations are included (if applicable)
- [ ] Documentation is updated
- [ ] No secrets in code (check `.env.example`)
- [ ] Commit messages are clear and descriptive

## Getting Help

- **Documentation**: See `/docs/` directory
- **Issues**: Check GitHub issues for similar problems
- **Slack/Discord**: Ask team members
- **Code Comments**: Add comments for complex logic
- **Pair Programming**: Schedule with a teammate

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Happy coding! 🚀
