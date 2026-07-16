import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatePaymentsTables1704000007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create payments table
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "location_id" uuid,
        "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
        "customer_id" uuid REFERENCES "customers"("id") ON DELETE SET NULL,
        "transaction_id" varchar(100) NOT NULL,
        "payment_method" varchar(50) NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card', 'cash', 'mobile', 'check', 'bank_transfer', 'gift_card')),
        "amount" decimal(12, 2) NOT NULL,
        "processing_fee" decimal(12, 2) NOT NULL DEFAULT 0,
        "net_amount" decimal(12, 2) NOT NULL DEFAULT 0,
        "status" varchar(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
        "card_last4" varchar(4),
        "card_brand" varchar(50),
        "cardholder_name" varchar(100),
        "stripe_payment_intent_id" varchar(255),
        "stripe_charge_id" varchar(255),
        "failure_reason" text,
        "receipt_url" text,
        "refunded_amount" decimal(12, 2) NOT NULL DEFAULT 0,
        "refunded_by_payment_id" uuid REFERENCES "payments"("id") ON DELETE SET NULL,
        "refunded_at" TIMESTAMP,
        "processed_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP,
        UNIQUE("tenant_id", "transaction_id")
      )
    `)

    // Create indexes for payments
    await queryRunner.query(`
      CREATE INDEX "idx_payments_tenant_transaction" ON "payments" ("tenant_id", "transaction_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_payments_tenant_order" ON "payments" ("tenant_id", "order_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_payments_tenant_status" ON "payments" ("tenant_id", "status")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_payments_tenant_created" ON "payments" ("tenant_id", "created_at" DESC)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_payments_stripe_intent" ON "payments" ("stripe_payment_intent_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_payments_stripe_charge" ON "payments" ("stripe_charge_id")
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policies for payments
    await queryRunner.query(`
      CREATE POLICY "payments_tenant_isolation" ON "payments"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`DROP POLICY IF EXISTS "payments_tenant_isolation" ON "payments"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "payments" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_stripe_charge"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_stripe_intent"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_tenant_created"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_tenant_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_tenant_order"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payments_tenant_transaction"`)

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`)
  }
}
