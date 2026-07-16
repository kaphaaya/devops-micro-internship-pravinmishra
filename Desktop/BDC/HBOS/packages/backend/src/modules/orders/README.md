# Orders Module

The Orders module manages customer orders for the POS and restaurant management system.

## Overview

This module provides:
- **Order Management** - Create, update, and manage customer orders
- **Order Items** - Add and remove items from orders with pricing
- **Order Calculation** - Automatic calculation of subtotals, taxes, and totals
- **Order Status** - Manage order lifecycle (pending → completed)
- **Item Preparation** - Track preparation status of individual items
- **Order Filtering** - Search and filter orders by date, customer, status

## Architecture

### Entities

**Order**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `locationId` - Optional location reference
- `customerId` - Optional customer reference (for loyalty tracking)
- `orderNumber` - Unique order number (auto-generated, format: ORD-XXXXXX)
- `orderType` - 'dine_in', 'takeout', or 'delivery'
- `status` - 'pending', 'confirmed', 'in_preparation', 'ready', 'completed', 'cancelled'
- `paymentStatus` - 'unpaid', 'partial', 'paid', 'refunded'
- `subtotal` - Sum of item subtotals (decimal)
- `taxAmount` - Total tax (calculated)
- `discountAmount` - Total discount (if applicable)
- `totalAmount` - subtotal + tax - discount
- `notes` - Customer notes (special requests, etc.)
- `internalNotes` - Staff notes (cancellation reason, etc.)
- `tableNumber` - For dine-in orders
- `confirmedAt` - Timestamp when order was confirmed
- `completedAt` - Timestamp when order was completed
- `cancelledAt` - Timestamp when order was cancelled
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

**OrderItem**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `orderId` - Reference to Order (cascade delete)
- `productId` - Reference to Product (restrict delete)
- `productName` - Product name (snapshot at order time)
- `sku` - Product SKU (snapshot)
- `quantity` - Ordered quantity (decimal for fractional quantities)
- `unitPrice` - Price per unit (snapshot at order time)
- `itemSubtotal` - quantity × unitPrice
- `taxPercentage` - Tax rate (snapshot)
- `taxAmount` - Item tax (calculated)
- `discountAmount` - Item discount (if applicable)
- `itemTotal` - itemSubtotal + taxAmount - discountAmount
- `specialInstructions` - Special requests for this item
- `preparationStatus` - 'pending', 'in_preparation', 'ready', 'served', 'cancelled'
- `courseNumber` - Course sequence for multi-course meals (default: 1)
- `readyAt` - When item was ready for service
- `servedAt` - When item was served to customer
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

### Services

**OrdersService**

Core methods:
- `createOrder(tenantId, dto)` - Create new order with items
- `getOrderById(tenantId, orderId)` - Get order details
- `listOrders(tenantId, filters)` - List with pagination and filtering
- `updateOrderStatus(tenantId, orderId, dto)` - Update order status
- `cancelOrder(tenantId, orderId, reason)` - Cancel order
- `getOrderItems(tenantId, orderId)` - Get items in order
- `updateItemPreparationStatus(tenantId, orderId, itemId, status)` - Update item status
- `removeItemFromOrder(tenantId, orderId, itemId)` - Remove item from order

**OrderCalculationService**

Calculation methods (using Decimal.js for precision):
- `calculateItemSubtotal(quantity, unitPrice)` - Item line total
- `calculateItemTax(subtotal, taxPercentage)` - Item tax amount
- `calculateOrderSubtotal(itemSubtotals)` - Sum of all items
- `calculateOrderTax(itemTaxes)` - Sum of all taxes
- `calculateOrderTotal(subtotal, taxAmount, discountAmount)` - Final total
- `round(value)` - Round to 2 decimal places

## API Endpoints

### Order Management

**Create Order**
```http
POST /orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderType": "dine_in",
  "customerId": "customer-123",  // optional
  "locationId": "location-123",  // optional
  "tableNumber": "5",            // optional, required for dine_in
  "notes": "No onions",          // optional
  "items": [
    {
      "productId": "product-456",
      "quantity": 2,
      "specialInstructions": "Extra sauce",
      "courseNumber": 1
    },
    {
      "productId": "product-789",
      "quantity": 1,
      "courseNumber": 1
    }
  ]
}

Response:
{
  "id": "order-123",
  "tenantId": "tenant-123",
  "orderNumber": "ORD-123456",
  "orderType": "dine_in",
  "status": "pending",
  "paymentStatus": "unpaid",
  "subtotal": 25.00,
  "taxAmount": 2.00,
  "discountAmount": 0.00,
  "totalAmount": 27.00,
  "items": [
    {
      "id": "item-1",
      "productId": "product-456",
      "productName": "Burger",
      "quantity": 2,
      "unitPrice": 12.00,
      "itemSubtotal": 24.00,
      "taxPercentage": 8,
      "taxAmount": 1.92,
      "itemTotal": 25.92,
      "preparationStatus": "pending"
    },
    ...
  ],
  "createdAt": "2026-07-16T10:30:00Z",
  "updatedAt": "2026-07-16T10:30:00Z"
}
```

**List Orders**
```http
GET /orders?skip=0&take=50&status=pending&customerId=customer-123&startDate=2026-07-01&endDate=2026-07-31
Authorization: Bearer <jwt_token>

Query Parameters:
- skip: Pagination offset (default: 0)
- take: Page size (default: 50)
- status: Filter by status ('pending', 'confirmed', 'in_preparation', 'ready', 'completed', 'cancelled')
- paymentStatus: Filter by payment status ('unpaid', 'partial', 'paid', 'refunded')
- customerId: Filter by customer
- startDate: Orders created after this date (ISO 8601)
- endDate: Orders created before this date (ISO 8601)

Response:
{
  "data": [OrderDto, ...],
  "total": 127
}
```

**Get Order**
```http
GET /orders/:orderId
Authorization: Bearer <jwt_token>

Response: OrderDto (with items)
```

**Update Order Status**
```http
PATCH /orders/:orderId/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "confirmed",
  "internalNotes": "Confirmed by kitchen"
}

Valid status transitions:
- pending → confirmed, cancelled
- confirmed → in_preparation, cancelled
- in_preparation → ready, cancelled
- ready → completed, cancelled
- completed → (none)
- cancelled → (none)

Response: OrderDto
```

**Cancel Order**
```http
POST /orders/:orderId/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reason": "Customer requested cancellation"  // optional
}

Response: OrderDto
```

### Order Items

**Get Order Items**
```http
GET /orders/:orderId/items
Authorization: Bearer <jwt_token>

Response: OrderItemDto[]
```

**Update Item Preparation Status**
```http
PATCH /orders/:orderId/items/:itemId/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "preparationStatus": "ready"
}

Valid statuses:
- pending: Item just added to order
- in_preparation: Kitchen started preparing
- ready: Item ready for service
- served: Item was delivered to customer
- cancelled: Item was cancelled

Response: OrderItemDto
```

**Remove Item from Order**
```http
DELETE /orders/:orderId/items/:itemId
Authorization: Bearer <jwt_token>

Response: 204 No Content
(Note: Order totals are recalculated automatically)
```

## Database Schema

```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  location_id UUID NULL,
  customer_id UUID REFERENCES customers(id),
  order_number VARCHAR(50),           -- "ORD-123456"
  order_type VARCHAR(20),              -- dine_in, takeout, delivery
  status VARCHAR(50),                  -- pending, confirmed, etc.
  payment_status VARCHAR(20),          -- unpaid, partial, paid, refunded
  subtotal DECIMAL(12,2),
  tax_amount DECIMAL(12,2),
  discount_amount DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  notes TEXT,
  internal_notes TEXT,
  table_number VARCHAR(50),
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE (tenant_id, order_number)
)

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  sku VARCHAR(100),
  quantity DECIMAL(10,2),
  unit_price DECIMAL(10,2),
  item_subtotal DECIMAL(10,2),
  tax_percentage DECIMAL(5,2),
  tax_amount DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  item_total DECIMAL(10,2),
  special_instructions TEXT,
  preparation_status VARCHAR(50),
  course_number INTEGER,
  ready_at TIMESTAMP,
  served_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
)

-- Indexes for performance
CREATE INDEX idx_orders_tenant_order_number ON orders(tenant_id, order_number)
CREATE INDEX idx_orders_tenant_customer ON orders(tenant_id, customer_id)
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status)
CREATE INDEX idx_orders_tenant_created ON orders(tenant_id, created_at DESC)
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id)
```

## Integration Points

### With Products Module

When creating an order, the controller must:
1. Validate each product exists
2. Fetch product pricing and tax info
3. Create order items with pricing snapshot

```typescript
// Example (to be implemented in controller)
for (const itemDto of createOrderDto.items) {
  const product = await productsService.getProductById(tenantId, itemDto.productId)
  const item = new OrderItem()
  item.productId = product.id
  item.productName = product.name
  item.unitPrice = product.unitPrice
  item.taxPercentage = product.taxPercentage
  // ... save to order
}
```

### With Customers Module

After order completion:
1. Update customer lifetime value
2. Increment visit count
3. Check for tier promotions

```typescript
// Example (to be implemented)
await customersService.recordOrderCompletion(customerId, totalAmount)
```

## Precision & Rounding

Uses `Decimal.js` library for accurate monetary calculations:
- All prices stored as `DECIMAL(10,2)` in database
- JavaScript Number used internally with Decimal for operations
- All totals rounded to 2 decimal places
- No floating-point precision errors

## Status Lifecycle

```
             ┌─────────────────┐
             │     pending     │
             └────────┬────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    confirmed                  cancelled
         │
    in_preparation
         │
       ready
         │
    completed
```

## Testing

Run tests:
```bash
npm test -- orders.service.spec
```

Test coverage:
- ✅ Create orders with items
- ✅ Calculate subtotals and taxes
- ✅ List/filter orders
- ✅ Update order status with valid transitions
- ✅ Prevent invalid status transitions
- ✅ Cancel orders
- ✅ Remove items and recalculate totals
- ✅ Update item preparation status
- ✅ Error handling (not found, invalid transitions)

## Performance Considerations

### Indexes
All queries optimized with:
- `(tenant_id, order_number)` - Fast order lookup by number
- `(tenant_id, customer_id)` - Fast customer order history
- `(tenant_id, status)` - Fast status filtering
- `(tenant_id, created_at DESC)` - Fast date filtering

### Optimization Tips
- Use pagination for order lists (default: 50 per page)
- Use `startDate`/`endDate` for large date ranges
- Filter by customer for customer-specific queries
- Avoid fetching all items on list endpoint (use relations: false)

### Future Caching
- Cache order totals after completion
- Cache customer order counts
- Cache daily/monthly sales summaries

## Permission Requirements

All endpoints require JWT authentication and tenant membership.

**Future (Phase 2)**:
- `orders:create` - Create orders
- `orders:read` - View orders
- `orders:update` - Update order status
- `orders:delete` - Cancel orders
- `orders:read_others` - View all orders vs. own only

## Next Steps

1. **Integration with Products** - Fetch product pricing when adding items
2. **Integration with Customers** - Update customer metrics on order completion
3. **Payments Module** - Process payments for orders
4. **Inventory Module** - Decrement stock when orders completed
5. **Order History** - Customer order history dashboard
6. **Order Analytics** - Sales reports by hour/day/category
7. **Order Export** - CSV/PDF export of orders

## Related Documentation

- [Products Module](../products/README.md)
- [Customers Module](../customers/README.md)
- [Database Schema](../../docs/03-database/01-schema.md)
