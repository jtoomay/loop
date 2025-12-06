package config

import (
	"fmt"
	"os"

	"github.com/brightsidedeveloper/loop/internal/logger"
)

// Config holds application configuration
type Config struct {
	Port          string
	DatabaseURL   string
	CORSOrigins   []string
	JWTPrivateKey string
	JWTPublicKey  string
}

// Required environment variables
var requiredEnvVars = []string{
	"PORT",
	"DATABASE_URL",
}

// Load loads and validates configuration from environment
func Load() (*Config, error) {
	config := &Config{}

	// Validate required variables
	for _, envVar := range requiredEnvVars {
		value := os.Getenv(envVar)
		if value == "" {
			return nil, fmt.Errorf("required environment variable %s is not set", envVar)
		}
	}

	config.Port = os.Getenv("PORT")
	config.DatabaseURL = os.Getenv("DATABASE_URL")

	// Optional: CORS origins
	if origins := os.Getenv("CORS_ALLOWED_ORIGINS"); origins != "" {
		// Will be parsed by CORS middleware
	}

	// Validate JWT keys exist (checked in auth.Init, but we can log here)
	if _, err := os.Stat("private.pem"); err != nil {
		logger.Log.Warn().Msg("private.pem not found - JWT signing will fail")
	}
	if _, err := os.Stat("public.pem"); err != nil {
		logger.Log.Warn().Msg("public.pem not found - JWT verification will fail")
	}

	logger.Log.Info().Msg("Configuration loaded successfully")
	return config, nil
}
