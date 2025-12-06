-- migrations/20231202_01_initial_auth.up.sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email                  TEXT        NOT NULL UNIQUE CHECK (email LIKE '%@%.%'),
    email_verified_at      TIMESTAMPTZ,
    password_hash          TEXT        NOT NULL,  -- ← full Argon2id string with salt inside
    
    first_name             TEXT,
    last_name              TEXT,
    
    failed_login_attempts INT         DEFAULT 0,
    locked_until           TIMESTAMPTZ,

    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- updated_at trigger
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
