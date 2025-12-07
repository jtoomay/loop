package graph

import (
	"context"
	"os"
	"testing"

	"github.com/brightsidedeveloper/loop/graph/model"
	"github.com/brightsidedeveloper/loop/internal/auth"
	"github.com/brightsidedeveloper/loop/internal/email"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestResolver(t *testing.T) (*Resolver, func()) {
	t.Helper()

	// Initialize auth (JWT keys) - skip if keys don't exist
	if _, err := os.Stat("private.pem"); err != nil {
		t.Skip("JWT keys (private.pem) not found, skipping resolver tests. Generate keys with: openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem")
	}
	if _, err := os.Stat("public.pem"); err != nil {
		t.Skip("JWT keys (public.pem) not found, skipping resolver tests. Generate keys with: openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem")
	}
	auth.Init()

	dbURL := os.Getenv("TEST_DATABASE_URL")
	if dbURL == "" {
		t.Skip("TEST_DATABASE_URL not set, skipping integration tests. Run 'make test-setup' first.")
	}

	db, err := pgxpool.New(context.Background(), dbURL)
	require.NoError(t, err)

	emailService := email.NewMockService(email.LoadConfig())

	resolver := &Resolver{
		DB:           db,
		EmailService: emailService,
	}

	cleanup := func() {
		db.Close()
	}

	return resolver, cleanup
}

func TestSignupResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "signup@example.com"
	password := "password123"

	// Test successful signup
	session, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)
	assert.NotEmpty(t, session.AccessToken)
	assert.NotEmpty(t, session.RefreshToken)

	// Test duplicate email
	_, err = resolver.Mutation().Signup(ctx, email, password)
	assert.Error(t, err)

	// Test invalid email
	_, err = resolver.Mutation().Signup(ctx, "invalid-email", password)
	assert.Error(t, err)

	// Test short password
	_, err = resolver.Mutation().Signup(ctx, "new@example.com", "short")
	assert.Error(t, err)
}

func TestLoginResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "login@example.com"
	password := "password123"

	// Create user first via signup
	_, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)

	// Test successful login
	session, err := resolver.Mutation().Login(ctx, email, password)
	require.NoError(t, err)
	assert.NotEmpty(t, session.AccessToken)
	assert.NotEmpty(t, session.RefreshToken)

	// Test wrong password
	_, err = resolver.Mutation().Login(ctx, email, "wrongpassword")
	assert.Error(t, err)

	// Test non-existent user (should not reveal if user exists)
	_, err = resolver.Mutation().Login(ctx, "nonexistent@example.com", password)
	assert.Error(t, err)
}

func TestMeResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "me@example.com"
	password := "password123"

	// Create user
	_, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)

	// Create context with user (simulating auth middleware)
	authUser := &auth.User{ID: ""} // We need to extract user ID from token
	// For now, let's get user by email to get ID
	dbUser, err := auth.GetUserByEmail(ctx, resolver.DB, email)
	require.NoError(t, err)

	authUser.ID = dbUser.ID
	userCtx := context.WithValue(ctx, auth.UserKey, authUser)

	// Test me query
	user, err := resolver.Query().Me(userCtx)
	require.NoError(t, err)
	assert.Equal(t, email, user.Email)
	assert.Equal(t, dbUser.ID, user.ID)
	assert.Equal(t, model.UserRoleUser, user.Role) // Default role should be USER

	// Test without auth (should fail)
	_, err = resolver.Query().Me(ctx)
	assert.Error(t, err)
}

func TestUpdateUserResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "update@example.com"
	password := "password123"

	// Create user
	_, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)

	// Get user ID
	dbUser, err := auth.GetUserByEmail(ctx, resolver.DB, email)
	require.NoError(t, err)

	authUser := &auth.User{ID: dbUser.ID}
	userCtx := context.WithValue(ctx, auth.UserKey, authUser)

	// Update user
	firstName := "John"
	lastName := "Doe"
	updatedUser, err := resolver.Mutation().UpdateUser(userCtx, model.UpdateUserInput{
		FirstName: &firstName,
		LastName:  &lastName,
	})
	require.NoError(t, err)
	assert.Equal(t, firstName, *updatedUser.FirstName)
	assert.Equal(t, lastName, *updatedUser.LastName)

	// Update only first name
	firstName2 := "Jane"
	updatedUser2, err := resolver.Mutation().UpdateUser(userCtx, model.UpdateUserInput{
		FirstName: &firstName2,
	})
	require.NoError(t, err)
	assert.Equal(t, firstName2, *updatedUser2.FirstName)
	assert.Equal(t, lastName, *updatedUser2.LastName) // Should be preserved
}

func TestEmailVerificationResolvers(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "verify@example.com"
	password := "password123"

	// Create user
	_, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)

	// Get user ID
	dbUser, err := auth.GetUserByEmail(ctx, resolver.DB, email)
	require.NoError(t, err)

	authUser := &auth.User{ID: dbUser.ID}
	userCtx := context.WithValue(ctx, auth.UserKey, authUser)

	// Send verification email
	sent, err := resolver.Mutation().SendVerificationEmail(userCtx)
	require.NoError(t, err)
	assert.True(t, sent)

	// Get the token from database (for testing)
	tokens, err := resolver.DB.Query(ctx, `
		SELECT token FROM email_verification_tokens
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 1
	`, dbUser.ID)
	require.NoError(t, err)
	defer tokens.Close()

	var token string
	require.True(t, tokens.Next())
	err = tokens.Scan(&token)
	require.NoError(t, err)

	// Verify email
	verified, err := resolver.Mutation().VerifyEmail(ctx, token)
	require.NoError(t, err)
	assert.True(t, verified)

	// Try to verify again (should fail - token already used)
	_, err = resolver.Mutation().VerifyEmail(ctx, token)
	assert.Error(t, err)
}

func TestPasswordResetResolvers(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "reset@example.com"
	password := "password123"
	newPassword := "newpassword123"

	// Create user
	_, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)

	// Request password reset
	sent, err := resolver.Mutation().ForgotPassword(ctx, email)
	require.NoError(t, err)
	assert.True(t, sent)

	// Get the token from database
	dbUser, err := auth.GetUserByEmail(ctx, resolver.DB, email)
	require.NoError(t, err)

	tokens, err := resolver.DB.Query(ctx, `
		SELECT token FROM password_reset_tokens
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 1
	`, dbUser.ID)
	require.NoError(t, err)
	defer tokens.Close()

	var token string
	require.True(t, tokens.Next())
	err = tokens.Scan(&token)
	require.NoError(t, err)

	// Reset password
	reset, err := resolver.Mutation().ResetPassword(ctx, token, newPassword)
	require.NoError(t, err)
	assert.True(t, reset)

	// Try to login with new password
	session, err := resolver.Mutation().Login(ctx, email, newPassword)
	require.NoError(t, err)
	assert.NotEmpty(t, session.AccessToken)

	// Old password should not work
	_, err = resolver.Mutation().Login(ctx, email, password)
	assert.Error(t, err)
}

func TestChangePasswordResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "changepass@example.com"
	oldPassword := "password123"
	newPassword := "newpassword123"

	// Create user
	_, err := resolver.Mutation().Signup(ctx, email, oldPassword)
	require.NoError(t, err)

	// Get user ID
	dbUser, err := auth.GetUserByEmail(ctx, resolver.DB, email)
	require.NoError(t, err)

	authUser := &auth.User{ID: dbUser.ID}
	userCtx := context.WithValue(ctx, auth.UserKey, authUser)

	// Change password
	changed, err := resolver.Mutation().ChangePassword(userCtx, oldPassword, newPassword)
	require.NoError(t, err)
	assert.True(t, changed)

	// Try to login with new password
	session, err := resolver.Mutation().Login(ctx, email, newPassword)
	require.NoError(t, err)
	assert.NotEmpty(t, session.AccessToken)

	// Old password should not work
	_, err = resolver.Mutation().Login(ctx, email, oldPassword)
	assert.Error(t, err)

	// Try to change with wrong old password
	_, err = resolver.Mutation().ChangePassword(userCtx, "wrongpassword", "anotherpassword")
	assert.Error(t, err)
}

func TestRefreshTokenResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "refresh@example.com"
	password := "password123"

	// Create user and login
	session, err := resolver.Mutation().Login(ctx, email, password)
	if err != nil {
		// User might not exist, create it first
		_, err = resolver.Mutation().Signup(ctx, email, password)
		require.NoError(t, err)
		session, err = resolver.Mutation().Login(ctx, email, password)
		require.NoError(t, err)
	}

	refreshToken := session.RefreshToken
	require.NotEmpty(t, refreshToken)

	// Refresh token
	newSession, err := resolver.Mutation().RefreshToken(ctx, refreshToken)
	require.NoError(t, err)
	assert.NotEmpty(t, newSession.AccessToken)
	assert.NotEmpty(t, newSession.RefreshToken)
	assert.NotEqual(t, refreshToken, newSession.RefreshToken) // Token rotation

	// Old refresh token should be invalid
	_, err = resolver.Mutation().RefreshToken(ctx, refreshToken)
	assert.Error(t, err)
}

func TestLogoutResolver(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	email := "logout@example.com"
	password := "password123"

	// Create user
	_, err := resolver.Mutation().Signup(ctx, email, password)
	require.NoError(t, err)

	// Get user ID
	dbUser, err := auth.GetUserByEmail(ctx, resolver.DB, email)
	require.NoError(t, err)

	authUser := &auth.User{ID: dbUser.ID}
	userCtx := context.WithValue(ctx, auth.UserKey, authUser)

	// Create some refresh tokens
	_, err = auth.CreateRefreshToken(ctx, resolver.DB, dbUser.ID)
	require.NoError(t, err)
	_, err = auth.CreateRefreshToken(ctx, resolver.DB, dbUser.ID)
	require.NoError(t, err)

	// Logout
	loggedOut, err := resolver.Mutation().Logout(userCtx)
	require.NoError(t, err)
	assert.True(t, loggedOut)

	// All refresh tokens should be revoked
	tokens, err := resolver.DB.Query(ctx, `
		SELECT COUNT(*) FROM refresh_tokens
		WHERE user_id = $1 AND revoked_at IS NULL
	`, dbUser.ID)
	require.NoError(t, err)
	defer tokens.Close()

	var count int
	require.True(t, tokens.Next())
	err = tokens.Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 0, count)
}

func TestAdminQueries(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	password := "password123"

	// Create admin user
	adminEmail := "admin@example.com"
	_, err := resolver.Mutation().Signup(ctx, adminEmail, password)
	require.NoError(t, err)

	// Get admin user and set role
	dbAdmin, err := auth.GetUserByEmail(ctx, resolver.DB, adminEmail)
	require.NoError(t, err)
	err = auth.UpdateUserRole(ctx, resolver.DB, dbAdmin.ID, "admin")
	require.NoError(t, err)

	// Create regular users
	_, err = resolver.Mutation().Signup(ctx, "user1@example.com", password)
	require.NoError(t, err)
	_, err = resolver.Mutation().Signup(ctx, "user2@example.com", password)
	require.NoError(t, err)

	// Set up admin context
	adminUser := &auth.User{ID: dbAdmin.ID}
	adminCtx := context.WithValue(ctx, auth.UserKey, adminUser)
	adminCtx = context.WithValue(adminCtx, auth.DBKey, resolver.DB)

	// Test AllUsers query
	limit := int32(10)
	offset := int32(0)
	usersConn, err := resolver.Query().AllUsers(adminCtx, &limit, &offset)
	require.NoError(t, err)
	assert.GreaterOrEqual(t, len(usersConn.Users), 3) // At least admin + 2 users
	assert.GreaterOrEqual(t, usersConn.TotalCount, 3)

	// Verify all users have role field
	for _, u := range usersConn.Users {
		assert.NotNil(t, u.Role)
		assert.Contains(t, []model.UserRole{model.UserRoleUser, model.UserRoleAdmin}, u.Role)
	}

	// Test User query (get specific user)
	regularUser, err := auth.GetUserByEmail(ctx, resolver.DB, "user1@example.com")
	require.NoError(t, err)
	user, err := resolver.Query().User(adminCtx, regularUser.ID)
	require.NoError(t, err)
	assert.Equal(t, "user1@example.com", user.Email)
	assert.Equal(t, model.UserRoleUser, user.Role)

	// Test SystemStats query
	stats, err := resolver.Query().SystemStats(adminCtx)
	require.NoError(t, err)
	assert.GreaterOrEqual(t, stats.TotalUsers, int32(3))
	assert.GreaterOrEqual(t, stats.AdminUsers, int32(1))
	assert.GreaterOrEqual(t, stats.VerifiedUsers, int32(0))
	assert.GreaterOrEqual(t, stats.LockedUsers, int32(0))

	// Test that non-admin cannot access admin queries
	regularUserEmail := "user1@example.com"
	regularDBUser, err := auth.GetUserByEmail(ctx, resolver.DB, regularUserEmail)
	require.NoError(t, err)
	regularAuthUser := &auth.User{ID: regularDBUser.ID}
	regularCtx := context.WithValue(ctx, auth.UserKey, regularAuthUser)
	regularCtx = context.WithValue(regularCtx, auth.DBKey, resolver.DB)

	limit2 := int32(10)
	offset2 := int32(0)
	_, err = resolver.Query().AllUsers(regularCtx, &limit2, &offset2)
	assert.Error(t, err)

	_, err = resolver.Query().SystemStats(regularCtx)
	assert.Error(t, err)
}

func TestAdminMutations(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping integration tests in short mode")
	}

	resolver, cleanup := setupTestResolver(t)
	defer cleanup()

	ctx := context.Background()
	password := "password123"

	// Create admin user
	adminEmail := "adminmut@example.com"
	_, err := resolver.Mutation().Signup(ctx, adminEmail, password)
	require.NoError(t, err)

	dbAdmin, err := auth.GetUserByEmail(ctx, resolver.DB, adminEmail)
	require.NoError(t, err)
	err = auth.UpdateUserRole(ctx, resolver.DB, dbAdmin.ID, "admin")
	require.NoError(t, err)

	// Create regular user
	targetEmail := "target@example.com"
	_, err = resolver.Mutation().Signup(ctx, targetEmail, password)
	require.NoError(t, err)

	targetUser, err := auth.GetUserByEmail(ctx, resolver.DB, targetEmail)
	require.NoError(t, err)

	// Set up admin context
	adminUser := &auth.User{ID: dbAdmin.ID}
	adminCtx := context.WithValue(ctx, auth.UserKey, adminUser)
	adminCtx = context.WithValue(adminCtx, auth.DBKey, resolver.DB)

	// Test UpdateUserRole
	updatedUser, err := resolver.Mutation().UpdateUserRole(adminCtx, targetUser.ID, model.UserRoleAdmin)
	require.NoError(t, err)
	assert.Equal(t, model.UserRoleAdmin, updatedUser.Role)

	// Verify in database
	dbUser, err := auth.GetUserByID(ctx, resolver.DB, targetUser.ID)
	require.NoError(t, err)
	assert.Equal(t, "admin", dbUser.Role)

	// Test LockUser
	duration := int32(60)
	locked, err := resolver.Mutation().LockUser(adminCtx, targetUser.ID, &duration)
	require.NoError(t, err)
	assert.True(t, locked)

	// Verify user is locked
	lockedDBUser, err := auth.GetUserByID(ctx, resolver.DB, targetUser.ID)
	require.NoError(t, err)
	assert.True(t, lockedDBUser.IsAccountLocked())

	// Test UnlockUser
	unlocked, err := resolver.Mutation().UnlockUser(adminCtx, targetUser.ID)
	require.NoError(t, err)
	assert.True(t, unlocked)

	// Verify user is unlocked
	unlockedDBUser, err := auth.GetUserByID(ctx, resolver.DB, targetUser.ID)
	require.NoError(t, err)
	assert.False(t, unlockedDBUser.IsAccountLocked())

	// Test RevokeUserTokens
	// First create some refresh tokens
	_, err = auth.CreateRefreshToken(ctx, resolver.DB, targetUser.ID)
	require.NoError(t, err)
	_, err = auth.CreateRefreshToken(ctx, resolver.DB, targetUser.ID)
	require.NoError(t, err)

	revoked, err := resolver.Mutation().RevokeUserTokens(adminCtx, targetUser.ID)
	require.NoError(t, err)
	assert.True(t, revoked)

	// Verify tokens are revoked
	var count int
	err = resolver.DB.QueryRow(ctx, `
		SELECT COUNT(*) FROM refresh_tokens
		WHERE user_id = $1 AND revoked_at IS NULL
	`, targetUser.ID).Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 0, count)

	// Test DeleteUser
	deleted, err := resolver.Mutation().DeleteUser(adminCtx, targetUser.ID)
	require.NoError(t, err)
	assert.True(t, deleted)

	// Verify user is deleted
	_, err = auth.GetUserByID(ctx, resolver.DB, targetUser.ID)
	assert.Error(t, err)

	// Test that non-admin cannot access admin mutations
	regularUserEmail := "regular@example.com"
	_, err = resolver.Mutation().Signup(ctx, regularUserEmail, password)
	require.NoError(t, err)

	regularDBUser, err := auth.GetUserByEmail(ctx, resolver.DB, regularUserEmail)
	require.NoError(t, err)
	regularAuthUser := &auth.User{ID: regularDBUser.ID}
	regularCtx := context.WithValue(ctx, auth.UserKey, regularAuthUser)
	regularCtx = context.WithValue(regularCtx, auth.DBKey, resolver.DB)

	// Create another user to test against
	testEmail := "test@example.com"
	_, err = resolver.Mutation().Signup(ctx, testEmail, password)
	require.NoError(t, err)
	testUser, err := auth.GetUserByEmail(ctx, resolver.DB, testEmail)
	require.NoError(t, err)

	_, err = resolver.Mutation().UpdateUserRole(regularCtx, testUser.ID, model.UserRoleAdmin)
	assert.Error(t, err)

	duration2 := int32(60)
	_, err = resolver.Mutation().LockUser(regularCtx, testUser.ID, &duration2)
	assert.Error(t, err)
}
