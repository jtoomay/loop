// internal/auth/errors.go
package auth

import (
	"context"
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

var (
	ErrUnauthorized = errors.New("unauthorized")
	ErrForbidden    = errors.New("forbidden")
)

func Unauthorized(ctx context.Context, msg ...string) error {
	text := "Authentication required"
	if len(msg) > 0 {
		text = msg[0]
	}
	graphql.AddError(ctx, &gqlerror.Error{
		Message: text,
		Extensions: map[string]interface{}{
			"code": "UNAUTHENTICATED",
		},
	})
	return ErrUnauthorized
}

func Forbidden(ctx context.Context, msg ...string) error {
	text := "You do not have permission to perform this action"
	if len(msg) > 0 {
		text = msg[0]
	}
	graphql.AddError(ctx, &gqlerror.Error{
		Message: text,
		Extensions: map[string]interface{}{
			"code": "FORBIDDEN",
		},
	})
	return ErrForbidden
}
