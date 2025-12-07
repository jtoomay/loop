package auth

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrNotAdmin = errors.New("admin access required")
)

// IsAdmin checks if a user has admin role
func IsAdmin(user *DBUser) bool {
	return user != nil && user.Role == "admin"
}

// RequireAdmin checks if the current user is an admin
func RequireAdmin(ctx context.Context, db *pgxpool.Pool) (*DBUser, error) {
	user, err := GetUserFromContext(ctx)
	if err != nil {
		return nil, err
	}

	// Get full user from database to check role
	dbUser, err := GetUserByID(ctx, db, user.ID)
	if err != nil {
		return nil, err
	}

	if !IsAdmin(dbUser) {
		return nil, ErrNotAdmin
	}

	return dbUser, nil
}

// GetAllUsers fetches all users with pagination
func GetAllUsers(ctx context.Context, db *pgxpool.Pool, limit, offset int) ([]*DBUser, error) {
	rows, err := db.Query(ctx, `
		SELECT id, email, password_hash, email_verified_at, 
		       first_name, last_name, role,
		       failed_login_attempts, locked_until, created_at, updated_at
		FROM users
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*DBUser
	for rows.Next() {
		var user DBUser
		err := rows.Scan(
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
		users = append(users, &user)
	}

	return users, rows.Err()
}

// GetUserCount returns the total number of users
func GetUserCount(ctx context.Context, db *pgxpool.Pool) (int, error) {
	var count int
	err := db.QueryRow(ctx, `SELECT COUNT(*) FROM users`).Scan(&count)
	return count, err
}

// LockUser locks a user account
func LockUser(ctx context.Context, db *pgxpool.Pool, userID string, durationMinutes int) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET locked_until = NOW() + make_interval(mins => $1)
		WHERE id = $2
	`, durationMinutes, userID)
	return err
}

// UnlockUser unlocks a user account
func UnlockUser(ctx context.Context, db *pgxpool.Pool, userID string) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET locked_until = NULL, failed_login_attempts = 0
		WHERE id = $1
	`, userID)
	return err
}

// DeleteUser deletes a user and all associated data (CASCADE)
func DeleteUser(ctx context.Context, db *pgxpool.Pool, userID string) error {
	_, err := db.Exec(ctx, `DELETE FROM users WHERE id = $1`, userID)
	return err
}

// UpdateUserRole updates a user's role
func UpdateUserRole(ctx context.Context, db *pgxpool.Pool, userID, role string) error {
	_, err := db.Exec(ctx, `
		UPDATE users
		SET role = $1
		WHERE id = $2
	`, role, userID)
	return err
}
