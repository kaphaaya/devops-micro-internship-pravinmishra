import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTenantsTables1704000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "slug" varchar(255) UNIQUE NOT NULL,
        "status" varchar(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
        "tier" varchar(50) NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'professional', 'enterprise')),
        "subscription_ends_at" TIMESTAMP,
        "features" jsonb DEFAULT '{}',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP
      )
    `)

    // Create indexes for performance
    await queryRunner.query(`CREATE INDEX "idx_tenants_slug" ON "tenants" ("slug")`)
    await queryRunner.query(`CREATE INDEX "idx_tenants_status" ON "tenants" ("status")`)
    await queryRunner.query(`CREATE INDEX "idx_tenants_created_at" ON "tenants" ("created_at" DESC)`)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policy: Users can only see their own tenant
    await queryRunner.query(`
      CREATE POLICY "tenants_isolation" ON "tenants"
      FOR SELECT
      USING ("id" = current_setting('app.current_tenant_id')::UUID)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policy
    await queryRunner.query(`DROP POLICY IF EXISTS "tenants_isolation" ON "tenants"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "tenants" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_created_at"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_slug"`)

    // Drop table
    await queryRunner.query(`DROP TABLE "tenants"`)
  }
}
