# Products Module

The Products module manages menu items and inventory items for the POS and restaurant management system.

## Overview

This module provides:
- **Category Management** - Organize products into categories
- **Product Management** - Create and manage menu items and inventory items
- **Product Search** - Full-text search and filtering
- **Pricing** - Track unit price, cost price, and tax rates
- **Metadata** - Store allergen info, ingredients, preparation time, etc.

## Architecture

### Entities

**Category**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `locationId` - Optional (NULL = tenant-wide, UUID = location-specific)
- `name` - Category name
- `description` - Details
- `imageUrl` - Category image
- `displayOrder` - Sorting priority
- `status` - 'active' or 'inactive'
- `createdAt`, `updatedAt` - Audit fields

**Product**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `locationId` - Optional (NULL = tenant-wide, UUID = location-specific)
- `categoryId` - Reference to Category
- `sku` - Stock Keeping Unit (unique per tenant)
- `barcode` - Barcode for scanning
- `name` - Product name
- `description` - Details
- `imageUrl` - Product image
- `unitPrice` - Selling price
- `costPrice` - Cost for reporting (optional)
- `taxPercentage` - Tax rate
- `unitOfMeasure` - 'piece', 'kg', 'liter', etc.
- `isMenuItem` - Is this a menu item? (default: true)
- `isInventoryItem` - Is this an inventory item? (default: false)
- `isTaxable` - Should tax be applied? (default: true)
- `isActive` - Is product available? (default: true)
- `status` - 'active', 'inactive', 'discontinued'
- `metadata` - JSON for allergens, ingredients, prep time, etc.
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

### Services

**ProductsService**

Category methods:
- `createCategory(tenantId, dto)` - Create category
- `getCategoryById(tenantId, categoryId)` - Get category
- `listCategories(tenantId, locationId, skip, take)` - List categories
- `updateCategory(tenantId, categoryId, dto)` - Update category
- `deleteCategory(tenantId, categoryId)` - Delete (if no products)

Product methods:
- `createProduct(tenantId, dto)` - Create product
- `getProductById(tenantId, productId)` - Get product with category
- `listProducts(tenantId, filters, skip, take)` - List with filtering
- `searchProducts(tenantId, query, limit)` - Search by name/SKU
- `getProductsByCategory(tenantId, categoryId, skip, take)` - Get products in category
- `updateProduct(tenantId, productId, dto)` - Update product
- `deleteProduct(tenantId, productId)` - Soft delete
- `getProductPricing(tenantId, productId)` - Get pricing (for orders)
- `getProductsBulk(tenantId, productIds)` - Bulk fetch (for orders)

## API Endpoints

### Category Management

**Create Category**
```http
POST /products/categories
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Appetizers",
  "description": "Appetizer dishes",
  "imageUrl": "https://example.com/appetizers.jpg",
  "displayOrder": 1,
  "locationId": null  // optional
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Appetizers",
  "description": "Appetizer dishes",
  "imageUrl": "https://example.com/appetizers.jpg",
  "displayOrder": 1,
  "status": "active",
  "createdAt": "2026-07-14T00:00:00Z",
  "updatedAt": "2026-07-14T00:00:00Z"
}
```

**List Categories**
```http
GET /products/categories?locationId=optional&skip=0&take=50
Authorization: Bearer <jwt_token>

Response:
{
  "data": [CategoryDto, ...],
  "total": 12
}
```

**Get Category**
```http
GET /products/categories/:categoryId
Authorization: Bearer <jwt_token>

Response: CategoryDto
```

**Update Category**
```http
PATCH /products/categories/:categoryId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "displayOrder": 2,
  "status": "active"
}

Response: CategoryDto
```

**Delete Category**
```http
DELETE /products/categories/:categoryId
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

### Product Management

**Create Product**
```http
POST /products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Bruschetta",
  "sku": "APP-001",
  "barcode": "1234567890",
  "description": "Toasted bread with tomatoes",
  "imageUrl": "https://example.com/bruschetta.jpg",
  "unitPrice": 8.99,
  "costPrice": 2.50,
  "taxPercentage": 8,
  "unitOfMeasure": "piece",
  "categoryId": "550e8400-e29b-41d4-a716-446655440001",
  "isMenuItem": true,
  "isInventoryItem": false,
  "isTaxable": true,
  "locationId": null,
  "metadata": {
    "allergens": ["gluten"],
    "ingredients": ["bread", "tomatoes", "basil"],
    "prepTime": 5
  }
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Bruschetta",
  "sku": "APP-001",
  "unitPrice": 8.99,
  "costPrice": 2.50,
  "taxPercentage": 8,
  "category": {...},
  "metadata": {...},
  "createdAt": "2026-07-14T00:00:00Z",
  "updatedAt": "2026-07-14T00:00:00Z"
}
```

**List Products**
```http
GET /products?locationId=optional&categoryId=optional&isMenuItem=true&status=active&skip=0&take=50
Authorization: Bearer <jwt_token>

Response:
{
  "data": [ProductDto, ...],
  "total": 127
}
```

**Search Products**
```http
GET /products/search?q=bruschetta&limit=20
Authorization: Bearer <jwt_token>

Response:
[
  {
    "id": "...",
    "name": "Bruschetta",
    "sku": "APP-001",
    "unitPrice": 8.99,
    "categoryId": "...",
    "status": "active"
  },
  ...
]
```

**Get Products by Category**
```http
GET /products/category/:categoryId?skip=0&take=50
Authorization: Bearer <jwt_token>

Response:
{
  "data": [ProductDto, ...],
  "total": 23
}
```

**Get Product**
```http
GET /products/:productId
Authorization: Bearer <jwt_token>

Response: ProductDto (with category)
```

**Update Product**
```http
PATCH /products/:productId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "unitPrice": 9.99,
  "description": "Updated description",
  "metadata": {
    "prepTime": 10  // merge with existing
  }
}

Response: ProductDto
```

**Delete Product**
```http
DELETE /products/:productId
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

### Pricing (Internal APIs for Orders)

**Get Product Pricing**
```http
GET /products/:productId/pricing
Authorization: Bearer <jwt_token>

Response:
{
  "unitPrice": 8.99,
  "costPrice": 2.50,
  "taxPercentage": 8,
  "isTaxable": true
}
```

**Get Multiple Products' Pricing**
```http
POST /products/bulk/pricing
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productIds": ["id-1", "id-2", "id-3"]
}

Response:
[
  {
    "id": "id-1",
    "name": "Product 1",
    "unitPrice": 8.99,
    "costPrice": 2.50,
    "taxPercentage": 8,
    "isTaxable": true
  },
  ...
]
```

## Filtering

### List Products Filters

```http
GET /products?categoryId=cat-1&isMenuItem=true&status=active&search=bruschetta

Available filters:
- locationId: Location-specific products (NULL = tenant-wide)
- categoryId: Products in category
- isMenuItem: Filter menu items (true/false)
- isInventoryItem: Filter inventory items (true/false)
- status: 'active', 'inactive', 'discontinued' (default: 'active')
- search: Free-text search by name
```

## Metadata Schema

Products can store arbitrary metadata as JSON:

```json
{
  "allergens": ["gluten", "peanuts", "dairy"],
  "ingredients": ["flour", "eggs", "milk"],
  "prepTime": 15,  // minutes
  "isVegetarian": true,
  "isVegan": false,
  "spiceLevel": "medium",  // 'mild', 'medium', 'hot', 'very hot'
  "calories": 450,
  "customAttributes": {}
}
```

## Integration with Orders Module

When creating orders, use the internal pricing endpoints:

```typescript
// Get pricing for products in order
const products = await productsService.getProductsBulk(tenantId, productIds)

// Use pricing in order calculation
const lineTotal = product.unitPrice * quantity
const tax = product.isTaxable ? lineTotal * (product.taxPercentage / 100) : 0
const total = lineTotal + tax
```

## Database Schema

```sql
-- Categories (location-aware)
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  location_id UUID NULL,
  name VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE (tenant_id, location_id, name)
)

-- Products with full-text search
CREATE TABLE products (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  location_id UUID NULL,
  category_id UUID REFERENCES categories(id),
  sku VARCHAR(100),
  name VARCHAR(255),
  unit_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  tax_percentage DECIMAL(5,2),
  is_menu_item BOOLEAN,
  is_inventory_item BOOLEAN,
  is_taxable BOOLEAN,
  status VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE (tenant_id, sku)
)

-- Full-text search index
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english', name || ' ' || COALESCE(description, ''))
)
```

## Testing

Run tests:
```bash
npm test -- products.service.spec
```

Test coverage:
- ✅ Create/read/update/delete categories
- ✅ Create/read/update/delete products
- ✅ Category uniqueness (per location)
- ✅ SKU uniqueness
- ✅ Prevent category deletion if products exist
- ✅ Search by name/SKU
- ✅ Filter by category, location, type
- ✅ Pricing endpoints
- ✅ Bulk fetch
- ✅ Error handling (conflicts, not found)

## Performance Considerations

### Indexes
All indexes created for:
- `(tenant_id, location_id)` - Fast location queries
- `(tenant_id, category_id)` - Fast category queries
- `(tenant_id, sku)` - Fast SKU lookups
- `(tenant_id, status)` - Fast status filtering
- Full-text search on product name + description

### Query Optimization
- Use pagination (default: 50 items per page)
- Search endpoint returns limited fields
- Bulk pricing endpoint for orders (avoid N+1)

### Caching (Future)
- Cache categories per location (invalidate on update)
- Cache product pricing (invalidate on price change)
- Cache search results temporarily

## Permission Requirements

All endpoints require authentication and tenant membership.

**Future (Phase 2)**:
- `products:create` - Create products
- `products:read` - View products
- `products:update` - Edit products
- `products:delete` - Delete products

## Next Steps

1. **Locations Module** - Manage restaurant locations
2. **Orders Module** - Create orders using products
3. **Inventory Module** - Track stock levels
4. **Image Upload** - Store product images
5. **Bulk Operations** - Bulk import/export products
6. **Variants** - Product variants (sizes, colors, etc.)

## Related Documentation

- [Database Schema](../../docs/03-database/01-schema.md)
- [Orders Module](../orders/README.md)
- [Inventory Module](../inventory/README.md)
