-- Drop trigger first
DROP TRIGGER IF EXISTS set_habits_updated_at ON habits;

-- Drop habit_completions indexes
DROP INDEX IF EXISTS idx_habit_completions_habit_created;
DROP INDEX IF EXISTS idx_habit_completions_created_at;
DROP INDEX IF EXISTS idx_habit_completions_habit_id;

-- Drop habit_completions table
DROP TABLE IF EXISTS habit_completions CASCADE;

-- Drop habits indexes
DROP INDEX IF EXISTS idx_habits_last_completed_at;
DROP INDEX IF EXISTS idx_habits_priority;
DROP INDEX IF EXISTS idx_habits_user_id;

-- Drop habits table
DROP TABLE IF EXISTS habits CASCADE;

