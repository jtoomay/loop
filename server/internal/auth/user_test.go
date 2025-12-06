package auth

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreateUser(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "test@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g=" // dummy hash for testing
	firstName := "Test"
	lastName := "User"

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, &firstName, &lastName)
	require.NoError(t, err)
	assert.NotEmpty(t, user.ID)
	assert.Equal(t, email, user.Email)
	assert.Equal(t, passwordHash, user.PasswordHash)
	assert.True(t, user.FirstName.Valid)
	assert.Equal(t, firstName, user.FirstName.String)
	assert.True(t, user.LastName.Valid)
	assert.Equal(t, lastName, user.LastName.String)

	// Try to create duplicate user (should fail)
	_, err = CreateUser(ctx, db, email, passwordHash, nil, nil)
	assert.Error(t, err)
}

func TestGetUserByEmail(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "getbyemail@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user first
	createdUser, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Get user by email
	user, err := GetUserByEmail(ctx, db, email)
	require.NoError(t, err)
	assert.Equal(t, createdUser.ID, user.ID)
	assert.Equal(t, email, user.Email)

	// Try to get non-existent user
	_, err = GetUserByEmail(ctx, db, "nonexistent@example.com")
	assert.Error(t, err)
	assert.ErrorIs(t, err, ErrInvalidPassword) // Our function returns this for not found
}

func TestGetUserByID(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "getbyid@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user first
	createdUser, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Get user by ID
	user, err := GetUserByID(ctx, db, createdUser.ID)
	require.NoError(t, err)
	assert.Equal(t, createdUser.ID, user.ID)
	assert.Equal(t, email, user.Email)

	// Try to get non-existent user
	_, err = GetUserByID(ctx, db, "00000000-0000-0000-0000-000000000000")
	assert.Error(t, err)
}

func TestUpdateUser(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "update@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	createdUser, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Update first name only
	firstName := "Updated"
	updatedUser, err := UpdateUser(ctx, db, createdUser.ID, &firstName, nil)
	require.NoError(t, err)
	assert.True(t, updatedUser.FirstName.Valid)
	assert.Equal(t, firstName, updatedUser.FirstName.String)
	// Last name should still be null
	assert.False(t, updatedUser.LastName.Valid)

	// Update last name
	lastName := "Name"
	updatedUser2, err := UpdateUser(ctx, db, createdUser.ID, nil, &lastName)
	require.NoError(t, err)
	assert.Equal(t, firstName, updatedUser2.FirstName.String) // Should be preserved
	assert.True(t, updatedUser2.LastName.Valid)
	assert.Equal(t, lastName, updatedUser2.LastName.String)
}

func TestAccountLockout(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "lockout@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Initially not locked
	assert.False(t, user.IsAccountLocked())

	// Increment failed attempts
	err = IncrementFailedLoginAttempts(ctx, db, user.ID)
	require.NoError(t, err)

	// Lock the account manually for testing
	lockUntil := time.Now().Add(15 * time.Minute)
	_, err = db.Exec(ctx, `
		UPDATE users
		SET locked_until = $1
		WHERE id = $2
	`, lockUntil, user.ID)
	require.NoError(t, err)

	// Get user again and check if locked
	lockedUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.True(t, lockedUser.IsAccountLocked())

	// Reset failed attempts
	err = ResetFailedLoginAttempts(ctx, db, user.ID)
	require.NoError(t, err)

	// Get user again - should not be locked
	resetUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.False(t, resetUser.IsAccountLocked())
	assert.Equal(t, 0, resetUser.FailedLoginAttempts)
}
