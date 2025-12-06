package directives

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/brightsidedeveloper/loop/internal/auth"
)

func AuthDirective(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
	_, err = auth.GetUserFromContext(ctx)
	if err != nil {
		return nil, auth.Unauthorized(ctx)
	}
	return next(ctx)
}
