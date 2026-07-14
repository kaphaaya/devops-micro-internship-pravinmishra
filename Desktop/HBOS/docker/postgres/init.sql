-- HBOS PostgreSQL Initialization Script
-- Creates schemas, extensions, and sets up initial configurations

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Text search support

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Set application defaults
ALTER ROLE hbos SET search_path TO public;

-- Enable Row-Level Security by default
ALTER DATABASE hbos_development SET "app.current_tenant_id" = '';

-- Create audit function (will be used by tables)
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs(
    tenant_id,
    user_id,
    entity_type,
    entity_id,
    action,
    old_values,
    new_values,
    created_at
  ) VALUES(
    current_setting('app.current_tenant_id')::UUID,
    current_setting('app.current_user_id')::UUID,
    TG_TABLE_NAME,
    NEW.id,
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW),
    CURRENT_TIMESTAMP
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set tenant context (called from application)
CREATE OR REPLACE FUNCTION set_tenant_id(tenant_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set user context (for audit logs)
CREATE OR REPLACE FUNCTION set_user_id(user_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO hbos;
GRANT CREATE ON SCHEMA public TO hbos;

-- Verify connection
SELECT version();
SELECT 'PostgreSQL initialized successfully!' AS message;
