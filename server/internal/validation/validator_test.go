package validation

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValidateEmail(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		wantErr bool
	}{
		{
			name:    "valid email",
			email:   "user@example.com",
			wantErr: false,
		},
		{
			name:    "valid email with subdomain",
			email:   "user@mail.example.com",
			wantErr: false,
		},
		{
			name:    "valid email with plus",
			email:   "user+tag@example.com",
			wantErr: false,
		},
		{
			name:    "valid email with dots",
			email:   "user.name@example.com",
			wantErr: false,
		},
		{
			name:    "invalid email - no @",
			email:   "userexample.com",
			wantErr: true,
		},
		{
			name:    "invalid email - no domain",
			email:   "user@",
			wantErr: true,
		},
		{
			name:    "invalid email - no TLD",
			email:   "user@example",
			wantErr: true,
		},
		{
			name:    "invalid email - empty",
			email:   "",
			wantErr: true,
		},
		{
			name:    "invalid email - just @",
			email:   "@",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateEmail(tt.email)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Equal(t, ErrInvalidEmail, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestValidatePassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		{
			name:     "valid password - 8 chars",
			password: "password",
			wantErr:  false,
		},
		{
			name:     "valid password - long",
			password: "thisisalongpassword123",
			wantErr:  false,
		},
		{
			name:     "invalid password - too short",
			password: "short",
			wantErr:  true,
		},
		{
			name:     "invalid password - 7 chars",
			password: "passwor",
			wantErr:  true,
		},
		{
			name:     "invalid password - empty",
			password: "",
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidatePassword(tt.password)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Equal(t, ErrPasswordTooShort, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
