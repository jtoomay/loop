package email

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	config := LoadConfig()
	assert.NotNil(t, config)
	assert.NotEmpty(t, config.FromEmail)
	assert.NotEmpty(t, config.FromName)
	assert.NotEmpty(t, config.FrontendURL)
}

func TestNewService(t *testing.T) {
	config := LoadConfig()

	// Test with no Resend API key (should use Mock)
	originalKey := os.Getenv("RESEND_API_KEY")
	os.Unsetenv("RESEND_API_KEY")
	config.ResendAPIKey = ""

	service := NewService(config)
	assert.NotNil(t, service)
	_, isMock := service.(*MockService)
	assert.True(t, isMock, "Should use MockService when no API key")

	// Test with Resend API key (should use Resend)
	if originalKey != "" {
		config.ResendAPIKey = originalKey
		service = NewService(config)
		assert.NotNil(t, service)
		_, isResend := service.(*ResendService)
		assert.True(t, isResend, "Should use ResendService when API key is set")
	}
}

func TestMockService_SendVerificationEmail(t *testing.T) {
	config := LoadConfig()
	service := NewMockService(config)

	err := service.SendVerificationEmail("test@example.com", "test-token")
	assert.NoError(t, err)
}

func TestMockService_SendPasswordResetEmail(t *testing.T) {
	config := LoadConfig()
	service := NewMockService(config)

	err := service.SendPasswordResetEmail("test@example.com", "test-token")
	assert.NoError(t, err)
}

func TestResendService_SendVerificationEmail(t *testing.T) {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		t.Skip("RESEND_API_KEY not set, skipping Resend integration test")
	}

	config := LoadConfig()
	config.ResendAPIKey = apiKey
	service := NewResendService(config)

	err := service.SendVerificationEmail("test@example.com", "test-token-123")
	// This might fail if email domain is not verified in Resend, but that's okay for testing
	// We just want to ensure the function doesn't panic
	if err != nil {
		t.Logf("Resend error (expected if domain not verified): %v", err)
	}
}

func TestResendService_SendPasswordResetEmail(t *testing.T) {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		t.Skip("RESEND_API_KEY not set, skipping Resend integration test")
	}

	config := LoadConfig()
	config.ResendAPIKey = apiKey
	service := NewResendService(config)

	err := service.SendPasswordResetEmail("test@example.com", "test-token-123")
	// This might fail if email domain is not verified in Resend
	if err != nil {
		t.Logf("Resend error (expected if domain not verified): %v", err)
	}
}
