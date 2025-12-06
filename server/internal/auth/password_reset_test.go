package auth

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreatePasswordResetToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "reset@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create reset token
	token, err := CreatePasswordResetToken(ctx, db, user.ID)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Create another token (should work)
	token2, err := CreatePasswordResetToken(ctx, db, user.ID)
	require.NoError(t, err)
	assert.NotEmpty(t, token2)
	assert.NotEqual(t, token, token2)
}

func TestValidatePasswordResetToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "validatereset@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create token
	token, err := CreatePasswordResetToken(ctx, db, user.ID)
	require.NoError(t, err)

	// Validate token
	prt, err := ValidatePasswordResetToken(ctx, db, token)
	require.NoError(t, err)
	assert.Equal(t, user.ID, prt.UserID)
	assert.Equal(t, token, prt.Token)
	assert.False(t, prt.UsedAt.Valid)

	// Try invalid token
	_, err = ValidatePasswordResetToken(ctx, db, "invalid-token")
	assert.Error(t, err)

	// Mark as used
	err = MarkPasswordResetTokenAsUsed(ctx, db, prt.ID)
	require.NoError(t, err)

	// Try to validate used token (should fail)
	_, err = ValidatePasswordResetToken(ctx, db, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "already been used")
}

func TestUpdateUserPassword(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "updatepass@example.com"
	oldPasswordHash, err := HashPassword("oldpassword123")
	require.NoError(t, err)

	// Create user
	user, err := CreateUser(ctx, db, email, oldPasswordHash, nil, nil)
	require.NoError(t, err)

	// Verify old password works
	valid, err := VerifyPassword("oldpassword123", user.PasswordHash)
	require.NoError(t, err)
	assert.True(t, valid)

	// Update password
	newPasswordHash, err := HashPassword("newpassword123")
	require.NoError(t, err)
	err = UpdateUserPassword(ctx, db, user.ID, newPasswordHash)
	require.NoError(t, err)

	// Get user and verify new password
	updatedUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)

	// Old password should not work
	valid, err = VerifyPassword("oldpassword123", updatedUser.PasswordHash)
	require.NoError(t, err)
	assert.False(t, valid)

	// New password should work
	valid, err = VerifyPassword("newpassword123", updatedUser.PasswordHash)
	require.NoError(t, err)
	assert.True(t, valid)
}

func TestExpiredPasswordResetToken(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "expiredreset@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create token
	token, err := CreatePasswordResetToken(ctx, db, user.ID)
	require.NoError(t, err)

	// Manually expire the token
	_, err = db.Exec(ctx, `
		UPDATE password_reset_tokens
		SET expires_at = NOW() - INTERVAL '1 hour'
		WHERE token = $1
	`, token)
	require.NoError(t, err)

	// Try to validate expired token (should fail)
	_, err = ValidatePasswordResetToken(ctx, db, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "expired")
}
