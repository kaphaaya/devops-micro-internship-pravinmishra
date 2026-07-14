import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProductsTables1704000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "location_id" uuid,
        "name" varchar(255) NOT NULL,
        "description" text,
        "image_url" varchar(500),
        "display_order" integer NOT NULL DEFAULT 0,
        "status" varchar(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("tenant_id", "location_id", "name")
      )
    `)

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "location_id" uuid,
        "category_id" uuid REFERENCES "categories"("id") ON DELETE SET NULL,
        "sku" varchar(100),
        "barcode" varchar(100),
        "name" varchar(255) NOT NULL,
        "description" text,
        "image_url" varchar(500),
        "unit_price" decimal(10, 2) NOT NULL,
        "cost_price" decimal(10, 2),
        "tax_percentage" decimal(5, 2) NOT NULL DEFAULT 0,
        "unit_of_measure" varchar(20) NOT NULL DEFAULT 'piece',
        "is_menu_item" boolean NOT NULL DEFAULT true,
        "is_inventory_item" boolean NOT NULL DEFAULT false,
        "is_taxable" boolean NOT NULL DEFAULT true,
        "is_active" boolean NOT NULL DEFAULT true,
        "status" varchar(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
        "metadata" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP,
        UNIQUE("tenant_id", "sku")
      )
    `)

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "idx_categories_tenant_location" ON "categories" ("tenant_id", "location_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_categories_status" ON "categories" ("tenant_id", "status")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_products_tenant_location" ON "products" ("tenant_id", "location_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_products_tenant_category" ON "products" ("tenant_id", "category_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_products_tenant_sku" ON "products" ("tenant_id", "sku")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_products_status" ON "products" ("tenant_id", "status")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_products_menu_item" ON "products" ("tenant_id", "is_menu_item")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_products_inventory_item" ON "products" ("tenant_id", "is_inventory_item")
    `)

    // Full-text search index for products
    await queryRunner.query(`
      CREATE INDEX "idx_products_search" ON "products" USING gin(
        to_tsvector('english', name || ' ' || COALESCE(description, ''))
      )
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "products" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policies for categories
    await queryRunner.query(`
      CREATE POLICY "categories_tenant_isolation" ON "categories"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)

    // Create RLS policies for products
    await queryRunner.query(`
      CREATE POLICY "products_tenant_isolation" ON "products"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`DROP POLICY IF EXISTS "products_tenant_isolation" ON "products"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "categories_tenant_isolation" ON "categories"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "products" DISABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_search"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_inventory_item"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_menu_item"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_tenant_sku"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_tenant_category"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_tenant_location"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_categories_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_categories_tenant_location"`)

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`)
  }
}
