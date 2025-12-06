package auth

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGenerateAccessToken(t *testing.T) {
	// Set up test keys (in real scenario, these would be test keys)
	// For now, we'll skip if keys don't exist
	if _, err := os.Stat("private.pem"); err != nil {
		t.Skip("JWT keys not found, skipping token generation tests")
	}
	if _, err := os.Stat("public.pem"); err != nil {
		t.Skip("JWT keys not found, skipping token generation tests")
	}

	Init() // Initialize keys

	userID := "test-user-id"
	token, err := GenerateAccessToken(userID)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Verify token can be parsed
	claims := &Claims{}
	parsedToken, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
		return publicKey, nil
	})

	require.NoError(t, err)
	assert.True(t, parsedToken.Valid)
	assert.Equal(t, userID, claims.UserID)
	assert.NotNil(t, claims.ExpiresAt)
	assert.True(t, claims.ExpiresAt.Time.After(time.Now()))
}

func TestGetUserFromContext(t *testing.T) {
	user := &User{ID: "test-user-id"}
	ctx := context.WithValue(context.Background(), UserKey, user)

	// Test getting user from context
	retrievedUser, err := GetUserFromContext(ctx)
	require.NoError(t, err)
	assert.Equal(t, user.ID, retrievedUser.ID)

	// Test without user in context
	emptyCtx := context.Background()
	_, err = GetUserFromContext(emptyCtx)
	assert.Error(t, err)
	assert.Equal(t, ErrInvalidToken, err)

	// Test with nil user
	nilCtx := context.WithValue(context.Background(), UserKey, nil)
	_, err = GetUserFromContext(nilCtx)
	assert.Error(t, err)
}
