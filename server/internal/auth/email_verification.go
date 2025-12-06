package auth

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// EmailVerificationToken represents an email verification token
type EmailVerificationToken struct {
	ID        string
	UserID    string
	Token     string
	ExpiresAt time.Time
	UsedAt    sql.NullTime
	CreatedAt time.Time
}

// CreateEmailVerificationToken creates a new email verification token
func CreateEmailVerificationToken(ctx context.Context, db *pgxpool.Pool, userID string) (string, error) {
	// Generate a secure random token (32 bytes = 256 bits)
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return "", err
	}
	token := base64.URLEncoding.EncodeToString(tokenBytes)

	// Set expiration (default 24 hours, configurable via env)
	expiration := 24 * time.Hour
	if hours := os.Getenv("EMAIL_VERIFICATION_EXPIRES_HOURS"); hours != "" {
		if h, err := strconv.Atoi(hours); err == nil {
			expiration = time.Duration(h) * time.Hour
		}
	}
	expiresAt := time.Now().Add(expiration)

	// Store in database
	var id string
	err := db.QueryRow(ctx, `
		INSERT INTO email_verification_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`, userID, token, expiresAt).Scan(&id)

	if err != nil {
		return "", err
	}

	return token, nil
}

// ValidateEmailVerificationToken validates and marks a token as used
func ValidateEmailVerificationToken(ctx context.Context, db *pgxpool.Pool, token string) (*EmailVerificationToken, error) {
	var et EmailVerificationToken
	err := db.QueryRow(ctx, `
		SELECT id, user_id, token, expires_at, used_at, created_at
		FROM email_verification_tokens
		WHERE token = $1
	`, token).Scan(
		&et.ID,
		&et.UserID,
		&et.Token,
		&et.ExpiresAt,
		&et.UsedAt,
		&et.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("invalid verification token")
		}
		return nil, err
	}

	// Check if already used
	if et.UsedAt.Valid {
		return nil, errors.New("verification token has already been used")
	}

	// Check if expired
	if time.Now().After(et.ExpiresAt) {
		return nil, errors.New("verification token has expired")
	}

	return &et, nil
}

// MarkEmailVerificationTokenAsUsed marks a token as used
func MarkEmailVerificationTokenAsUsed(ctx context.Context, db *pgxpool.Pool, tokenID string) error {
	_, err := db.Exec(ctx, `
		UPDATE email_verification_tokens
		SET used_at = NOW()
		WHERE id = $1
	`, tokenID)
	return err
}

// VerifyUserEmail marks the user's email as verified
func VerifyUserEmail(ctx context.Context, db *pgxpool.Pool, userID string) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET email_verified_at = NOW()
		WHERE id = $1 AND email_verified_at IS NULL
	`, userID)
	return err
}

// IsEmailVerified checks if a user's email is verified
func IsEmailVerified(emailVerifiedAt sql.NullTime) bool {
	return emailVerifiedAt.Valid
}
