package auth

import (
	"context"
	"os"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
)

// SetupTestDB creates a database connection for testing
// Requires TEST_DATABASE_URL to be set. Database should be cleared and migrated before tests.
func SetupTestDB(t *testing.T) *pgxpool.Pool {
	t.Helper()

	dbURL := os.Getenv("TEST_DATABASE_URL")
	if dbURL == "" {
		t.Skip("TEST_DATABASE_URL not set, skipping database tests. Run 'make test-setup' first.")
	}

	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		t.Fatalf("Failed to create test database pool: %v", err)
	}

	// Test connection
	ctx := context.Background()
	if err := pool.Ping(ctx); err != nil {
		t.Fatalf("Failed to ping test database: %v", err)
	}

	return pool
}

// CleanupTestDB closes the database connection
func CleanupTestDB(t *testing.T, db *pgxpool.Pool) {
	t.Helper()
	if db != nil {
		db.Close()
	}
}
