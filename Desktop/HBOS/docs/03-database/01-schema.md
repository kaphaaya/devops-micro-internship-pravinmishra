# HBOS Database Schema

## Design Principles

### Multi-Tenancy Strategy
**Approach**: Row-Level Security (RLS) with tenant_id filtering

**Benefits**:
- Query-level isolation (SQL enforces filtering)
- Single database instance (cost efficient)
- Easy onboarding (no schema per tenant)
- Scalable (no overhead per tenant)

**How It Works**:
1. Every table has a `tenant_id` column
2. PostgreSQL RLS policies filter all queries by tenant
3. Application sets session variable: `SET app.current_tenant_id = 'uuid'`
4. All SELECT/UPDATE/DELETE automatically filtered by tenant

---

## Core Entities

### Tenants (Root Organization)

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
  tier VARCHAR(50) DEFAULT 'starter', -- 'starter', 'professional', 'enterprise'
  subscription_ends_at TIMESTAMP,
  features JSONB DEFAULT '{}', -- enabled features per tier
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP, -- soft delete

  UNIQUE(slug)
);

-- Enable Row-Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own tenant
CREATE POLICY tenants_isolation ON tenants
  FOR SELECT
  USING (id = current_setting('app.current_tenant_id')::UUID);
```

**Fields**:
- `id`: Unique identifier
- `name`: Business name (e.g., "Browns Digital Consult")
- `slug`: URL-friendly identifier (e.g., "browns-digital")
- `tier`: Subscription tier (determines features)
- `features`: JSON array of enabled features

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Browns Digital Consult",
  "slug": "browns-digital",
  "tier": "professional",
  "features": ["pos", "inventory", "crm", "reports"]
}
```

---

### Users & Authentication

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255), -- bcrypt hash
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),

  -- Authentication
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'pending'
  last_login_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,

  -- Metadata
  preferred_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP, -- soft delete

  UNIQUE(tenant_id, email),
  CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

**Fields**:
- `email`: Unique email per tenant
- `password_hash`: Bcrypt hash (never plain text)
- `email_verified`: Verification status
- `status`: Active/suspended/pending
- `timezone`: For local time display

---

### Authentication Methods (MFA, OAuth)

```sql
CREATE TABLE authentication_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'password', 'totp', 'sms', 'oauth'
  provider VARCHAR(50), -- 'google', 'microsoft', 'github'

  -- TOTP backup codes (encrypted)
  backup_codes TEXT[],

  -- OAuth data
  provider_user_id VARCHAR(255),
  provider_access_token TEXT, -- encrypted
  provider_refresh_token TEXT, -- encrypted

  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  UNIQUE(tenant_id, user_id, type, provider),
  CONSTRAINT check_oauth_data CHECK (
    CASE
      WHEN type = 'oauth' THEN provider IS NOT NULL AND provider_user_id IS NOT NULL
      ELSE true
    END
  )
);

ALTER TABLE authentication_methods ENABLE ROW LEVEL SECURITY;
```

---

### Roles & Permissions

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- system roles cannot be deleted

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  UNIQUE(tenant_id, name)
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code VARCHAR(100) NOT NULL, -- 'orders:create', 'products:update', etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  resource VARCHAR(50), -- 'orders', 'products', 'inventory'
  action VARCHAR(20), -- 'create', 'read', 'update', 'delete'

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, code)
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, role_id, permission_id)
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  location_id UUID, -- NULL = tenant-wide, UUID = location-specific

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  UNIQUE(tenant_id, user_id, role_id, location_id)
);

-- System roles (inserted on database initialization)
-- - Super Admin: Full access to all features
-- - Admin: Full access to location features
-- - Manager: Can manage staff and view reports
-- - Staff: Can access assigned features
-- - Customer: Limited access to customer portal
```

---

### Locations (Multi-Location Support)

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'restaurant', -- 'restaurant', 'hotel', 'cafe', 'bar'

  -- Address
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),

  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(500),

  -- Settings
  timezone VARCHAR(50) DEFAULT 'UTC',
  currency_code VARCHAR(3) DEFAULT 'USD',
  language_code VARCHAR(10) DEFAULT 'en',

  -- Business Info
  tax_id VARCHAR(50),
  license_number VARCHAR(100),

  status VARCHAR(50) DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  UNIQUE(tenant_id, name)
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
```

---

### Products (Menu Items & Inventory Items)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE, -- NULL = tenant-wide
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, location_id, name)
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE, -- NULL = tenant-wide menu
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Product Info
  sku VARCHAR(100),
  barcode VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),

  -- Pricing
  unit_price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2), -- for reporting
  tax_percentage DECIMAL(5, 2) DEFAULT 0,

  -- Measurement
  unit_of_measure VARCHAR(20) DEFAULT 'piece', -- 'piece', 'kg', 'liter'

  -- Flags
  is_menu_item BOOLEAN DEFAULT true,
  is_inventory_item BOOLEAN DEFAULT false,
  is_taxable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,

  status VARCHAR(50) DEFAULT 'active',

  metadata JSONB DEFAULT '{}', -- allergens, ingredients, etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  UNIQUE(tenant_id, sku)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Full-text search index
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english', name || ' ' || COALESCE(description, ''))
);
```

---

### Orders (POS Transactions)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,

  -- Reference
  order_number VARCHAR(50) NOT NULL,
  reference_number VARCHAR(100), -- for external systems

  -- Customer
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255), -- for walk-in customers
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),

  -- Staff
  created_by_user_id UUID NOT NULL REFERENCES users(id),
  processed_by_user_id UUID REFERENCES users(id),

  -- Amounts
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tip_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,

  -- Payment
  payment_method VARCHAR(50), -- 'cash', 'card', 'mobile', 'check'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'refunded'
  payment_gateway_id VARCHAR(255), -- Stripe transaction ID
  paid_at TIMESTAMP,

  -- Status
  order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'
  order_type VARCHAR(50) DEFAULT 'dine-in', -- 'dine-in', 'takeout', 'delivery'
  table_id UUID, -- for dine-in orders

  -- Metadata
  notes TEXT,
  source VARCHAR(50), -- 'pos', 'online', 'delivery_app'
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, location_id, order_number),
  CONSTRAINT check_amounts CHECK (subtotal >= 0 AND tax_amount >= 0 AND total_amount >= 0)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  tax_percentage DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  line_total DECIMAL(12, 2) NOT NULL,

  notes TEXT,
  metadata JSONB DEFAULT '{}', -- modifications, allergies, etc.

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_quantities CHECK (quantity > 0)
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

---

### Customers & Loyalty

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  email VARCHAR(255),
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Address
  address_line1 VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),

  -- Classification
  customer_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'vip', 'vip_plus', 'inactive'

  -- Metrics
  total_visits INTEGER DEFAULT 0,
  lifetime_value DECIMAL(12, 2) DEFAULT 0,
  average_order_value DECIMAL(10, 2) DEFAULT 0,
  last_visit_at TIMESTAMP,

  -- Communication
  email_opt_in BOOLEAN DEFAULT false,
  sms_opt_in BOOLEAN DEFAULT false,

  -- Preferences
  preferences JSONB DEFAULT '{}', -- dietary restrictions, seating preference, etc.

  status VARCHAR(50) DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  UNIQUE(tenant_id, email),
  UNIQUE(tenant_id, phone)
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Full-text search
CREATE INDEX idx_customers_search ON customers USING gin(
  to_tsvector('english', first_name || ' ' || last_name)
);

CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'points', -- 'points', 'tiered', 'percentage'

  -- Points
  points_per_currency_unit DECIMAL(5, 2) DEFAULT 1, -- 1 point per $1
  points_expiry_days INTEGER,

  status VARCHAR(50) DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  loyalty_program_id UUID NOT NULL REFERENCES loyalty_programs(id),

  current_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, customer_id, loyalty_program_id)
);
```

---

### Inventory Management

```sql
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),

  -- Stock Levels
  quantity_on_hand DECIMAL(12, 4) NOT NULL DEFAULT 0,
  quantity_reserved DECIMAL(12, 4) DEFAULT 0,
  quantity_available DECIMAL(12, 4) GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,

  -- Reordering
  reorder_point DECIMAL(12, 4),
  reorder_quantity DECIMAL(12, 4),

  -- Cost Tracking
  unit_cost DECIMAL(10, 2),
  total_cost DECIMAL(14, 2) GENERATED ALWAYS AS (quantity_on_hand * unit_cost) STORED,

  -- Dates
  last_counted_at TIMESTAMP,
  last_restocked_at TIMESTAMP,
  next_reorder_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, location_id, product_id),
  CONSTRAINT check_quantities CHECK (quantity_on_hand >= 0 AND quantity_reserved >= 0)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE TABLE inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  inventory_id UUID NOT NULL REFERENCES inventory(id),

  quantity_change DECIMAL(12, 4) NOT NULL,
  reason VARCHAR(50), -- 'recount', 'waste', 'damage', 'transfer', 'adjustment'
  reference_id UUID, -- order_id, transfer_id, etc.

  notes TEXT,
  adjusted_by_user_id UUID NOT NULL REFERENCES users(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_adjustment CHECK (quantity_change != 0)
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,

  payment_terms VARCHAR(100),
  tax_id VARCHAR(50),

  status VARCHAR(50) DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, name)
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),

  po_number VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending', 'approved', 'received', 'cancelled'

  total_amount DECIMAL(12, 2),
  tax_amount DECIMAL(10, 2),

  expected_delivery_date DATE,
  received_date DATE,

  notes TEXT,

  created_by_user_id UUID NOT NULL REFERENCES users(id),
  approved_by_user_id UUID REFERENCES users(id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(tenant_id, location_id, po_number)
);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),

  quantity_ordered DECIMAL(12, 4) NOT NULL,
  quantity_received DECIMAL(12, 4) DEFAULT 0,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(12, 2) NOT NULL
);
```

---

### Audit Logging (Compliance)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  entity_type VARCHAR(50) NOT NULL, -- 'order', 'product', 'user', etc.
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'view'

  old_values JSONB,
  new_values JSONB,

  ip_address INET,
  user_agent VARCHAR(500),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_action CHECK (action IN ('create', 'update', 'delete', 'view', 'export'))
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Index for common queries
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
```

---

## Indexes for Performance

```sql
-- Users
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Orders
CREATE INDEX idx_orders_tenant_location ON orders(tenant_id, location_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Products
CREATE INDEX idx_products_tenant_location ON products(tenant_id, location_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);

-- Inventory
CREATE INDEX idx_inventory_tenant_location ON inventory(tenant_id, location_id);
CREATE INDEX idx_inventory_reorder ON inventory(reorder_point, quantity_available);

-- Customers
CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_lifetime_value ON customers(lifetime_value DESC);
```

---

## Migration Strategy

### Database Initialization
1. Create base tables
2. Enable RLS on all tables
3. Create indexes
4. Insert system roles and permissions
5. Create first tenant (demo)

### Version Control
- All SQL changes in timestamped migration files
- Only forward migrations (no rollbacks)
- Test migrations on staging before production

### Example Migration File

```sql
-- 001-initial-schema.sql
BEGIN;

CREATE TABLE tenants (...);
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE TABLE users (...);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ... other tables ...

COMMIT;
```

---

## Data Privacy & Security

### Sensitive Data Handling
- Never log passwords, tokens, or sensitive values
- Encrypt fields at rest: credit cards, SSNs, bank accounts
- Use field-level encryption for PII
- Audit all access to sensitive data

### Backups
- Daily automated backups
- Point-in-time recovery (30 days)
- Encrypted backups stored in separate region
- Test restore procedures monthly

### Data Retention
- Transaction data: 7 years (for accounting)
- Audit logs: 2 years (for compliance)
- Deleted records: 90 days (soft delete window)
- Personal data: Delete on request (GDPR)

---

## Disaster Recovery

### RTO/RPO Targets
- **RTO** (Recovery Time Objective): < 1 hour
- **RPO** (Recovery Point Objective): < 15 minutes

### Recovery Procedures
1. Identify incident scope
2. Activate backup database
3. Restore from point-in-time backup
4. Verify data integrity
5. Notify affected customers

---

## Next Steps

1. Generate database migration files
2. Setup PostgreSQL in development environment
3. Create seed data fixtures
4. Test RLS policies
5. Setup backup procedures

See [Database Operations Guide](./02-migrations.md) for implementation details.
