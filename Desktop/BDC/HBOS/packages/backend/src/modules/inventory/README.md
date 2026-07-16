# Inventory Module

The Inventory module manages stock levels and inventory tracking for products in the POS system.

## Overview

This module provides:
- **Stock Level Management** - Track quantity on hand, reserved, and available
- **Low Stock Alerts** - Automatic status updates when inventory falls below reorder level
- **Reorder Management** - Configure reorder levels and quantities for automatic purchasing
- **Inventory Audit Trail** - Complete history of all inventory movements
- **Multi-Location Support** - Track inventory separately per location
- **Inventory Adjustments** - Handle receiving, returns, damage, expiration, etc.
- **Order Integration** - Automatic stock decrements when orders complete

## Architecture

### Entities

**Inventory**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `locationId` - Optional location-specific inventory (NULL = tenant-wide)
- `productId` - Reference to Product
- `quantityOnHand` - Current physical stock
- `quantityReserved` - Stock reserved for pending orders
- `quantityAvailable` - quantityOnHand - quantityReserved
- `reorderLevel` - Threshold for low stock alert
- `reorderQuantity` - Quantity to order when below reorder level
- `unitOfMeasure` - 'piece', 'kg', 'liter', etc.
- `status` - 'in_stock', 'low_stock', 'out_of_stock', 'discontinued'
- `lastRestockedAt` - Timestamp of last receipt
- `lastCountedAt` - Timestamp of last physical count
- `metadata` - Supplier info, location storage, etc.
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

**InventoryAudit**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `inventoryId` - Reference to Inventory (cascade delete)
- `productId` - Reference to Product
- `type` - 'initial', 'received', 'sold', 'adjustment', 'return', 'damage', 'count', 'expired'
- `quantityChanged` - Change amount (positive/negative)
- `quantityBefore` - Stock before this change
- `quantityAfter` - Stock after this change
- `orderId` - Optional reference to Order (if from order completion)
- `userId` - Optional reference to User (who made the change)
- `notes` - Explanation of the change
- `metadata` - Additional context
- `createdAt` - Timestamp (immutable audit trail)

### Services

**InventoryService**

Creation methods:
- `createInventory(tenantId, dto)` - Initialize inventory for a product
- `createInventory()` - Also creates initial audit entry

Stock management:
- `adjustInventory(tenantId, inventoryId, dto)` - Add/remove stock (received, return, damage, etc.)
- `decrementForOrder(tenantId, productId, quantity, orderId)` - Called when order completes
- `updateInventory(tenantId, inventoryId, dto)` - Update reorder settings

Query methods:
- `getInventoryById(tenantId, inventoryId)` - Get specific inventory
- `getInventoryByProduct(tenantId, productId, locationId?)` - Get for product
- `listInventories(tenantId, filters)` - List with pagination and filtering
- `getLowStockItems(tenantId, locationId?, take)` - Get items below reorder level
- `getAuditHistory(tenantId, inventoryId, options)` - Get audit trail

Internal helper:
- `calculateStatus(quantityOnHand, reorderLevel)` - Determine 'in_stock'/'low_stock'/'out_of_stock'

## API Endpoints

### Inventory Management

**Create Inventory**
```http
POST /inventory
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": "product-123",
  "locationId": "location-456",  // optional
  "quantityOnHand": 100,
  "reorderLevel": 20,            // alert when qty ≤ this
  "reorderQuantity": 50,         // order this qty when below reorder level
  "unitOfMeasure": "piece",      // optional
  "metadata": {
    "supplier": "Supplier Name",
    "warehouseLocation": "A-1-5"
  }
}

Response:
{
  "id": "inventory-123",
  "tenantId": "tenant-123",
  "productId": "product-123",
  "quantityOnHand": 100,
  "quantityReserved": 0,
  "quantityAvailable": 100,
  "reorderLevel": 20,
  "reorderQuantity": 50,
  "status": "in_stock",
  "createdAt": "2026-07-16T10:30:00Z",
  "updatedAt": "2026-07-16T10:30:00Z"
}
```

**List Inventory**
```http
GET /inventory?skip=0&take=50&locationId=optional&status=in_stock&lowStockOnly=false
Authorization: Bearer <jwt_token>

Query Parameters:
- skip: Pagination offset (default: 0)
- take: Page size (default: 50)
- locationId: Filter by location
- status: 'in_stock', 'low_stock', 'out_of_stock', 'discontinued'
- lowStockOnly: true/false to show only low stock items

Response:
{
  "data": [InventoryDto, ...],
  "total": 127
}
```

**Get Inventory for Product**
```http
GET /inventory/product/:productId?locationId=optional
Authorization: Bearer <jwt_token>

Response: InventoryDto
```

**Get Low Stock Items**
```http
GET /inventory/low-stock?locationId=optional&take=50
Authorization: Bearer <jwt_token>

Response: InventoryDto[]
(Sorted by quantity, lowest first)
```

**Get Inventory Details**
```http
GET /inventory/:inventoryId
Authorization: Bearer <jwt_token>

Response: InventoryDto
```

**Update Inventory Settings**
```http
PATCH /inventory/:inventoryId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reorderLevel": 30,
  "reorderQuantity": 75,
  "unitOfMeasure": "kg",
  "metadata": {
    "supplierCode": "SUP-456"
  }
}

Response: InventoryDto
```

**Adjust Inventory**
```http
POST /inventory/:inventoryId/adjust
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "quantity": 50,                    // Positive: add, Negative: remove
  "type": "received",                // See types below
  "notes": "Delivery from supplier",
  "orderId": "optional-order-id",
  "metadata": {
    "invoiceNumber": "INV-123",
    "deliveryDate": "2026-07-16"
  }
}

Adjustment Types:
- received: Stock received from supplier
- adjustment: Manual correction/count adjustment
- return: Customer return (for purchase order, not sales return)
- damage: Damaged goods written off
- expired: Expired goods written off
- count: Physical inventory count (reconcile)

Response: InventoryDto (updated)
```

**Get Audit History**
```http
GET /inventory/:inventoryId/audit?skip=0&take=50
Authorization: Bearer <jwt_token>

Response:
{
  "data": [
    {
      "id": "audit-1",
      "type": "initial",
      "quantityChanged": 100,
      "quantityBefore": 0,
      "quantityAfter": 100,
      "notes": "Initial inventory creation",
      "createdAt": "2026-07-16T10:30:00Z"
    },
    {
      "id": "audit-2",
      "type": "sold",
      "quantityChanged": -10,
      "quantityBefore": 100,
      "quantityAfter": 90,
      "orderId": "order-123",
      "notes": "Order ORD-123456",
      "createdAt": "2026-07-16T10:45:00Z"
    },
    ...
  ],
  "total": 15
}
```

## Status Lifecycle

```
Inventory Status Determination:
- Quantity > Reorder Level  → "in_stock"
- 0 < Quantity ≤ Reorder Level → "low_stock"  (triggers alert/ordering)
- Quantity = 0              → "out_of_stock"
- Product discontinued      → "discontinued"
```

## Integration with Orders

When an order is completed:

```typescript
// 1. Order service calls inventory service
await inventoryService.decrementForOrder(
  tenantId,
  productId,
  quantityOrdered,
  orderId,
  locationId
)

// 2. Inventory service:
//    - Checks quantityAvailable >= quantity
//    - Throws BadRequestException if insufficient
//    - Decrements quantityOnHand
//    - Creates 'sold' audit entry
//    - Updates status (may become 'low_stock' or 'out_of_stock')
//    - Returns updated InventoryDto
```

## Database Schema

```sql
-- Inventory (stock levels per product/location)
CREATE TABLE inventory (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  location_id UUID NULL,           -- NULL = tenant-wide
  product_id UUID REFERENCES products(id),
  quantity_on_hand DECIMAL(10,2),
  quantity_reserved DECIMAL(10,2),
  quantity_available DECIMAL(10,2),
  reorder_level DECIMAL(10,2),
  reorder_quantity DECIMAL(10,2),
  status VARCHAR(50),              -- in_stock, low_stock, etc.
  last_restocked_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE (tenant_id, product_id),
  UNIQUE (tenant_id, location_id, product_id)
)

-- Inventory audit trail (immutable)
CREATE TABLE inventory_audit (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  inventory_id UUID REFERENCES inventory(id),
  product_id UUID REFERENCES products(id),
  type VARCHAR(50),                -- initial, received, sold, etc.
  quantity_changed DECIMAL(10,2),
  quantity_before DECIMAL(10,2),
  quantity_after DECIMAL(10,2),
  order_id UUID REFERENCES orders(id),
  user_id UUID,
  notes TEXT,
  created_at TIMESTAMP             -- immutable, for audit trail
)

-- Indexes for performance
CREATE INDEX idx_inventory_tenant_product ON inventory(tenant_id, product_id)
CREATE INDEX idx_inventory_tenant_status ON inventory(tenant_id, status)
CREATE INDEX idx_inventory_audit_inventory_created ON inventory_audit(inventory_id, created_at DESC)
```

## Testing

Run tests:
```bash
npm test -- inventory.service.spec
```

Test coverage:
- ✅ Create inventory for product
- ✅ Prevent duplicate inventory (product/location)
- ✅ Adjust stock (received, return, damage, expired)
- ✅ Prevent negative inventory adjustments
- ✅ Decrement for orders with sufficient stock
- ✅ Error on insufficient inventory for order
- ✅ Update reorder settings
- ✅ Calculate correct status (in_stock/low_stock/out_of_stock)
- ✅ List with filtering by status, location
- ✅ Get low stock items (sorted)
- ✅ Audit trail creation and retrieval
- ✅ Error handling (not found, conflicts)

## Performance Considerations

### Indexes
All queries optimized with:
- `(tenant_id, product_id)` - Fast product lookup
- `(tenant_id, location_id, product_id)` - Fast location-specific lookup
- `(tenant_id, status)` - Fast status filtering
- `(inventory_id, created_at DESC)` - Fast audit history

### Optimization Tips
- Use pagination for inventory lists (default: 50 per page)
- Use `getLowStockItems()` endpoint for efficient low-stock queries
- Query audit history with pagination (don't fetch entire history)
- Use location-specific queries when available (narrow down results)

### Caching (Future)
- Cache low-stock items per location (invalidate on adjust)
- Cache product availability status (invalidate on order)
- Cache reorder calculations (invalidate daily or on adjustment)

## Workflow Examples

### Receiving Stock

```
1. Supplier delivers 100 units
2. POST /inventory/:id/adjust
   {
     "quantity": 100,
     "type": "received",
     "notes": "Delivery from Supplier Inc.",
     "metadata": {
       "invoiceNumber": "SUP-INV-789",
       "purchaseOrderId": "PO-123"
     }
   }
3. Inventory updates:
   - quantityOnHand: 50 → 150
   - status: possibly changes from "low_stock" to "in_stock"
   - lastRestockedAt: now
4. Audit entry created: type='received', quantityChanged=+100
```

### Processing an Order

```
1. Order created: 10 units of Product A
   - quantityReserved: 0 → 10
   - quantityAvailable: 100 → 90

2. Order completed:
   - inventoryService.decrementForOrder(...)
   - quantityOnHand: 100 → 90
   - Audit entry: type='sold', quantityChanged=-10

3. If stock falls below reorder level:
   - status: "in_stock" → "low_stock"
   - System/admin should initiate purchase order
```

### Physical Inventory Count

```
1. Perform physical count: 85 units (system shows 90)
2. POST /inventory/:id/adjust
   {
     "quantity": -5,         // 90 - 85 = -5 to adjust
     "type": "count",
     "notes": "Physical count Q3"
   }
3. Inventory updates to match physical reality
4. Audit shows: quantityBefore=90, quantityAfter=85
```

## Permission Requirements

All endpoints require JWT authentication and tenant membership.

**Future (Phase 2)**:
- `inventory:read` - View inventory
- `inventory:adjust` - Adjust stock
- `inventory:write` - Update settings
- `inventory:audit` - View audit trail

## Next Steps

1. **Order Integration** - Call `decrementForOrder()` when orders complete
2. **Reorder Automation** - Auto-generate purchase orders when low
3. **Multi-Warehouse** - Track inventory across multiple warehouses
4. **Transfer Orders** - Move stock between locations
5. **Forecast** - Predict future stock needs based on sales
6. **Barcode Scanning** - Mobile app for stock receiving/counting

## Related Documentation

- [Orders Module](../orders/README.md)
- [Products Module](../products/README.md)
- [Database Schema](../../docs/03-database/01-schema.md)
