package auth

import (
	"context"
	"database/sql"
	"errors"
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
		       first_name, last_name,
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
		       first_name, last_name,
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
		INSERT INTO users (email, password_hash, first_name, last_name)
		VALUES ($1, $2, $3, $4)
		RETURNING id, email, password_hash, email_verified_at, 
		          first_name, last_name,
		          failed_login_attempts, locked_until, created_at, updated_at
	`, email, passwordHash, firstName, lastName).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.FirstName,
		&user.LastName,
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
		          first_name, last_name,
		          failed_login_attempts, locked_until, created_at, updated_at
	`, firstName, lastName, userID).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.EmailVerifiedAt,
		&user.FirstName,
		&user.LastName,
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
