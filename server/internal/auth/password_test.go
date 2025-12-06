package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHashPassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		{
			name:     "valid password",
			password: "testpassword123",
			wantErr:  false,
		},
		{
			name:     "password with special characters",
			password: "P@ssw0rd!@#$%",
			wantErr:  false,
		},
		{
			name:     "long password",
			password: "thisisaverylongpasswordthatshouldworkfine123456789",
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hash, err := HashPassword(tt.password)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Empty(t, hash)
			} else {
				require.NoError(t, err)
				assert.NotEmpty(t, hash)
				assert.Contains(t, hash, "$argon2id$")
			}
		})
	}
}

func TestVerifyPassword(t *testing.T) {
	password := "testpassword123"
	hash, err := HashPassword(password)
	require.NoError(t, err)
	require.NotEmpty(t, hash)

	tests := []struct {
		name           string
		password       string
		hash           string
		wantValid      bool
		wantErr        bool
		expectedErrMsg string
	}{
		{
			name:      "correct password",
			password:  password,
			hash:      hash,
			wantValid: true,
			wantErr:   false,
		},
		{
			name:      "incorrect password",
			password:  "wrongpassword",
			hash:      hash,
			wantValid: false,
			wantErr:   false,
		},
		{
			name:           "invalid hash format",
			password:       password,
			hash:           "invalidhash",
			wantValid:      false,
			wantErr:        true,
			expectedErrMsg: "invalid hash format",
		},
		{
			name:           "empty hash",
			password:       password,
			hash:           "",
			wantValid:      false,
			wantErr:        true,
			expectedErrMsg: "invalid hash format",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			valid, err := VerifyPassword(tt.password, tt.hash)
			if tt.wantErr {
				assert.Error(t, err)
				if tt.expectedErrMsg != "" {
					assert.Contains(t, err.Error(), tt.expectedErrMsg)
				}
			} else {
				assert.NoError(t, err)
			}
			assert.Equal(t, tt.wantValid, valid)
		})
	}
}

func TestPasswordHashUniqueness(t *testing.T) {
	// Same password should produce different hashes (due to random salt)
	password := "testpassword123"
	hash1, err1 := HashPassword(password)
	require.NoError(t, err1)

	hash2, err2 := HashPassword(password)
	require.NoError(t, err2)

	// Hashes should be different
	assert.NotEqual(t, hash1, hash2)

	// But both should verify correctly
	valid1, err := VerifyPassword(password, hash1)
	require.NoError(t, err)
	assert.True(t, valid1)

	valid2, err := VerifyPassword(password, hash2)
	require.NoError(t, err)
	assert.True(t, valid2)
}
