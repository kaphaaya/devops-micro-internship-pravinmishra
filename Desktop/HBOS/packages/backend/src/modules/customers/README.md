# Customers Module

The Customers module manages customer profiles, tracks metrics, and maintains order history for the POS system.

## Overview

This module provides:
- **Customer Profiles** - Store customer contact info and preferences
- **Customer Metrics** - Track visits, lifetime value, average order value
- **Customer Search** - Search by name, email, or phone
- **Customer Tiers** - Regular, VIP, VIP+ based on lifetime value
- **Preferences** - Store dietary restrictions, preferences, etc.

## Architecture

### Entities

**Customer**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `email` - Email address (unique per tenant)
- `phone` - Phone number (unique per tenant)
- `firstName`, `lastName` - Name fields
- `addressLine1`, `city`, `postalCode` - Address
- `customerType` - 'regular', 'vip', 'vip_plus', 'inactive'
- `totalVisits` - Count of orders/visits
- `lifetimeValue` - Total amount spent
- `averageOrderValue` - Average order total
- `lastVisitAt` - Last order date
- `emailOptIn`, `smsOptIn` - Marketing opt-in
- `preferences` - JSON for dietary, seating, etc.
- `status` - 'active' or 'inactive'
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

### Services

**CustomersService**

Customer methods:
- `createCustomer(tenantId, dto)` - Create customer
- `getCustomerById(tenantId, customerId)` - Get by ID
- `getCustomerByEmail(tenantId, email)` - Get by email
- `getCustomerByPhone(tenantId, phone)` - Get by phone
- `listCustomers(tenantId, filters, skip, take)` - List with filters
- `searchCustomers(tenantId, query, limit)` - Search by name/email/phone
- `getCustomersByType(tenantId, type, skip, take)` - Get by customer type
- `updateCustomer(tenantId, customerId, dto)` - Update customer
- `deleteCustomer(tenantId, customerId)` - Soft delete

Metrics methods:
- `updateCustomerMetrics(tenantId, customerId, orderTotal)` - Update after order
- `getCustomerMetrics(tenantId, customerId)` - Get metrics only
- `getTopCustomers(tenantId, limit)` - Top by lifetime value
- `getRecentCustomers(tenantId, limit)` - Recently active

Bulk methods:
- `getCustomersBulk(tenantId, customerIds)` - Bulk fetch

## API Endpoints

### Customer Management

**Create Customer**
```http
POST /customers
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email": "john@example.com",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "addressLine1": "123 Main St",
  "city": "New York",
  "postalCode": "10001",
  "customerType": "regular",
  "emailOptIn": true,
  "smsOptIn": false,
  "preferences": {
    "dietary": "vegetarian",
    "seatingPreference": "window"
  }
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "phone": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "customerType": "regular",
  "totalVisits": 0,
  "lifetimeValue": 0,
  "averageOrderValue": 0,
  "lastVisitAt": null,
  "emailOptIn": true,
  "smsOptIn": false,
  "preferences": {...},
  "status": "active",
  "createdAt": "2026-07-14T00:00:00Z",
  "updatedAt": "2026-07-14T00:00:00Z"
}
```

**List Customers**
```http
GET /customers?customerType=vip&status=active&search=john&skip=0&take=50
Authorization: Bearer <jwt_token>

Response:
{
  "data": [CustomerDto, ...],
  "total": 127
}
```

**Search Customers**
```http
GET /customers/search?q=john&limit=20
Authorization: Bearer <jwt_token>

Response:
[
  {
    "id": "...",
    "email": "john@example.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "customerType": "vip",
    "totalVisits": 12,
    "lifetimeValue": 650
  },
  ...
]
```

**Get Customers by Type**
```http
GET /customers/by-type/vip?skip=0&take=50
Authorization: Bearer <jwt_token>

Response:
{
  "data": [CustomerDto, ...],
  "total": 23
}
```

**Get Top Customers**
```http
GET /customers/top?limit=10
Authorization: Bearer <jwt_token>

Response: [CustomerWithNameDto, ...] (ordered by lifetime value)
```

**Get Recent Customers**
```http
GET /customers/recent?limit=20
Authorization: Bearer <jwt_token>

Response: [CustomerWithNameDto, ...] (ordered by last visit)
```

**Get Customer**
```http
GET /customers/:customerId
Authorization: Bearer <jwt_token>

Response: CustomerDto
```

**Get Customer by Email**
```http
GET /customers/email/:email
Authorization: Bearer <jwt_token>

Response: CustomerDto
```

**Get Customer by Phone**
```http
GET /customers/phone/:phone
Authorization: Bearer <jwt_token>

Response: CustomerDto
```

**Update Customer**
```http
PATCH /customers/:customerId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "customerType": "vip",
  "emailOptIn": true,
  "preferences": {
    "dietary": "vegan"
  }
}

Response: CustomerDto
```

**Delete Customer**
```http
DELETE /customers/:customerId
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

### Customer Metrics

**Get Customer Metrics**
```http
GET /customers/:customerId/metrics
Authorization: Bearer <jwt_token>

Response:
{
  "totalVisits": 12,
  "lifetimeValue": 650.50,
  "averageOrderValue": 54.21,
  "lastVisitAt": "2026-07-14T15:30:00Z"
}
```

**Record Visit (Called from Orders)**
```http
POST /customers/:customerId/record-visit
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderTotal": 75.50
}

Response: CustomerMetricsDto
```

### Bulk Operations

**Bulk Get Customers**
```http
POST /customers/bulk
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "customerIds": ["id-1", "id-2", "id-3"]
}

Response: [CustomerDto, ...]
```

## Customer Types

Automatically promoted based on lifetime value:

- **Regular** - New customers, < $500 lifetime
- **VIP** - $500 - $999 lifetime value
- **VIP+** - $1,000+ lifetime value
- **Inactive** - Manually marked inactive

## Filtering

```http
GET /customers?customerType=vip&status=active&search=john

Available filters:
- customerType: 'regular', 'vip', 'vip_plus', 'inactive'
- status: 'active', 'inactive' (default: 'active')
- search: Free-text search by name, email, phone
```

## Preferences Schema

Store arbitrary customer preferences as JSON:

```json
{
  "dietary": "vegetarian",  // dietary restrictions
  "seatingPreference": "window",  // seating preference
  "allergies": ["peanuts", "shellfish"],
  "favoriteTable": "5",
  "specialOccasion": "birthday",
  "notes": "Always orders water with lemon",
  "customAttribute": "value"
}
```

## Integration with Orders Module

When processing an order:

1. **Find or create customer:**
   ```typescript
   const customer = await customersService.getCustomerByEmail(tenantId, email)
   ```

2. **Record the visit and update metrics:**
   ```typescript
   await customersService.updateCustomerMetrics(tenantId, customerId, orderTotal)
   ```

3. **Auto-promotion:**
   - Customer type automatically updates if lifetime value threshold reached
   - Regular → VIP at $500
   - VIP → VIP+ at $1,000

## Database Schema

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  email VARCHAR(255),
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  customer_type VARCHAR(50),
  total_visits INTEGER DEFAULT 0,
  lifetime_value DECIMAL(12,2),
  average_order_value DECIMAL(10,2),
  last_visit_at TIMESTAMP,
  email_opt_in BOOLEAN,
  sms_opt_in BOOLEAN,
  preferences JSONB,
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE (tenant_id, email),
  UNIQUE (tenant_id, phone)
)

-- Indexes for performance
CREATE INDEX idx_customers_lifetime_value ON customers (tenant_id, lifetime_value DESC)
CREATE INDEX idx_customers_last_visit ON customers (tenant_id, last_visit_at DESC)
CREATE INDEX idx_customers_search ON customers USING gin(...)
```

## Testing

Run tests:
```bash
npm test -- customers.service.spec
```

Test coverage:
- ✅ Create customer (with validation)
- ✅ Get by ID/email/phone
- ✅ List with filtering
- ✅ Search by name/email/phone
- ✅ Update customer
- ✅ Delete (soft delete)
- ✅ Update metrics & auto-promotion
- ✅ Get top/recent customers
- ✅ Bulk fetch
- ✅ Error handling (conflicts, not found)

## Permission Requirements

All endpoints require authentication and tenant membership.

**Future (Phase 2)**:
- `customers:create` - Create customers
- `customers:read` - View customers
- `customers:update` - Edit customers
- `customers:delete` - Delete customers
- `customers:export` - Export customer data

## Analytics Queries (for Reports)

```sql
-- Total customers
SELECT COUNT(*) FROM customers WHERE tenant_id = $1 AND status = 'active'

-- Customers by type
SELECT customer_type, COUNT(*) as count
FROM customers
WHERE tenant_id = $1 AND status = 'active'
GROUP BY customer_type

-- Total lifetime value
SELECT SUM(lifetime_value) as total_revenue
FROM customers
WHERE tenant_id = $1 AND status = 'active'

-- Average customer value
SELECT AVG(lifetime_value) as avg_value
FROM customers
WHERE tenant_id = $1 AND status = 'active'

-- Most valuable customers
SELECT id, email, lifetime_value, total_visits
FROM customers
WHERE tenant_id = $1 AND status = 'active'
ORDER BY lifetime_value DESC
LIMIT 10

-- New customers (last 30 days)
SELECT COUNT(*) FROM customers
WHERE tenant_id = $1
  AND status = 'active'
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
```

## Next Steps

1. **Loyalty Programs** - Track points, redemptions
2. **Customer Segments** - Create customer groups for campaigns
3. **Communication** - Send emails/SMS to opted-in customers
4. **Customer Notes** - Track internal notes per customer
5. **Customer Documents** - Store signed agreements, etc.

## Related Documentation

- [Database Schema](../../docs/03-database/01-schema.md)
- [Orders Module](../orders/README.md)
- [Roles Module](../roles/README.md)
