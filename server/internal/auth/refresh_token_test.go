package auth

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreateRefreshToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "refresh@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create refresh token
	token, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Create another token (should work - multiple tokens allowed)
	token2, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)
	assert.NotEmpty(t, token2)
	assert.NotEqual(t, token, token2)
}

func TestValidateRefreshToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "validaterefresh@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create token
	token, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)

	// Validate token
	rt, err := ValidateRefreshToken(ctx, db, token)
	require.NoError(t, err)
	assert.Equal(t, user.ID, rt.UserID)
	assert.Equal(t, token, rt.Token)
	assert.False(t, rt.RevokedAt.Valid)
	assert.True(t, rt.ExpiresAt.After(time.Now()))

	// Try invalid token
	_, err = ValidateRefreshToken(ctx, db, "invalid-token")
	assert.Error(t, err)

	// Revoke token
	err = RevokeRefreshToken(ctx, db, token)
	require.NoError(t, err)

	// Try to validate revoked token (should fail)
	_, err = ValidateRefreshToken(ctx, db, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "revoked")
}

func TestRevokeAllUserRefreshTokens(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "revokeall@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create multiple tokens
	token1, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)
	token2, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)
	token3, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)

	// All tokens should be valid
	_, err = ValidateRefreshToken(ctx, db, token1)
	require.NoError(t, err)
	_, err = ValidateRefreshToken(ctx, db, token2)
	require.NoError(t, err)
	_, err = ValidateRefreshToken(ctx, db, token3)
	require.NoError(t, err)

	// Revoke all tokens
	err = RevokeAllUserRefreshTokens(ctx, db, user.ID)
	require.NoError(t, err)

	// All tokens should now be invalid
	_, err = ValidateRefreshToken(ctx, db, token1)
	assert.Error(t, err)
	_, err = ValidateRefreshToken(ctx, db, token2)
	assert.Error(t, err)
	_, err = ValidateRefreshToken(ctx, db, token3)
	assert.Error(t, err)
}

func TestExpiredRefreshToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "expiredrefresh@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create token
	token, err := CreateRefreshToken(ctx, db, user.ID)
	require.NoError(t, err)

	// Manually expire the token
	_, err = db.Exec(ctx, `
		UPDATE refresh_tokens
		SET expires_at = NOW() - INTERVAL '1 day'
		WHERE token = $1
	`, token)
	require.NoError(t, err)

	// Try to validate expired token (should fail)
	_, err = ValidateRefreshToken(ctx, db, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "expired")
}
