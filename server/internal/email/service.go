package email

import (
	"fmt"
	"os"
)

// Service interface for sending emails
// This allows you to swap implementations (SMTP, SendGrid, AWS SES, etc.)
type Service interface {
	SendVerificationEmail(to, token string) error
	SendPasswordResetEmail(to, token string) error
}

// Config holds email service configuration
type Config struct {
	FromEmail    string
	FromName     string
	FrontendURL  string
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
}

// LoadConfig loads email configuration from environment variables
func LoadConfig() *Config {
	return &Config{
		FromEmail:    getEnv("EMAIL_FROM", "noreply@loop.app"),
		FromName:     getEnv("EMAIL_FROM_NAME", "Loop"),
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3000"),
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     os.Getenv("SMTP_USER"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),
	}
}

// MockService is a simple implementation that logs emails (for development)
// Replace this with a real email service in production
type MockService struct {
	Config *Config
}

// NewMockService creates a new mock email service
func NewMockService(config *Config) *MockService {
	return &MockService{Config: config}
}

// SendVerificationEmail sends a verification email (mock implementation)
func (s *MockService) SendVerificationEmail(to, token string) error {
	verificationURL := fmt.Sprintf("%s/verify-email?token=%s", s.Config.FrontendURL, token)

	// In development, just log it
	// In production, replace this with actual email sending (SMTP, SendGrid, etc.)
	fmt.Printf("\n=== EMAIL VERIFICATION ===\n")
	fmt.Printf("To: %s\n", to)
	fmt.Printf("Subject: Verify your email\n")
	fmt.Printf("Click here to verify: %s\n", verificationURL)
	fmt.Printf("Token: %s\n", token)
	fmt.Printf("=======================\n\n")

	return nil
}

// SendPasswordResetEmail sends a password reset email (mock implementation)
func (s *MockService) SendPasswordResetEmail(to, token string) error {
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.Config.FrontendURL, token)

	// In development, just log it
	fmt.Printf("\n=== PASSWORD RESET EMAIL ===\n")
	fmt.Printf("To: %s\n", to)
	fmt.Printf("Subject: Reset your password\n")
	fmt.Printf("Click here to reset: %s\n", resetURL)
	fmt.Printf("Token: %s\n", token)
	fmt.Printf("==========================\n\n")

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
