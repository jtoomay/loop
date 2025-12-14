package graph

import (
	"context"
	"maps"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/brightsidedeveloper/loop/graph/model"
	"github.com/brightsidedeveloper/loop/internal/auth"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// dbUserToModel converts a DBUser to a GraphQL User model
func dbUserToModel(dbUser *auth.DBUser) *model.User {
	var firstName, lastName *string
	if dbUser.FirstName.Valid {
		firstName = &dbUser.FirstName.String
	}
	if dbUser.LastName.Valid {
		lastName = &dbUser.LastName.String
	}

	var role model.UserRole
	if dbUser.Role == "admin" {
		role = model.UserRoleAdmin
	} else {
		role = model.UserRoleUser
	}

	return &model.User{
		ID:            dbUser.ID,
		Email:         dbUser.Email,
		EmailVerified: auth.IsEmailVerified(dbUser.EmailVerifiedAt),
		FirstName:     firstName,
		LastName:      lastName,
		Role:          role,
		Locked:        dbUser.IsAccountLocked(),
		CreatedAt:     dbUser.CreatedAt.Format(time.RFC3339),
	}
}

// Error codes as constants
const (
	ErrorCodeInvalidInput       = "INVALID_INPUT"
	ErrorCodeInvalidCredentials = "INVALID_CREDENTIALS"
	ErrorCodeUnauthenticated    = "UNAUTHENTICATED"
	ErrorCodeForbidden          = "FORBIDDEN"
	ErrorCodeAlreadyExists      = "ALREADY_EXISTS"
	ErrorCodeInvalidToken       = "INVALID_TOKEN"
	ErrorCodeAccountLocked      = "ACCOUNT_LOCKED"
	ErrorCodeAlreadyVerified    = "ALREADY_VERIFIED"
)

// AddError adds a GraphQL error with the given code, message, and optional extensions.
// If extensions is nil, only the code will be included. If provided, the code will be merged into extensions.
//
// Example usage:
//
//	AddError(ctx, ErrorCodeInvalidInput, "Invalid email format")
//	AddError(ctx, ErrorCodeInvalidInput, "Invalid email format", map[string]any{"field": "email", "reason": "malformed"})
func AddError(ctx context.Context, code string, message string, extensions ...map[string]any) {
	ext := make(map[string]any)
	ext["code"] = code

	// Merge any additional extensions
	for _, e := range extensions {
		maps.Copy(ext, e)
	}

	graphql.AddError(ctx, &gqlerror.Error{
		Message:    message,
		Extensions: ext,
	})
}

// AddInvalidInputError adds an INVALID_INPUT error
func AddInvalidInputError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeInvalidInput, message, extensions...)
}

// AddInvalidCredentialsError adds an INVALID_CREDENTIALS error
func AddInvalidCredentialsError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeInvalidCredentials, message, extensions...)
}

// AddUnauthenticatedError adds an UNAUTHENTICATED error
func AddUnauthenticatedError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeUnauthenticated, message, extensions...)
}

// AddForbiddenError adds a FORBIDDEN error
func AddForbiddenError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeForbidden, message, extensions...)
}

// AddAlreadyExistsError adds an ALREADY_EXISTS error
func AddAlreadyExistsError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeAlreadyExists, message, extensions...)
}

// AddInvalidTokenError adds an INVALID_TOKEN error
func AddInvalidTokenError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeInvalidToken, message, extensions...)
}

// AddAccountLockedError adds an ACCOUNT_LOCKED error
func AddAccountLockedError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeAccountLocked, message, extensions...)
}

// AddAlreadyVerifiedError adds an ALREADY_VERIFIED error
func AddAlreadyVerifiedError(ctx context.Context, message string, extensions ...map[string]any) {
	AddError(ctx, ErrorCodeAlreadyVerified, message, extensions...)
}
