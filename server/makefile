PHONY: up down fresh migrate-up migrate-down migrate-create psql gen port test test-short test-coverage test-setup run

include .env
export

up:
	docker compose up -d
down:
	docker compose down
fresh:
	docker compose down -v

migrate-up:
	migrate -path migrations \
	        -database "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DB_PORT}/${POSTGRES_DB}?sslmode=disable" \
	        up

migrate-down:
	migrate -path migrations \
	        -database "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DB_PORT}/${POSTGRES_DB}?sslmode=disable" \
	        down 1

migrate-create:
	@read -p "Enter migration name (snake_case): " name; \
	migrate create -ext sql -dir migrations -seq $$name

psql:
	psql "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${DB_PORT}/${POSTGRES_DB}?sslmode=disable"

gen:
	go tool gqlgen generate

run:
	go run server.go

test:
	go test -v ./...

test-short:
	go test -short -v ./...

test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

test-setup:
	@if [ -z "$$POSTGRES_USER" ] || [ -z "$$POSTGRES_PASSWORD" ] || [ -z "$$DB_PORT" ]; then \
		echo "ERROR: POSTGRES_USER, POSTGRES_PASSWORD, and DB_PORT must be set in .env"; \
		exit 1; \
	fi
	@echo "Setting up test database..."
	@TEST_DB="loop_test"; \
	TEST_DB_URL="postgres://$$POSTGRES_USER:$$POSTGRES_PASSWORD@localhost:$$DB_PORT/$$TEST_DB?sslmode=disable"; \
	echo "Creating test database if it doesn't exist..."; \
	psql "postgres://$$POSTGRES_USER:$$POSTGRES_PASSWORD@localhost:$$DB_PORT/postgres?sslmode=disable" -tc "SELECT 1 FROM pg_database WHERE datname = '$$TEST_DB'" | grep -q 1 || \
	psql "postgres://$$POSTGRES_USER:$$POSTGRES_PASSWORD@localhost:$$DB_PORT/postgres?sslmode=disable" -c "CREATE DATABASE $$TEST_DB"; \
	echo "Clearing test database..."; \
	psql "$$TEST_DB_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>/dev/null || true; \
	echo "Running migrations..."; \
	migrate -path migrations -database "$$TEST_DB_URL" up; \
	echo ""; \
	echo "Test database ready!"; \
	echo "Set in your shell: export TEST_DATABASE_URL=\"$$TEST_DB_URL\""


port:
	ifconfig | grep "inet " | grep -v 127.0.0.1
