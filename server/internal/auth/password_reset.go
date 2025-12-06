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

// PasswordResetToken represents a password reset token
type PasswordResetToken struct {
	ID        string
	UserID    string
	Token     string
	ExpiresAt time.Time
	UsedAt    sql.NullTime
	CreatedAt time.Time
}

// CreatePasswordResetToken creates a new password reset token
func CreatePasswordResetToken(ctx context.Context, db *pgxpool.Pool, userID string) (string, error) {
	// Generate a secure random token (32 bytes = 256 bits)
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return "", err
	}
	token := base64.URLEncoding.EncodeToString(tokenBytes)

	// Set expiration (default 1 hour, configurable via env)
	expiration := 1 * time.Hour
	if hours := os.Getenv("PASSWORD_RESET_EXPIRES_HOURS"); hours != "" {
		if h, err := strconv.Atoi(hours); err == nil {
			expiration = time.Duration(h) * time.Hour
		}
	}
	expiresAt := time.Now().Add(expiration)

	// Store in database
	var id string
	err := db.QueryRow(ctx, `
		INSERT INTO password_reset_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`, userID, token, expiresAt).Scan(&id)

	if err != nil {
		return "", err
	}

	return token, nil
}

// ValidatePasswordResetToken validates and marks a token as used
func ValidatePasswordResetToken(ctx context.Context, db *pgxpool.Pool, token string) (*PasswordResetToken, error) {
	var prt PasswordResetToken
	err := db.QueryRow(ctx, `
		SELECT id, user_id, token, expires_at, used_at, created_at
		FROM password_reset_tokens
		WHERE token = $1
	`, token).Scan(
		&prt.ID,
		&prt.UserID,
		&prt.Token,
		&prt.ExpiresAt,
		&prt.UsedAt,
		&prt.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("invalid reset token")
		}
		return nil, err
	}

	// Check if already used
	if prt.UsedAt.Valid {
		return nil, errors.New("reset token has already been used")
	}

	// Check if expired
	if time.Now().After(prt.ExpiresAt) {
		return nil, errors.New("reset token has expired")
	}

	return &prt, nil
}

// MarkPasswordResetTokenAsUsed marks a token as used
func MarkPasswordResetTokenAsUsed(ctx context.Context, db *pgxpool.Pool, tokenID string) error {
	_, err := db.Exec(ctx, `
		UPDATE password_reset_tokens
		SET used_at = NOW()
		WHERE id = $1
	`, tokenID)
	return err
}

// UpdateUserPassword updates a user's password
func UpdateUserPassword(ctx context.Context, db *pgxpool.Pool, userID, newPasswordHash string) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET password_hash = $1
		WHERE id = $2
	`, newPasswordHash, userID)
	return err
}

