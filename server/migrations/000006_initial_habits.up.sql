-- Habits table
CREATE TABLE habits (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT        NOT NULL,
    description       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    days              INT[]       NOT NULL CHECK (array_length(days, 1) > 0),
    time              TIME        NOT NULL,
    priority          INT         NOT NULL,
    streak            INT         NOT NULL DEFAULT 0,
    longest_streak    INT         NOT NULL DEFAULT 0,
    last_completed_at TIMESTAMPTZ
);

-- Index for faster lookups
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_priority ON habits(priority);
CREATE INDEX idx_habits_last_completed_at ON habits(last_completed_at);

-- Trigger to automatically update updated_at
CREATE TRIGGER set_habits_updated_at
    BEFORE UPDATE ON habits
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Habit completions table for tracking completion history
CREATE TABLE habit_completions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id    UUID        NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    skipped     BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for habit_completions
CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_created_at ON habit_completions(created_at);
CREATE INDEX idx_habit_completions_habit_created ON habit_completions(habit_id, created_at);

