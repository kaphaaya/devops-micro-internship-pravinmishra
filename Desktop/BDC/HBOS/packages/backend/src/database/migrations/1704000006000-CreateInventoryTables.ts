import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInventoryTables1704000006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create inventory table
    await queryRunner.query(`
      CREATE TABLE "inventory" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "location_id" uuid,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "quantity_on_hand" decimal(10, 2) NOT NULL DEFAULT 0,
        "quantity_reserved" decimal(10, 2) NOT NULL DEFAULT 0,
        "quantity_available" decimal(10, 2) NOT NULL DEFAULT 0,
        "reorder_level" decimal(10, 2) NOT NULL DEFAULT 0,
        "reorder_quantity" decimal(10, 2) NOT NULL DEFAULT 0,
        "unit_of_measure" varchar(20) NOT NULL DEFAULT 'piece',
        "status" varchar(50) NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock', 'discontinued')),
        "last_restocked_at" TIMESTAMP,
        "last_counted_at" TIMESTAMP,
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("tenant_id", "product_id"),
        UNIQUE("tenant_id", "location_id", "product_id")
      )
    `)

    // Create inventory_audit table
    await queryRunner.query(`
      CREATE TABLE "inventory_audit" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "inventory_id" uuid NOT NULL REFERENCES "inventory"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "type" varchar(50) NOT NULL CHECK (type IN ('initial', 'received', 'sold', 'adjustment', 'return', 'damage', 'count', 'expired')),
        "quantity_changed" decimal(10, 2) NOT NULL,
        "quantity_before" decimal(10, 2) NOT NULL,
        "quantity_after" decimal(10, 2) NOT NULL,
        "order_id" uuid REFERENCES "orders"("id") ON DELETE SET NULL,
        "user_id" uuid,
        "notes" text,
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for inventory
    await queryRunner.query(`
      CREATE INDEX "idx_inventory_tenant_product" ON "inventory" ("tenant_id", "product_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_inventory_tenant_location_product" ON "inventory" ("tenant_id", "location_id", "product_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_inventory_tenant_status" ON "inventory" ("tenant_id", "status")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_inventory_tenant_quantity" ON "inventory" ("tenant_id", "quantity_on_hand")
    `)

    // Create indexes for inventory_audit
    await queryRunner.query(`
      CREATE INDEX "idx_inventory_audit_tenant_inventory_created" ON "inventory_audit" ("tenant_id", "inventory_id", "created_at" DESC)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_inventory_audit_tenant_product_created" ON "inventory_audit" ("tenant_id", "product_id", "created_at" DESC)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_inventory_audit_tenant_type" ON "inventory_audit" ("tenant_id", "type")
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "inventory" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "inventory_audit" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policies for inventory
    await queryRunner.query(`
      CREATE POLICY "inventory_tenant_isolation" ON "inventory"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)

    // Create RLS policies for inventory_audit
    await queryRunner.query(`
      CREATE POLICY "inventory_audit_tenant_isolation" ON "inventory_audit"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`DROP POLICY IF EXISTS "inventory_audit_tenant_isolation" ON "inventory_audit"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "inventory_tenant_isolation" ON "inventory"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "inventory_audit" DISABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "inventory" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_audit_tenant_type"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_audit_tenant_product_created"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_audit_tenant_inventory_created"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_tenant_quantity"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_tenant_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_tenant_location_product"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_inventory_tenant_product"`)

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_audit"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory"`)
  }
}
