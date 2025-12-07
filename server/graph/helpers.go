package graph

import (
	"time"

	"github.com/brightsidedeveloper/loop/graph/model"
	"github.com/brightsidedeveloper/loop/internal/auth"
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
