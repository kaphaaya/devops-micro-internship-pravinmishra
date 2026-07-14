import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateRolesPermissionsTables1704000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "name" varchar(100) NOT NULL,
        "description" text,
        "is_system" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP,
        UNIQUE("tenant_id", "name")
      )
    `)

    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "code" varchar(100) NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "resource" varchar(50),
        "action" varchar(20),
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("tenant_id", "code")
      )
    `)

    // Create role_permissions junction table
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        "permission_id" uuid NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
        PRIMARY KEY("role_id", "permission_id")
      )
    `)

    // Create user_roles table
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
        "location_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP,
        UNIQUE("tenant_id", "user_id", "role_id", "location_id")
      )
    `)

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "idx_roles_tenant_system" ON "roles" ("tenant_id", "is_system")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_permissions_tenant_resource" ON "permissions" ("tenant_id", "resource")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_user_roles_tenant_user" ON "user_roles" ("tenant_id", "user_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_user_roles_tenant_role" ON "user_roles" ("tenant_id", "role_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "idx_role_permissions" ON "role_permissions" ("role_id")
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "permissions" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "role_permissions" ENABLE ROW LEVEL SECURITY`)

    // Create RLS policies for roles
    await queryRunner.query(`
      CREATE POLICY "roles_tenant_isolation" ON "roles"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)

    // Create RLS policies for permissions
    await queryRunner.query(`
      CREATE POLICY "permissions_tenant_isolation" ON "permissions"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)

    // Create RLS policies for user_roles
    await queryRunner.query(`
      CREATE POLICY "user_roles_tenant_isolation" ON "user_roles"
      FOR SELECT USING ("tenant_id" = current_setting('app.current_tenant_id')::UUID)
    `)

    // Create RLS policies for role_permissions
    await queryRunner.query(`
      CREATE POLICY "role_permissions_tenant_isolation" ON "role_permissions"
      FOR SELECT USING (role_id IN (
        SELECT id FROM roles WHERE "tenant_id" = current_setting('app.current_tenant_id')::UUID
      ))
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop RLS policies
    await queryRunner.query(`DROP POLICY IF EXISTS "role_permissions_tenant_isolation" ON "role_permissions"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "user_roles_tenant_isolation" ON "user_roles"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "permissions_tenant_isolation" ON "permissions"`)
    await queryRunner.query(`DROP POLICY IF EXISTS "roles_tenant_isolation" ON "roles"`)

    // Disable RLS
    await queryRunner.query(`ALTER TABLE "role_permissions" DISABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "user_roles" DISABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "permissions" DISABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY`)

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_role_permissions"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_roles_tenant_role"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_roles_tenant_user"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_permissions_tenant_resource"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_roles_tenant_system"`)

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "roles"`)
  }
}
