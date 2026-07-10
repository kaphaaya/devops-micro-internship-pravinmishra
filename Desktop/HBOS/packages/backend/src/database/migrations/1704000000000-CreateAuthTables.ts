import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Initial migration: Create authentication tables
 * Creates: users, authentication_methods
 */
export class CreateAuthTables1704000000000 implements MigrationInterface {
  name = 'CreateAuthTables1704000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "email" character varying(255) NOT NULL,
        "passwordHash" character varying(255) NOT NULL,
        "fullName" character varying(255),
        "phone" character varying(20),
        "avatarUrl" character varying(500),
        "emailVerified" boolean NOT NULL DEFAULT false,
        "emailVerifiedAt" TIMESTAMP,
        "status" character varying(50) NOT NULL DEFAULT 'active',
        "lastLoginAt" TIMESTAMP,
        "failedLoginAttempts" integer NOT NULL DEFAULT 0,
        "lockedUntil" TIMESTAMP,
        "preferredLanguage" character varying(10) NOT NULL DEFAULT 'en',
        "timezone" character varying(50) NOT NULL DEFAULT 'UTC',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_users_tenant_email" UNIQUE ("tenantId", "email")
      )
    `)

    // Create index on tenant_id and email
    await queryRunner.query(`
      CREATE INDEX "IDX_users_tenant_email" ON "users" ("tenantId", "email")
    `)

    // Create index on status
    await queryRunner.query(`
      CREATE INDEX "IDX_users_status" ON "users" ("status")
    `)

    // Create index on createdAt
    await queryRunner.query(`
      CREATE INDEX "IDX_users_createdAt" ON "users" ("createdAt")
    `)

    // Create authentication_methods table
    await queryRunner.query(`
      CREATE TABLE "authentication_methods" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenantId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "type" character varying(50) NOT NULL,
        "provider" character varying(50),
        "backupCodes" text[],
        "providerUserId" character varying(255),
        "providerAccessToken" text,
        "providerRefreshToken" text,
        "isPrimary" boolean NOT NULL DEFAULT false,
        "isVerified" boolean NOT NULL DEFAULT false,
        "verifiedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_auth_methods_tenant_user_type" UNIQUE ("tenantId", "userId", "type", "provider"),
        CONSTRAINT "FK_auth_methods_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    // Create index on isVerified
    await queryRunner.query(`
      CREATE INDEX "IDX_auth_methods_isVerified" ON "authentication_methods" ("isVerified")
    `)

    // Enable Row-Level Security
    await queryRunner.query(`ALTER TABLE "users" ENABLE ROW LEVEL SECURITY`)
    await queryRunner.query(`ALTER TABLE "authentication_methods" ENABLE ROW LEVEL SECURITY`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "authentication_methods"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`)
  }
}
