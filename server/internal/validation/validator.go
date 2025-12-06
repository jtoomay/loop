package validation

import (
	"errors"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
)

var (
	validate  *validator.Validate
	emailRegex *regexp.Regexp
)

func init() {
	validate = validator.New()
	// RFC 5322 compliant email regex (simplified but effective)
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
}

var (
	ErrInvalidEmail    = errors.New("invalid email format")
	ErrPasswordTooShort = errors.New("password must be at least 8 characters long")
)

// ValidateEmail validates an email address using regex
func ValidateEmail(email string) error {
	email = strings.ToLower(strings.TrimSpace(email))
	if !emailRegex.MatchString(email) {
		return ErrInvalidEmail
	}
	return nil
}

// ValidatePassword validates password strength
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return ErrPasswordTooShort
	}
	return nil
}

// ValidateStruct validates a struct using the validator library
func ValidateStruct(s interface{}) error {
	return validate.Struct(s)
}

