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
