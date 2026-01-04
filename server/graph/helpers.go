package graph

import (
	"context"
	"database/sql"
	"errors"
	"maps"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/brightsidedeveloper/loop/graph/model"
	"github.com/brightsidedeveloper/loop/internal/auth"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// DBHabit represents a habit from the database
type DBHabit struct {
	ID              string
	UserID          string
	Title           string
	Description     sql.NullString
	CreatedAt       time.Time
	UpdatedAt       time.Time
	Days            []int32
	Time            string
	Priority        int32
	Streak          int32
	LongestStreak   int32
	LastCompletedAt sql.NullTime
	Skipped         bool
	Completed       bool
}

// dbUserToModel converts a DBUser to a GraphQL User model
func dbUserToModel(dbUser *auth.DBUser) *model.User {
	var firstName, lastName *string
	if dbUser.FirstName.Valid {
		firstName = &dbUser.FirstName.String
	}
	if dbUser.LastName.Valid {
		lastName = &dbUser.LastName.String
	}

	var role model.UserRole
	if dbUser.Role == "admin" {
		role = model.UserRoleAdmin
	} else {
		role = model.UserRoleUser
	}

	return &model.User{
		ID:            dbUser.ID,
		Email:         dbUser.Email,
		EmailVerified: auth.IsEmailVerified(dbUser.EmailVerifiedAt),
		FirstName:     firstName,
		LastName:      lastName,
		Role:          role,
		Locked:        dbUser.IsAccountLocked(),
		CreatedAt:     dbUser.CreatedAt.Format(time.RFC3339),
	}
}

// dbHabitToModel converts a DBHabit to a GraphQL Habit model
func dbHabitToModel(dbHabit *DBHabit) *model.Habit {
	var description *string
	if dbHabit.Description.Valid {
		description = &dbHabit.Description.String
	}

	var lastCompletedAt *string
	if dbHabit.LastCompletedAt.Valid {
		formatted := dbHabit.LastCompletedAt.Time.Format(time.RFC3339)
		lastCompletedAt = &formatted
	}

	// Convert []int32 to []int
	days := make([]int32, len(dbHabit.Days))
	for i, d := range dbHabit.Days {
		days[i] = int32(d)
	}

	return &model.Habit{
		ID:              dbHabit.ID,
		Title:           dbHabit.Title,
		Description:     description,
		Days:            days,
		Time:            dbHabit.Time,
		Priority:        int32(dbHabit.Priority),
		Streak:          int32(dbHabit.Streak),
		LongestStreak:   int32(dbHabit.LongestStreak),
		LastCompletedAt: lastCompletedAt,
		CreatedAt:       dbHabit.CreatedAt.Format(time.RFC3339),
		UpdatedAt:       dbHabit.UpdatedAt.Format(time.RFC3339),
		Skipped:         dbHabit.Skipped,
		Completed:       dbHabit.Completed,
	}
}

const (
	ErrorCodeInvalidInput       = "INVALID_INPUT"
	ErrorCodeInvalidCredentials = "INVALID_CREDENTIALS"
	ErrorCodeUnauthenticated    = "UNAUTHENTICATED"
	ErrorCodeForbidden          = "FORBIDDEN"
	ErrorCodeAlreadyExists      = "ALREADY_EXISTS"
	ErrorCodeInvalidToken       = "INVALID_TOKEN"
	ErrorCodeAccountLocked      = "ACCOUNT_LOCKED"
	ErrorCodeAlreadyVerified    = "ALREADY_VERIFIED"
)

func AddError(ctx context.Context, code string, message string, extensions ...map[string]any) {
	ext := make(map[string]any)
	ext["code"] = code

	for _, e := range extensions {
		maps.Copy(ext, e)
	}

	graphql.AddError(ctx, &gqlerror.Error{
		Message:    message,
		Extensions: ext,
	})
}

// validateHabitInput validates habit input data
func validateHabitInput(title *string, days []int32, timeStr *string, priority *int32) error {
	if title != nil {
		trimmed := strings.TrimSpace(*title)
		if trimmed == "" {
			return errors.New("title cannot be empty")
		}
		if len(trimmed) > 255 {
			return errors.New("title must be 255 characters or less")
		}
	}

	if days != nil {
		if len(days) == 0 {
			return errors.New("days array cannot be empty")
		}
		// Validate each day is 0-6 (Sunday-Saturday)
		for _, day := range days {
			if day < 0 || day > 6 {
				return errors.New("days must be between 0 (Sunday) and 6 (Saturday)")
			}
		}
		// Check for duplicates
		seen := make(map[int32]bool)
		for _, day := range days {
			if seen[day] {
				return errors.New("days array cannot contain duplicates")
			}
			seen[day] = true
		}
	}

	if timeStr != nil {
		trimmed := strings.TrimSpace(*timeStr)
		if trimmed == "" {
			return errors.New("time cannot be empty")
		}
		// Validate time format (HH:MM:SS or HH:MM)
		_, err := time.Parse("15:04:05", trimmed)
		if err != nil {
			_, err = time.Parse("15:04", trimmed)
			if err != nil {
				return errors.New("time must be in format HH:MM or HH:MM:SS")
			}
		}
	}

	if priority != nil {
		if *priority < 0 {
			return errors.New("priority must be 0 or greater")
		}
	}

	return nil
}

// getCurrentDateInTimezone returns the current date in the specified timezone
// If timezone is empty, defaults to UTC
func getCurrentDateInTimezone(timezone string) string {
	if timezone == "" {
		timezone = "UTC"
	}
	// Validate timezone by trying to load it
	loc, err := time.LoadLocation(timezone)
	if err != nil {
		// Invalid timezone, default to UTC
		timezone = "UTC"
		loc, _ = time.LoadLocation(timezone)
	}
	now := time.Now().In(loc)
	return now.Format("2006-01-02")
}

// getHabitByIDAndUser fetches a habit by ID and verifies it belongs to the user
func getHabitByIDAndUser(ctx context.Context, db *pgxpool.Pool, habitID, userID string) (*DBHabit, error) {
	var habit DBHabit
	err := db.QueryRow(ctx, `
		SELECT id, user_id, title, description, created_at, updated_at,
		       days, time, priority, streak, longest_streak, last_completed_at
		FROM habits
		WHERE id = $1 AND user_id = $2
	`, habitID, userID).Scan(
		&habit.ID,
		&habit.UserID,
		&habit.Title,
		&habit.Description,
		&habit.CreatedAt,
		&habit.UpdatedAt,
		&habit.Days,
		&habit.Time,
		&habit.Priority,
		&habit.Streak,
		&habit.LongestStreak,
		&habit.LastCompletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("habit not found")
		}
		return nil, err
	}

	return &habit, nil
}
