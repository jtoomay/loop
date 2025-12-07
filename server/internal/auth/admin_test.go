package auth

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestIsAdmin(t *testing.T) {
	tests := []struct {
		name     string
		user     *DBUser
		expected bool
	}{
		{
			name:     "admin user",
			user:     &DBUser{Role: "admin"},
			expected: true,
		},
		{
			name:     "regular user",
			user:     &DBUser{Role: "user"},
			expected: false,
		},
		{
			name:     "nil user",
			user:     nil,
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := IsAdmin(tt.user)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestRequireAdmin(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()

	// Create regular user
	email := "regular@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="
	regularUser, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Create admin user
	adminEmail := "admin@example.com"
	adminUser, err := CreateUser(ctx, db, adminEmail, passwordHash, nil, nil)
	require.NoError(t, err)
	err = UpdateUserRole(ctx, db, adminUser.ID, "admin")
	require.NoError(t, err)

	// Test with admin user in context
	adminCtx := context.WithValue(ctx, UserKey, &User{ID: adminUser.ID})
	adminCtx = context.WithValue(adminCtx, DBKey, db)
	result, err := RequireAdmin(adminCtx, db)
	require.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "admin", result.Role)

	// Test with regular user in context
	userCtx := context.WithValue(ctx, UserKey, &User{ID: regularUser.ID})
	userCtx = context.WithValue(userCtx, DBKey, db)
	_, err = RequireAdmin(userCtx, db)
	assert.Error(t, err)
	assert.ErrorIs(t, err, ErrNotAdmin)

	// Test without user in context
	_, err = RequireAdmin(ctx, db)
	assert.Error(t, err)
}

func TestUpdateUserRole(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "roleupdate@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)
	assert.Equal(t, "user", user.Role)

	// Update to admin
	err = UpdateUserRole(ctx, db, user.ID, "admin")
	require.NoError(t, err)

	// Verify role was updated
	updatedUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.Equal(t, "admin", updatedUser.Role)

	// Update back to user
	err = UpdateUserRole(ctx, db, user.ID, "user")
	require.NoError(t, err)

	// Verify role was updated
	updatedUser2, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.Equal(t, "user", updatedUser2.Role)
}

func TestLockUser(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "locktest@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)
	assert.False(t, user.IsAccountLocked())

	// Lock user for 60 minutes
	err = LockUser(ctx, db, user.ID, 60)
	require.NoError(t, err)

	// Verify user is locked
	lockedUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.True(t, lockedUser.IsAccountLocked())
}

func TestUnlockUser(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "unlocktest@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Lock user first
	err = LockUser(ctx, db, user.ID, 60)
	require.NoError(t, err)

	// Unlock user
	err = UnlockUser(ctx, db, user.ID)
	require.NoError(t, err)

	// Verify user is unlocked
	unlockedUser, err := GetUserByID(ctx, db, user.ID)
	require.NoError(t, err)
	assert.False(t, unlockedUser.IsAccountLocked())
	assert.Equal(t, 0, unlockedUser.FailedLoginAttempts)
}

func TestDeleteUser(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	email := "deletetest@example.com"
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create user
	user, err := CreateUser(ctx, db, email, passwordHash, nil, nil)
	require.NoError(t, err)

	// Delete user
	err = DeleteUser(ctx, db, user.ID)
	require.NoError(t, err)

	// Verify user is deleted
	_, err = GetUserByID(ctx, db, user.ID)
	assert.Error(t, err)
}

func TestGetAllUsers(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping database tests in short mode")
	}

	db := SetupTestDB(t)
	defer CleanupTestDB(t, db)

	ctx := context.Background()
	passwordHash := "$argon2id$v=19$m=65536,t=1,p=4$dGVzdHNhbHQ$dGVzdGhhc2g="

	// Create multiple users
	_, err := CreateUser(ctx, db, "user1@example.com", passwordHash, nil, nil)
	require.NoError(t, err)
	_, err = CreateUser(ctx, db, "user2@example.com", passwordHash, nil, nil)
	require.NoError(t, err)
	_, err = CreateUser(ctx, db, "user3@example.com", passwordHash, nil, nil)
	require.NoError(t, err)

	// Get all users
	users, err := GetAllUsers(ctx, db, 10, 0)
	require.NoError(t, err)
	assert.GreaterOrEqual(t, len(users), 3)

	// Verify all users have role field
	for _, u := range users {
		assert.NotEmpty(t, u.Role)
		assert.Contains(t, []string{"user", "admin"}, u.Role)
	}

	// Test pagination
	usersPage1, err := GetAllUsers(ctx, db, 2, 0)
	require.NoError(t, err)
	assert.Equal(t, 2, len(usersPage1))

	usersPage2, err := GetAllUsers(ctx, db, 2, 2)
	require.NoError(t, err)
	assert.GreaterOrEqual(t, len(usersPage2), 1)
}
