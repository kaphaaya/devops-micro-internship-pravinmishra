# What To Build Next - Quick Reference

**Current Status**: Auth Module Complete ✅
**Ready to Start**: Tenants Module

---

## 🎯 Next 5 Modules (In Order)

### 1️⃣ Tenants Module (BLOCKER - Start Immediately)
**Files to Create**: 8
**Estimated Time**: 2 days
**Why**: All other modules depend on tenant context

**Files Needed:**
```
packages/backend/src/modules/tenants/
├── tenants.module.ts
├── tenants.service.ts
├── tenants.controller.ts
├── entities/tenant.entity.ts        # Already in @hbos/core, need DB entity
├── dto/create-tenant.dto.ts
├── dto/update-tenant.dto.ts
├── tenants.service.spec.ts
└── index.ts
```

**API Endpoints (5):**
- `POST /tenants` - Create tenant (self-service signup)
- `GET /tenants/me` - Get current tenant info
- `PATCH /tenants/me` - Update tenant
- `GET /tenants/usage` - Usage analytics
- `GET /tenants/subscription` - Subscription status

**Database:**
- ✅ Tenants table exists (in core schema)
- Create migration if needed

---

### 2️⃣ Roles & Permissions Module (BLOCKER - Start Day 3)
**Files to Create**: 12
**Estimated Time**: 2 days
**Why**: Required for RBAC on all endpoints

**Files Needed:**
```
packages/backend/src/modules/roles/
├── roles.module.ts
├── roles.service.ts
├── roles.controller.ts
├── entities/role.entity.ts
├── entities/permission.entity.ts
├── entities/user-role.entity.ts
├── dto/create-role.dto.ts
├── dto/assign-role.dto.ts
├── guards/permission.guard.ts       # Advanced guard
├── decorators/permission.decorator.ts
├── roles.service.spec.ts
└── index.ts
```

**API Endpoints (7):**
- `POST /roles` - Create role
- `GET /roles` - List roles
- `GET /roles/:id` - Get role details
- `PATCH /roles/:id` - Update role
- `POST /roles/:roleId/permissions/:permissionId` - Add permission to role
- `POST /users/:userId/roles/:roleId` - Assign role to user
- `DELETE /users/:userId/roles/:roleId` - Remove role from user

**Database:**
- Create roles table
- Create permissions table
- Create role_permissions junction table
- Create user_roles junction table
- Create migration

---

### 3️⃣ Products Module (Core Feature - Start Day 5)
**Files to Create**: 11
**Estimated Time**: 3 days
**Why**: Required for Orders and menu management

**Files Needed:**
```
packages/backend/src/modules/products/
├── products.module.ts
├── products.service.ts
├── products.controller.ts
├── entities/product.entity.ts
├── entities/category.entity.ts
├── dto/create-product.dto.ts
├── dto/update-product.dto.ts
├── dto/create-category.dto.ts
├── services/product-search.service.ts
├── products.service.spec.ts
└── index.ts
```

**API Endpoints (12):**
- `POST /products` - Create product
- `GET /products` - List products (with pagination, filtering, search)
- `GET /products/:id` - Get product details
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product (soft delete)
- `POST /categories` - Create category
- `GET /categories` - List categories
- `GET /categories/:id` - Get category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /products/search?q=term` - Search products
- `GET /products/:id/inventory` - Get inventory for product

**Database:**
- Create categories table
- Create products table
- Create migration

---

### 4️⃣ Customers Module (Core Feature - Start Day 8)
**Files to Create**: 9
**Estimated Time**: 2 days
**Why**: Required for Orders

**Files Needed:**
```
packages/backend/src/modules/customers/
├── customers.module.ts
├── customers.service.ts
├── customers.controller.ts
├── entities/customer.entity.ts
├── dto/create-customer.dto.ts
├── dto/update-customer.dto.ts
├── services/customer-metrics.service.ts
├── customers.service.spec.ts
└── index.ts
```

**API Endpoints (8):**
- `POST /customers` - Create customer
- `GET /customers` - List customers (with pagination, search)
- `GET /customers/:id` - Get customer profile
- `PATCH /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer (soft delete)
- `GET /customers/:id/orders` - Get customer order history
- `GET /customers/:id/lifetime-value` - Get LTV metrics
- `GET /customers/search?q=name` - Search customers

**Database:**
- Create customers table
- Add foreign key from orders to customers
- Create migration

---

### 5️⃣ Orders Module (Core Feature - Start Day 11)
**Files to Create**: 12
**Estimated Time**: 4 days
**Why**: Main MVP feature - POS system

**Files Needed:**
```
packages/backend/src/modules/orders/
├── orders.module.ts
├── orders.service.ts
├── orders.controller.ts
├── entities/order.entity.ts
├── entities/order-item.entity.ts
├── dto/create-order.dto.ts
├── dto/create-order-item.dto.ts
├── dto/update-order-status.dto.ts
├── services/order-calculation.service.ts
├── services/order-validation.service.ts
├── orders.service.spec.ts
└── index.ts
```

**API Endpoints (8):**
- `POST /orders` - Create order
- `GET /orders` - List orders (filtering by date, status, customer)
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status
- `POST /orders/:id/items` - Add items to order
- `PATCH /orders/:id/items/:itemId` - Update order item
- `DELETE /orders/:id/items/:itemId` - Remove order item
- `GET /orders/export` - Export orders (CSV/PDF)

**Database:**
- Create orders table
- Create order_items table
- Create migration

---

## 📊 Simplified Build Order

**If you have 1-2 developers:**
```
Week 1-2 (Current):  Auth ✅
Week 2-3:            Tenants + Roles/Permissions
Week 4:              Products
Week 5:              Customers
Week 6:              Orders
Week 7-8:            Frontend development
Week 9-12:           Testing & refinement
```

**If you have 3+ developers (Parallel):**
```
Week 2-3:
├─ Backend: Tenants + Roles/Permissions
└─ Frontend: Start design system components

Week 3-5:
├─ Backend: Products + Customers
└─ Frontend: Auth pages + API client

Week 5-7:
├─ Backend: Orders + Payments
└─ Frontend: Dashboard + CRUD pages

Week 8-12: Integration + Testing
```

---

## ⚡ Quick Start Commands

### Start Tenants Module
```bash
# 1. Create files (use scaffolding command or create manually)
mkdir -p packages/backend/src/modules/tenants/{dto,entities}

# 2. Copy pattern from auth module
# - Use auth service as template
# - Copy entity structure
# - Copy DTO structure
# - Copy controller pattern

# 3. Update app.module.ts to import TenantsModule

# 4. Run tests
pnpm test --scope=@hbos/backend -- tenants

# 5. Commit
git add packages/backend/src/modules/tenants
git commit -m "feat: implement tenants module"
```

---

## 📋 Module Template

All modules follow the same pattern as Auth:

```typescript
// Module structure
Module
├── Service (business logic)
├── Controller (HTTP endpoints)
├── Entities (database models)
├── DTOs (request/response validation)
├── Tests
└── index.ts (exports)

// Standard endpoints for CRUD:
POST   /:resource          # Create
GET    /:resource          # List (with pagination)
GET    /:resource/:id      # Get one
PATCH  /:resource/:id      # Update
DELETE /:resource/:id      # Delete (soft delete)
```

---

## 🔑 Key Patterns to Follow

### 1. Entity Validation
```typescript
// In entity
@Column({ type: 'varchar', length: 255 })
@Index()
email: string
```

### 2. DTO Validation
```typescript
// In DTO
@IsEmail()
@MaxLength(255)
email: string
```

### 3. Service Business Logic
```typescript
// In service
async create(createDto: CreateDto): Promise<Entity> {
  // Validate
  const existing = await this.repository.findOne({ email })
  if (existing) throw new ConflictException()

  // Create
  const entity = this.repository.create(createDto)
  return this.repository.save(entity)
}
```

### 4. Controller Endpoints
```typescript
// In controller
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() createDto: CreateDto, @Tenant() tenantId: UUID) {
  return this.service.create(tenantId, createDto)
}
```

### 5. Testing
```typescript
// In service.spec.ts
describe('Service', () => {
  let service: Service
  let mockRepository: any

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    }
    // Setup module
  })

  it('should create entity', async () => {
    const result = await service.create(dto)
    expect(result).toBeDefined()
  })
})
```

---

## 🚀 To Start Building Right Now

### Option 1: Start Tenants Module
```bash
cd /Users/apple/Desktop/HBOS

# Create structure
mkdir -p packages/backend/src/modules/tenants/{dto,entities}

# Create files (I'll provide these when ready)
# Then commit and push
```

### Option 2: Start Roles & Permissions Module
```bash
# Same structure but for roles module
mkdir -p packages/backend/src/modules/roles/{dto,entities,guards,decorators}
```

### Option 3: Set Up Frontend
```bash
# Create auth pages
mkdir -p packages/frontend/app/\(auth\)/{login,register,mfa}

# Create API client
mkdir -p packages/frontend/lib/api

# Create hooks
mkdir -p packages/frontend/lib/hooks
```

---

## 📞 Next Steps

**Choose one:**

1. **I'll create Tenants Module** - Provide complete implementation
2. **I'll create Roles/Permissions** - Provide complete implementation
3. **I'll create Products Module** - Provide complete implementation
4. **You tell me what you prefer** - I'll build that first

---

**Files Completed**: ~50
**Lines of Code**: ~5,000+
**Modules Completed**: 1 (Auth)
**Modules Remaining**: 7+ for Phase 1

Ready to continue? Let me know which module to build next! 🚀
