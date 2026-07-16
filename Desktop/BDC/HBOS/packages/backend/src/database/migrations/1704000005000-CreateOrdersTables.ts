import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrdersTables1704000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create orders table
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "location_id" uuid,
        "customer_id" uuid REFERENCES "customers"("id") ON DELETE SET NULL,
        "order_number" varchar(50) NOT NULL,
        "order_type" varchar(20) NOT NULL DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'takeout', 'delivery')),
        "status" varchar(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_preparation', 'ready', 'completed', 'cancelled')),
        "payment_status" varchar(20) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
        "subtotal" decimal(12, 2) NOT NULL DEFAULT 0,
        "tax_amount" decimal(12, 2) NOT NULL DEFAULT 0,
        "discount_amount" decimal(12, 2) NOT NULL DEFAULT 0,
        "total_amount" decimal(12, 2) NOT NULL DEFAULT 0,
        "notes" text,
        "internal_notes" text,
        "table_number" varchar(50),
        "confirmed_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "cancelled_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP,
        UNIQUE("tenant_id", "order_number")
      )
    `)

    // Create order_items table
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "product_name" varchar(255) NOT NULL,
        "sku" varchar(100),
        "quantity" decimal(10, 2) NOT NULL,
        "unit_price" decimal(10, 2) NOT NULL,
        "item_subtotal" decimal(10, 2) NOT NULL DEFAULT 0,
        "tax_percentage" decimal(5, 2) NOT NULL DEFAULT 0,
        "tax_amount" decimal(10, 2) NOT NULL DEFAULT 0,
        "discount_amount" decimal(10, 2) NOT NULL DEFAULT 0,
        "item_total" decimal(10, 2) NOT NULL DEFAULT 0,
        "special_instructions" text,
        "preparation_status" varchar(50) NOT NULL DEFAULT 'pending' CHECK (preparation_status IN ('pending', 'in_preparation', 'ready', 'served', 'cancelled')),
        "course_number" integer NOT NULL DEFAULT 1,
        "ready_at" TIMESTAMP,
        "served_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP
      )
    `)

    // Create indexes for orders
    await queryRunner.query(`
      CREATE INDEX "idx_orders_tenant_order_number" ON "orders" ("tenant_id", "order_number")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_orders_tenant_customer" ON "orders" ("tenant_id", "customer_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_orders_tenant_status" ON "orders" ("tenant_id", "status")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_orders_tenant_created" ON "orders" ("tenant_id", "created_at" DESC)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_orders_tenant_total" ON "orders" ("tenant_id", "total_amount" DESC)
    `)

    // Create indexes for order_items
    await queryRunner.query(`
      CREATE INDEX "idx_order_items_order_product" ON "order_items" ("order_id", "product_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_order_items_tenant_order" ON "order_items" ("tenant_id", "order_id")
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policies for orders
    await queryRunner.query(`
      CREATE POLICY "orders_tenant_isolation" ON "orders"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)

    // Create RLS policies for order_items
    await queryRunner.query(`
      CREATE POLICY "order_items_tenant_isolation" ON "order_items"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`DROP POLICY IF EXISTS "order_items_tenant_isolation" ON "order_items"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "orders_tenant_isolation" ON "orders"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "order_items" DISABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_order_items_tenant_order"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_order_items_order_product"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_tenant_total"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_tenant_created"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_tenant_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_tenant_customer"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_tenant_order_number"`)

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "order_items"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`)
  }
}
