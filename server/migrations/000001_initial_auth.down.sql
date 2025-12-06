-- migrations/20231202_01_initial_auth.down.sql
-- Fully reversible — works on PostgreSQL 18 and every other version

-- 1. Drop triggers first
DROP TRIGGER IF EXISTS set_users_updated_at ON users;

-- 2. Drop the shared trigger function
DROP FUNCTION IF EXISTS trigger_set_updated_at();

DROP TABLE IF EXISTS users CASCADE;

RAISE NOTICE 'Auth schema completely removed (users)';