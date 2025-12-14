package directives

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/brightsidedeveloper/loop/graph"
	"github.com/brightsidedeveloper/loop/internal/auth"
	"github.com/jackc/pgx/v5/pgxpool"
)

func AdminDirective(ctx context.Context, obj any, next graphql.Resolver) (res any, err error) {
	// Get DB from context
	db, ok := ctx.Value(auth.DBKey).(*pgxpool.Pool)
	if !ok || db == nil {
		return nil, auth.Unauthorized(ctx)
	}

	// Check admin access (this will verify auth and admin status)
	_, err = auth.RequireAdmin(ctx, db)
	if err != nil {
		graph.AddForbiddenError(ctx, "Admin access required")
		return nil, err
	}

	return next(ctx)
}
