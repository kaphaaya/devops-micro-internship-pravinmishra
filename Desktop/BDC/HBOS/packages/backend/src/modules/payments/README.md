# Payments Module

The Payments module handles payment processing and transaction management with integrated Stripe support for card payments.

## Overview

This module provides:
- **Payment Processing** - Process card, cash, mobile, and other payment methods
- **Stripe Integration** - Full Stripe API support for card payments
- **Multiple Payment Methods** - Card, cash, mobile, check, bank transfer, gift card
- **Payment Status Tracking** - Complete payment lifecycle management
- **Refund Management** - Full and partial refund support
- **Transaction History** - Complete audit trail of all transactions
- **PCI Compliance** - Secure handling of card data (only last 4 digits stored locally)
- **3D Secure Support** - Framework for SCA/3DS verification

## Architecture

### Entities

**Payment**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `locationId` - Optional location reference
- `orderId` - Reference to Order
- `customerId` - Optional customer reference
- `transactionId` - Unique transaction ID (auto-generated, format: TXN-XXXXXX)
- `paymentMethod` - 'card', 'cash', 'mobile', 'check', 'bank_transfer', 'gift_card'
- `amount` - Payment amount
- `processingFee` - Stripe/processor fee (~2.9% + $0.30 for cards)
- `netAmount` - amount - processingFee
- `status` - 'pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'
- `cardLast4` - Last 4 digits of card (PCI compliant)
- `cardBrand` - Card brand (Visa, Mastercard, etc.)
- `cardholderName` - Name on card
- `stripePaymentIntentId` - Stripe Payment Intent ID
- `stripeChargeId` - Stripe Charge ID
- `failureReason` - Why payment failed (if applicable)
- `receiptUrl` - Link to Stripe receipt
- `refundedAmount` - Total amount refunded
- `refundedByPaymentId` - Reference to refund payment record
- `refundedAt` - When refund was processed
- `processedAt` - When payment was processed
- `completedAt` - When payment completed
- `metadata` - Additional context (invoice number, etc.)
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

### Services

**PaymentService**

Payment processing:
- `createPaymentIntent(tenantId, orderId, amount)` - Create Stripe payment intent
- `processPayment(tenantId, dto)` - Process payment (any method)
- `confirmPayment(tenantId, paymentId)` - Confirm after 3D Secure/async verification

Query methods:
- `getPaymentById(tenantId, paymentId)` - Get payment details
- `getPaymentByTransactionId(tenantId, transactionId)` - Get by transaction ID
- `getOrderPayments(tenantId, orderId)` - Get all payments for order
- `listPayments(tenantId, filters)` - List with pagination and filtering

Refund methods:
- `refundPayment(tenantId, paymentId, dto)` - Refund payment (full or partial)

## API Endpoints

### Payment Processing

**Create Payment Intent (Stripe)**
```http
POST /payments/intent
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "order-123",
  "amount": 99.99
}

Response:
{
  "clientSecret": "pi_1234_secret_5678",
  "paymentIntentId": "pi_1234",
  "amount": 99.99,
  "status": "requires_payment_method"
}

Use clientSecret on frontend with Stripe.js to collect payment
```

**Process Payment**
```http
POST /payments/process
Authorization: Bearer <jwt_token>
Content-Type: application/json

For Card Payment:
{
  "orderId": "order-123",
  "amount": 99.99,
  "paymentMethod": "card",
  "stripePaymentMethodId": "pm_1234",
  "cardholderName": "John Doe"
}

For Cash Payment:
{
  "orderId": "order-123",
  "amount": 99.99,
  "paymentMethod": "cash",
  "notes": "Paid in cash at register"
}

For Mobile Payment (Apple Pay/Google Pay):
{
  "orderId": "order-123",
  "amount": 99.99,
  "paymentMethod": "mobile",
  "stripePaymentMethodId": "pm_5678"
}

Response:
{
  "id": "payment-123",
  "transactionId": "TXN-123456",
  "status": "succeeded",  // or "pending", "processing", "failed"
  "amount": 99.99,
  "processingFee": 3.19,  // For card: 2.9% + $0.30
  "netAmount": 96.80,
  "cardLast4": "4242",
  "cardBrand": "visa",
  "completedAt": "2026-07-16T10:30:00Z"
}
```

**Confirm Payment (After 3D Secure)**
```http
POST /payments/:paymentId/confirm
Authorization: Bearer <jwt_token>

Response: PaymentDto
(Status may change from pending to succeeded/failed)
```

**List Payments**
```http
GET /payments?skip=0&take=50&status=succeeded&paymentMethod=card&startDate=2026-07-01&endDate=2026-07-31
Authorization: Bearer <jwt_token>

Query Parameters:
- skip: Pagination offset (default: 0)
- take: Page size (default: 50)
- status: 'pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'
- paymentMethod: Filter by method
- startDate: Orders created after this date (ISO 8601)
- endDate: Orders created before this date (ISO 8601)

Response:
{
  "data": [PaymentDto, ...],
  "total": 127
}
```

**Get Payment**
```http
GET /payments/:paymentId
Authorization: Bearer <jwt_token>

Response: PaymentDto
```

**Get Payment by Transaction ID**
```http
GET /payments/transaction/:transactionId
Authorization: Bearer <jwt_token>

Response: PaymentDto
```

**Get Payments for Order**
```http
GET /payments/order/:orderId
Authorization: Bearer <jwt_token>

Response: PaymentDto[]
(Sorted by creation time, most recent first)
```

**Refund Payment**
```http
POST /payments/:paymentId/refund
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 50.00,           // Can be less than original (partial refund)
  "reason": "Item returned",
  "metadata": {
    "returnId": "RET-123"
  }
}

Response: PaymentDto
(Original payment shows refundedAmount updated, status may change to 'refunded')

Note:
- Refund is processed immediately via Stripe if original was a card payment
- Creates new payment record with negative amount for audit trail
- Can refund up to the original payment amount (minus already refunded)
```

## Payment Status Lifecycle

```
CASH/Check/Bank Transfer:
pending → (manual verification) → succeeded → (optional) refunded

Card (Stripe):
pending → processing → succeeded → (optional) refunded
          ↓
          (3D Secure required) → confirm → processing/succeeded

          failed (insufficient funds, expired, etc.)
          cancelled (user cancellation)

Mobile (Apple Pay/Google Pay):
pending → processing → succeeded
```

## Stripe Integration

### Setup

1. **Get Stripe Keys:**
   - Log in to Stripe Dashboard
   - Go to Developers → API Keys
   - Copy Secret Key

2. **Configure Environment:**
   ```bash
   # .env.local or .env.production
   STRIPE_SECRET_KEY=sk_test_... or sk_live_...
   STRIPE_PUBLIC_KEY=pk_test_... or pk_live_...  # For frontend
   ```

3. **Frontend Setup** (in Next.js app):
   ```typescript
   import { loadStripe } from '@stripe/js'

   const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
   ```

### Payment Flow (Card via Stripe)

```
1. Frontend calls POST /payments/intent
   ↓ (gets clientSecret)
2. Frontend displays Stripe Payment Element
3. Customer enters card details
4. Frontend calls Stripe confirmPayment()
5. Stripe processes payment (may require 3DS)
6. Frontend calls POST /payments/confirm with paymentId
7. Backend verifies with Stripe and updates payment status
8. Order marked as paid
```

### Webhook Handling (Future Implementation)

```typescript
// Listen for Stripe webhooks
POST /webhooks/stripe

Handles:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
```

## PCI Compliance

✅ **Secure Practices:**
- Never store full credit card numbers locally
- Store only last 4 digits for UI display
- Use Stripe tokenization (payment methods)
- No card data transmitted through HBOS servers
- Stripe handles all PCI compliance

## Processing Fees

**Card Payments (Stripe):**
- 2.9% + $0.30 per transaction
- Example: $100 order → $2.90 + $0.30 = $3.20 fee → $96.80 net

**Cash Payments:**
- No fee

**Other Methods:**
- Configurable (currently 0%, future payment providers may vary)

## Database Schema

```sql
-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  location_id UUID NULL,
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  transaction_id VARCHAR(100),         -- "TXN-123456"
  payment_method VARCHAR(50),          -- card, cash, mobile, etc.
  amount DECIMAL(12,2),
  processing_fee DECIMAL(12,2),
  net_amount DECIMAL(12,2),
  status VARCHAR(50),                  -- pending, succeeded, failed, etc.
  card_last4 VARCHAR(4),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  refunded_amount DECIMAL(12,2),
  refunded_at TIMESTAMP,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE (tenant_id, transaction_id)
)

-- Indexes for performance
CREATE INDEX idx_payments_tenant_transaction ON payments(tenant_id, transaction_id)
CREATE INDEX idx_payments_tenant_order ON payments(tenant_id, order_id)
CREATE INDEX idx_payments_tenant_status ON payments(tenant_id, status)
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id)
```

## Testing

Run tests:
```bash
npm test -- payments.service.spec
```

Test coverage:
- ✅ Process cash payment
- ✅ Process mobile payment (pending status)
- ✅ Get payment by ID
- ✅ Get payment by transaction ID
- ✅ List payments with filtering
- ✅ Refund payment (full amount)
- ✅ Refund payment (partial amount)
- ✅ Error on refunding non-succeeded payment
- ✅ Error on refunding more than available
- ✅ Get all payments for order
- ✅ Error handling (not found, invalid amounts)

## Workflow Examples

### Complete Order with Card Payment

```
1. Order created: $99.99
2. POST /payments/intent → clientSecret
3. Frontend collects card, displays card element
4. Frontend calls Stripe confirmPayment()
5. Stripe processes payment
6. POST /payments/process (via webhook or confirmation)
   - status: 'succeeded'
   - fee: $3.20
   - net: $96.80
7. Order status updated to 'completed'
8. Customer receives receipt
```

### Cash Payment at Register

```
1. Order created: $99.99
2. Server confirms cash payment
3. POST /payments/process
   {
     "orderId": "order-123",
     "amount": 99.99,
     "paymentMethod": "cash",
     "notes": "Paid at register"
   }
4. Payment status: 'succeeded' immediately
5. Order marked complete
6. No processing fee deducted
```

### Partial Refund

```
1. Customer wants to return item worth $20 from $99.99 order
2. POST /payments/:paymentId/refund
   {
     "amount": 20.00,
     "reason": "Item returned - damaged"
   }
3. Stripe processes $20 refund automatically
4. Original payment shows refundedAmount: $20
5. New refund payment created (for audit trail)
6. Can refund remaining $79.99 later if needed
```

## Integration with Orders

When order payment is completed:

```typescript
// In Orders module, after order confirmation:
const payment = await paymentService.processPayment(tenantId, {
  orderId,
  amount,
  paymentMethod: 'card'
})

if (payment.status === 'succeeded') {
  order.paymentStatus = 'paid'
  order.status = 'confirmed'
  await orderService.updateOrder(order)
}
```

## Future Enhancements

1. **Multiple Payment Providers** - Add Square, PayPal, etc.
2. **Webhook Handling** - Listen for Stripe events
3. **Subscription Payments** - Recurring billing
4. **Payment Plans** - Split payment over time
5. **Multi-Currency** - Support different currencies
6. **Tax Calculation** - Integrate with tax service
7. **Reporting** - Payment analytics and reports
8. **Reconciliation** - Match bank deposits to payments

## Configuration

**Environment Variables:**
```
STRIPE_SECRET_KEY=sk_test_...     # Required for card payments
STRIPE_PUBLIC_KEY=pk_test_...     # For frontend
PAYMENT_PROCESSING_FEE_PERCENT=2.9
PAYMENT_PROCESSING_FEE_FIXED=0.30
```

## Security Considerations

✅ **Implemented:**
- No card data stored locally
- PCI DSS compliant (Stripe handles)
- JWT authentication on all endpoints
- Tenant isolation via RLS
- Transaction validation before processing
- Audit trail of all changes

⚠️ **Future:**
- Rate limiting on payment attempts
- Fraud detection (Stripe Radar)
- 3D Secure for high-risk transactions
- Payment method tokenization
- Webhook signature verification

## Permission Requirements

All endpoints require JWT authentication and tenant membership.

**Future (Phase 2):**
- `payments:create` - Initiate payments
- `payments:read` - View payments
- `payments:refund` - Process refunds
- `payments:admin` - View all tenant payments (multi-location)

## Related Documentation

- [Orders Module](../orders/README.md)
- [Customers Module](../customers/README.md)
- [Stripe Documentation](https://stripe.com/docs)
