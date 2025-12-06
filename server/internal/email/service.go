package email

import (
	"fmt"
	"os"

	"github.com/resend/resend-go/v2"
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
	ResendAPIKey string
}

// LoadConfig loads email configuration from environment variables
func LoadConfig() *Config {
	return &Config{
		FromEmail:    getEnv("EMAIL_FROM", "noreply@loop.app"),
		FromName:     getEnv("EMAIL_FROM_NAME", "Loop"),
		FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3000"),
		ResendAPIKey: os.Getenv("RESEND_API_KEY"),
	}
}

// NewService creates an email service (Resend if API key is set, otherwise Mock)
func NewService(config *Config) Service {
	if config.ResendAPIKey != "" {
		return NewResendService(config)
	}
	return NewMockService(config)
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

// ResendService implements Service using Resend API
type ResendService struct {
	Config *Config
	Client *resend.Client
}

// NewResendService creates a new Resend email service
func NewResendService(config *Config) *ResendService {
	client := resend.NewClient(config.ResendAPIKey)
	return &ResendService{
		Config: config,
		Client: client,
	}
}

// SendVerificationEmail sends a verification email via Resend
func (s *ResendService) SendVerificationEmail(to, token string) error {
	verificationURL := fmt.Sprintf("%s/verify-email?token=%s", s.Config.FrontendURL, token)

	params := &resend.SendEmailRequest{
		From:    fmt.Sprintf("%s <%s>", s.Config.FromName, s.Config.FromEmail),
		To:      []string{to},
		Subject: "Verify your email",
		Html: fmt.Sprintf(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<title>Verify your email</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
					<h1 style="color: #4F46E5;">Verify your email</h1>
					<p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="%s" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
					</div>
					<p>Or copy and paste this link into your browser:</p>
					<p style="word-break: break-all; color: #666;">%s</p>
					<p style="margin-top: 30px; font-size: 12px; color: #999;">This link will expire in 24 hours.</p>
				</div>
			</body>
			</html>
		`, verificationURL, verificationURL),
		Text: fmt.Sprintf("Verify your email by visiting: %s", verificationURL),
	}

	_, err := s.Client.Emails.Send(params)
	return err
}

// SendPasswordResetEmail sends a password reset email via Resend
func (s *ResendService) SendPasswordResetEmail(to, token string) error {
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.Config.FrontendURL, token)

	params := &resend.SendEmailRequest{
		From:    fmt.Sprintf("%s <%s>", s.Config.FromName, s.Config.FromEmail),
		To:      []string{to},
		Subject: "Reset your password",
		Html: fmt.Sprintf(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<title>Reset your password</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
				<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
					<h1 style="color: #4F46E5;">Reset your password</h1>
					<p>We received a request to reset your password. Click the button below to create a new password:</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="%s" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
					</div>
					<p>Or copy and paste this link into your browser:</p>
					<p style="word-break: break-all; color: #666;">%s</p>
					<p style="margin-top: 30px; font-size: 12px; color: #999;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
				</div>
			</body>
			</html>
		`, resetURL, resetURL),
		Text: fmt.Sprintf("Reset your password by visiting: %s", resetURL),
	}

	_, err := s.Client.Emails.Send(params)
	return err
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
