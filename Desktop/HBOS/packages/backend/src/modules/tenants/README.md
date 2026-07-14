# Tenants Module

The Tenants module handles multi-tenant operations for HBOS, including tenant management, subscription handling, and feature control.

## Overview

This module implements the core multi-tenancy architecture:
- **Row-Level Security (RLS)** - Database-level tenant isolation
- **Subscription Management** - Handle tenant tiers and expirations
- **Feature Flags** - Control features per tenant tier
- **Soft Deletes** - Archive tenants without losing data

## Architecture

### Entities

**Tenant**
- `id` - Unique identifier
- `name` - Organization name (e.g., "Browns Digital Consult")
- `slug` - URL-friendly identifier (e.g., "browns-digital")
- `status` - 'active', 'suspended', or 'deleted'
- `tier` - Subscription tier: 'starter', 'professional', 'enterprise'
- `subscriptionEndsAt` - When the subscription expires
- `features` - JSON object of enabled features per tier
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

### Services

**TenantsService**

Core methods:
- `create(dto)` - Create new tenant with default features
- `findById(id)` - Get tenant by ID
- `findBySlug(slug)` - Get tenant by slug (public endpoint)
- `findAll(skip, take)` - List active tenants (paginated)
- `update(id, dto)` - Update tenant details
- `softDelete(id)` - Archive tenant (soft delete)
- `restore(id)` - Restore deleted tenant

Subscription methods:
- `findByIdWithSubscription(id)` - Get tenant with subscription status
- `renewSubscription(id, daysToAdd)` - Extend subscription
- `isSubscriptionActive(tenantId)` - Check if subscription is valid

Feature methods:
- `hasFeature(tenantId, featureName)` - Check if feature is enabled
- `enableFeature(id, featureName)` - Turn on a feature
- `disableFeature(id, featureName)` - Turn off a feature

## API Endpoints

### Create Tenant
```http
POST /tenants
Content-Type: application/json

{
  "name": "Browns Digital Consult",
  "slug": "browns-digital",
  "tier": "professional"
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Browns Digital Consult",
  "slug": "browns-digital",
  "status": "active",
  "tier": "professional",
  "features": {
    "pos": true,
    "inventory": true,
    "crm": true,
    "reporting": true
  },
  "subscriptionEndsAt": "2027-07-14T00:00:00Z",
  "createdAt": "2026-07-14T00:00:00Z",
  "updatedAt": "2026-07-14T00:00:00Z"
}
```

### Get Tenant by ID
```http
GET /tenants/:id
Authorization: Bearer <jwt_token>

Response: TenantDto
```

### Get Tenant by Slug (Public)
```http
GET /tenants/slug/:slug

Response: TenantDto
```

### Get Tenant with Subscription Info
```http
GET /tenants/:id/subscription
Authorization: Bearer <jwt_token>

Response:
{
  ...TenantDto,
  "isSubscriptionActive": true,
  "daysUntilExpiration": 365
}
```

### Update Tenant
```http
PATCH /tenants/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "tier": "enterprise",
  "status": "active"
}

Response: TenantDto
```

### Renew Subscription
```http
POST /tenants/:id/renew-subscription
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "daysToAdd": 365
}

Response: TenantWithSubscriptionDto
```

### Enable Feature
```http
POST /tenants/:id/features/:featureName/enable
Authorization: Bearer <jwt_token>

Response: TenantDto (with updated features)
```

### Disable Feature
```http
POST /tenants/:id/features/:featureName/disable
Authorization: Bearer <jwt_token>

Response: TenantDto (with updated features)
```

### Soft Delete Tenant
```http
DELETE /tenants/:id
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

### Restore Deleted Tenant
```http
POST /tenants/:id/restore
Authorization: Bearer <jwt_token>

Response: TenantDto
```

### List All Tenants
```http
GET /tenants?skip=0&take=20
Authorization: Bearer <jwt_token>

Response:
{
  "data": [TenantDto, ...],
  "total": 42
}
```

## Feature Matrix by Tier

### Starter
- ✅ POS
- ✅ Inventory
- ✅ Orders
- ✅ Customers
- ❌ Reporting
- ❌ CRM
- ❌ Advanced Inventory
- ❌ Multi-location

### Professional
- ✅ POS
- ✅ Inventory
- ✅ Orders
- ✅ Customers
- ✅ Reporting
- ✅ CRM
- ✅ Advanced Inventory
- ❌ Multi-location

### Enterprise
- ✅ All features enabled
- ✅ Multi-location support
- ✅ API access
- ✅ Webhooks

## Integration with Other Modules

### With Auth Module
When a user registers:
1. AuthService creates a new User with `tenantId`
2. Tenants module creates the Tenant
3. User is now scoped to that tenant

### With Other Modules
All modules should:
1. Accept `tenantId` from JWT payload
2. Filter queries by `tenantId`
3. Use RLS policies for database-level security
4. Check feature flags before allowing operations

### Example Integration
```typescript
// In any service that needs tenant context
constructor(
  private tenantsService: TenantsService,
  @InjectRepository(SomeEntity)
  private repository: Repository<SomeEntity>,
) {}

async getSomeData(tenantId: string, userId: string) {
  // Check if tenant exists and is active
  const tenant = await this.tenantsService.findById(tenantId)
  if (!tenant) throw new NotFoundException()

  // Check if feature is enabled
  const hasFeature = await this.tenantsService.hasFeature(tenantId, 'some_feature')
  if (!hasFeature) throw new ForbiddenException()

  // Query with tenant isolation
  return this.repository.find({
    where: { tenantId, userId }
  })
}
```

## Testing

Run tests:
```bash
npm test -- tenants.service.spec
```

Test coverage:
- ✅ Create tenant with validation
- ✅ Find by ID/slug
- ✅ Update tenant
- ✅ Soft delete/restore
- ✅ Subscription management
- ✅ Feature enable/disable
- ✅ Error handling

## Database Schema

The migration creates:
- `tenants` table with RLS enabled
- Indexes on: slug, status, created_at
- RLS policy for tenant isolation

### SQL Queries

```sql
-- Get tenant with users count
SELECT t.*, COUNT(u.id) as user_count
FROM tenants t
LEFT JOIN users u ON u.tenant_id = t.id
WHERE t.id = $1 AND t.status != 'deleted'
GROUP BY t.id;

-- Get expiring subscriptions
SELECT * FROM tenants
WHERE status = 'active'
  AND subscription_ends_at IS NOT NULL
  AND subscription_ends_at < NOW() + INTERVAL '7 days'
ORDER BY subscription_ends_at ASC;

-- List active features per tenant
SELECT id, slug, features
FROM tenants
WHERE status = 'active'
ORDER BY created_at DESC;
```

## Next Steps

1. **Implement RLS Context Middleware** - Set session variable in requests
2. **Add Tenant Seeding** - Create demo tenant on database init
3. **Add Audit Logging** - Track tenant modifications
4. **Implement Billing Integration** - Connect to Stripe/payment service
5. **Add Tenant Settings** - Logo, branding, etc.

## Related Documentation

- [Database Schema](../../docs/03-database/01-schema.md)
- [Architecture Overview](../../docs/01-architecture/01-overview.md)
- [Auth Module](../auth/README.md)
