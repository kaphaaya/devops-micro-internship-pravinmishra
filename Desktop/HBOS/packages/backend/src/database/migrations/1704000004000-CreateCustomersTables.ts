import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCustomersTables1704000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create customers table
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "email" varchar(255),
        "phone" varchar(20),
        "first_name" varchar(100),
        "last_name" varchar(100),
        "address_line1" varchar(255),
        "city" varchar(100),
        "postal_code" varchar(20),
        "customer_type" varchar(50) NOT NULL DEFAULT 'regular' CHECK (customer_type IN ('regular', 'vip', 'vip_plus', 'inactive')),
        "total_visits" integer NOT NULL DEFAULT 0,
        "lifetime_value" decimal(12, 2) NOT NULL DEFAULT 0,
        "average_order_value" decimal(10, 2) NOT NULL DEFAULT 0,
        "last_visit_at" TIMESTAMP,
        "email_opt_in" boolean NOT NULL DEFAULT false,
        "sms_opt_in" boolean NOT NULL DEFAULT false,
        "preferences" jsonb DEFAULT '{}',
        "status" varchar(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP,
        UNIQUE("tenant_id", "email"),
        UNIQUE("tenant_id", "phone")
      )
    `)

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "idx_customers_tenant_email" ON "customers" ("tenant_id", "email")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_customers_tenant_phone" ON "customers" ("tenant_id", "phone")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_customers_tenant_type" ON "customers" ("tenant_id", "customer_type")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_customers_tenant_status" ON "customers" ("tenant_id", "status")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_customers_created_at" ON "customers" ("tenant_id", "created_at" DESC)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_customers_lifetime_value" ON "customers" ("tenant_id", "lifetime_value" DESC)
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_customers_last_visit" ON "customers" ("tenant_id", "last_visit_at" DESC)
    `)

    // Full-text search index for name and email
    await queryRunner.query(`
      CREATE INDEX "idx_customers_search" ON "customers" USING gin(
        to_tsvector('english', COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') || ' ' || COALESCE(email, ''))
      )
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policies
    await queryRunner.query(`
      CREATE POLICY "customers_tenant_isolation" ON "customers"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policy
    await queryRunner.query(`DROP POLICY IF EXISTS "customers_tenant_isolation" ON "customers"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_search"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_last_visit"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_lifetime_value"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_created_at"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_tenant_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_tenant_type"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_tenant_phone"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customers_tenant_email"`)

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "customers"`)
  }
}
