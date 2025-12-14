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

func AddError(ctx context.Context, code string, message string, extensions ...map[string]any) {
	ext := make(map[string]any)
	ext["code"] = code

	for _, e := range extensions {
		maps.Copy(ext, e)
	}

	graphql.AddError(ctx, &gqlerror.Error{
		Message:    message,
		Extensions: ext,
	})
}
