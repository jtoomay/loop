package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/brightsidedeveloper/loop/graph"
	"github.com/brightsidedeveloper/loop/graph/directives"
	"github.com/brightsidedeveloper/loop/internal/auth"
	"github.com/brightsidedeveloper/loop/internal/config"
	"github.com/brightsidedeveloper/loop/internal/email"
	"github.com/brightsidedeveloper/loop/internal/logger"
	"github.com/brightsidedeveloper/loop/internal/middleware"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/vektah/gqlparser/v2/ast"
)

func main() {
	loadEnv()
	
	// Load and validate configuration
	cfg, err := config.Load()
	if err != nil {
		logger.Log.Fatal().Err(err).Msg("Configuration validation failed")
	}

	auth.Init()
	db := loadDB()
	defer db.Close()

	emailService := email.NewMockService(email.LoadConfig())

	logger.Log.Info().Str("port", cfg.Port).Msg("Starting server")

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:           db,
		EmailService: emailService,
	},
		Directives: graph.DirectiveRoot{
			Auth: directives.AuthDirective,
		},
	}))

	corsConfig := middleware.LoadCORSConfig()
	
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				origin := r.Header.Get("Origin")
				// Check if origin is allowed
				for _, allowedOrigin := range corsConfig.AllowedOrigins {
					if allowedOrigin == "*" || allowedOrigin == origin {
						return true
					}
				}
				return false
			},
		},
	})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	// Apply CORS, rate limiting, and auth middleware
	queryHandler := middleware.CORS(corsConfig)(
		middleware.RateLimitHTTP(
			auth.Middleware(srv),
		),
	)

	// Health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		// Check database connectivity
		ctx := r.Context()
		if err := db.Ping(ctx); err != nil {
			w.WriteHeader(http.StatusServiceUnavailable)
			w.Write([]byte(`{"status":"unhealthy","database":"disconnected"}`))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy","database":"connected"}`))
	})

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", queryHandler)

	logger.Log.Info().
		Str("port", cfg.Port).
		Msg("Server started. GraphQL playground available at http://localhost:" + cfg.Port)
	
	if err := http.ListenAndServe(":"+cfg.Port, nil); err != nil {
		logger.Log.Fatal().Err(err).Msg("Server failed to start")
	}
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		// .env file is optional, just log a warning
		logger.Log.Warn().Msg(".env file not found, using environment variables")
	}
}

func loadDB() *pgxpool.Pool {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		logger.Log.Fatal().Msg("DATABASE_URL is not set")
	}
	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		logger.Log.Fatal().Err(err).Msg("Error creating database pool")
	}

	logger.Log.Info().Msg("Database connection pool created")
	return pool
}
