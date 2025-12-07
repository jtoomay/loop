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

type DBUser struct {
	ID                  string
	Email               string
	PasswordHash        string
	EmailVerifiedAt     sql.NullTime
	FirstName           sql.NullString
	LastName            sql.NullString
	Role                string
	FailedLoginAttempts int
	LockedUntil         sql.NullTime
	CreatedAt           time.Time
	UpdatedAt           time.Time
}

// GetUserByEmail fetches a user by email from the database
func GetUserByEmail(ctx context.Context, db *pgxpool.Pool, email string) (*DBUser, error) {
	var user DBUser
	err := db.QueryRow(ctx, `
		SELECT id, email, password_hash, email_verified_at, 
		       first_name, last_name, role,
		       failed_login_attempts, locked_until, created_at, updated_at
		FROM users
		WHERE email = $1
	`, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.FailedLoginAttempts,
		&user.LockedUntil,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrInvalidPassword
		}
		return nil, err
	}

	return &user, nil
}

// GetUserByID fetches a user by ID from the database
func GetUserByID(ctx context.Context, db *pgxpool.Pool, userID string) (*DBUser, error) {
	var user DBUser
	err := db.QueryRow(ctx, `
		SELECT id, email, password_hash, email_verified_at, 
		       first_name, last_name, role,
		       failed_login_attempts, locked_until, created_at, updated_at
		FROM users
		WHERE id = $1
	`, userID).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.FailedLoginAttempts,
		&user.LockedUntil,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return &user, nil
}

// CreateUser creates a new user in the database
func CreateUser(ctx context.Context, db *pgxpool.Pool, email, passwordHash string, firstName, lastName *string) (*DBUser, error) {
	var user DBUser
	err := db.QueryRow(ctx, `
		INSERT INTO users (email, password_hash, first_name, last_name, role)
		VALUES ($1, $2, $3, $4, 'user')
		RETURNING id, email, password_hash, email_verified_at, 
		          first_name, last_name, role,
		          failed_login_attempts, locked_until, created_at, updated_at
	`, email, passwordHash, firstName, lastName).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.FailedLoginAttempts,
		&user.LockedUntil,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// IncrementFailedLoginAttempts increments the failed login attempts counter
func IncrementFailedLoginAttempts(ctx context.Context, db *pgxpool.Pool, userID string) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET failed_login_attempts = failed_login_attempts + 1
		WHERE id = $1
	`, userID)
	return err
}

// ResetFailedLoginAttempts resets the failed login attempts counter
func ResetFailedLoginAttempts(ctx context.Context, db *pgxpool.Pool, userID string) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET failed_login_attempts = 0, locked_until = NULL
		WHERE id = $1
	`, userID)
	return err
}

// UpdateUser updates the user's first_name and last_name
func UpdateUser(ctx context.Context, db *pgxpool.Pool, userID string, firstName, lastName *string) (*DBUser, error) {
	var user DBUser
	err := db.QueryRow(ctx, `
		UPDATE users
		SET first_name = COALESCE($1, first_name),
		    last_name = COALESCE($2, last_name)
		WHERE id = $3
		RETURNING id, email, password_hash, email_verified_at, 
		          first_name, last_name, role,
		          failed_login_attempts, locked_until, created_at, updated_at
	`, firstName, lastName, userID).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.FailedLoginAttempts,
		&user.LockedUntil,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// IsAccountLocked checks if an account is currently locked
func (u *DBUser) IsAccountLocked() bool {
	if !u.LockedUntil.Valid {
		return false
	}
	return u.LockedUntil.Time.After(time.Now())
}

// RefreshToken represents a refresh token in the database
type RefreshToken struct {
	ID        string
	UserID    string
	Token     string
	ExpiresAt time.Time
	RevokedAt sql.NullTime
	CreatedAt time.Time
}

// CreateRefreshToken creates a new refresh token and stores it in the database
func CreateRefreshToken(ctx context.Context, db *pgxpool.Pool, userID string) (string, error) {
	// Generate a secure random token (32 bytes = 256 bits)
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return "", err
	}
	token := base64.URLEncoding.EncodeToString(tokenBytes)

	// Set expiration (default 7 days, configurable via env)
	expiration := 7 * 24 * time.Hour
	if days := os.Getenv("REFRESH_TOKEN_EXPIRES_DAYS"); days != "" {
		if d, err := strconv.Atoi(days); err == nil {
			expiration = time.Duration(d) * 24 * time.Hour
		}
	}
	expiresAt := time.Now().Add(expiration)

	// Store in database
	var id string
	err := db.QueryRow(ctx, `
		INSERT INTO refresh_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		RETURNING id
	`, userID, token, expiresAt).Scan(&id)

	if err != nil {
		return "", err
	}

	return token, nil
}

// ValidateRefreshToken checks if a refresh token is valid (exists, not expired, not revoked)
func ValidateRefreshToken(ctx context.Context, db *pgxpool.Pool, token string) (*RefreshToken, error) {
	var rt RefreshToken
	err := db.QueryRow(ctx, `
		SELECT id, user_id, token, expires_at, revoked_at, created_at
		FROM refresh_tokens
		WHERE token = $1
	`, token).Scan(
		&rt.ID,
		&rt.UserID,
		&rt.Token,
		&rt.ExpiresAt,
		&rt.RevokedAt,
		&rt.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("invalid refresh token")
		}
		return nil, err
	}

	// Check if revoked
	if rt.RevokedAt.Valid {
		return nil, errors.New("refresh token has been revoked")
	}

	// Check if expired
	if time.Now().After(rt.ExpiresAt) {
		return nil, errors.New("refresh token has expired")
	}

	return &rt, nil
}

// RevokeRefreshToken marks a refresh token as revoked
func RevokeRefreshToken(ctx context.Context, db *pgxpool.Pool, token string) error {
	_, err := db.Exec(ctx, `
		UPDATE refresh_tokens
		SET revoked_at = NOW()
		WHERE token = $1 AND revoked_at IS NULL
	`, token)
	return err
}

// RevokeAllUserRefreshTokens revokes all refresh tokens for a user (useful for logout)
func RevokeAllUserRefreshTokens(ctx context.Context, db *pgxpool.Pool, userID string) error {
	_, err := db.Exec(ctx, `
		UPDATE refresh_tokens
		SET revoked_at = NOW()
		WHERE user_id = $1 AND revoked_at IS NULL
	`, userID)
	return err
}
