package auth

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreateEmailVerificationToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "verify@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create verification token
	token, err := CreateEmailVerificationToken(ctx, db, user.ID)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Create another token (should work)
	token2, err := CreateEmailVerificationToken(ctx, db, user.ID)
	require.NoError(t, err)
	assert.NotEmpty(t, token2)
	assert.NotEqual(t, token, token2) // Tokens should be unique
}

func TestValidateEmailVerificationToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "validate@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create token
	token, err := CreateEmailVerificationToken(ctx, db, user.ID)
	require.NoError(t, err)

	// Validate token
	et, err := ValidateEmailVerificationToken(ctx, db, token)
	require.NoError(t, err)
	assert.Equal(t, user.ID, et.UserID)
	assert.Equal(t, token, et.Token)
	assert.False(t, et.UsedAt.Valid) // Not used yet

	// Try to validate invalid token
	_, err = ValidateEmailVerificationToken(ctx, db, "invalid-token")
	assert.Error(t, err)

	// Mark token as used
	err = MarkEmailVerificationTokenAsUsed(ctx, db, et.ID)
	require.NoError(t, err)

	// Try to validate used token (should fail)
	_, err = ValidateEmailVerificationToken(ctx, db, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "already been used")
}

func TestVerifyUserEmail(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "verifyemail@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)
	assert.False(t, IsEmailVerified(user.EmailVerifiedAt))

	// Verify email
	err = VerifyUserEmail(ctx, db, user.ID)
	require.NoError(t, err)

	// Get user again and check
	verifiedUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.True(t, IsEmailVerified(verifiedUser.EmailVerifiedAt))
}

func TestExpiredEmailVerificationToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "expired@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create token
	token, err := CreateEmailVerificationToken(ctx, db, user.ID)
	require.NoError(t, err)

	// Manually expire the token
	_, err = db.Exec(ctx, `
		UPDATE email_verification_tokens
		SET expires_at = NOW() - INTERVAL '1 day'
		WHERE token = $1
	`, token)
	require.NoError(t, err)

	// Try to validate expired token (should fail)
	_, err = ValidateEmailVerificationToken(ctx, db, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "expired")
}
