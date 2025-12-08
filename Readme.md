# Loop

Full-stack application with React Native mobile client and Go GraphQL server.

## Stack

### Mobile (`/mobile`)

- **Framework**: React Native 0.81.5 with Expo ~54
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript (strict mode)
- **GraphQL**: React Relay 20 with Relay Compiler
- **State**: Relay Store
- **Storage**: Expo Secure Store (JWT tokens)
- **Architecture**: New Architecture enabled, React Compiler enabled

### Server (`/server`)

- **Language**: Go 1.24.1
- **GraphQL**: gqlgen 0.17.84
- **Database**: PostgreSQL (pgx/v5)
- **Auth**: JWT (RSA key pairs)
- **Transport**: HTTP, WebSocket (Gorilla)
- **Email**: Resend
- **Logging**: Zerolog
- **Middleware**: CORS, rate limiting (ulule/limiter), request logging
- **Deployment**: Docker, docker-compose

## Development

### Mobile

```bash
cd mobile
npm install
npm start
```

### Server

```bash
cd server
go mod tidy
# Set DATABASE_URL, PORT, JWT keys, etc.
go run server.go
```

## Architecture

Mobile communicates with server via GraphQL over HTTP/WebSocket. Authentication uses JWT tokens stored securely on device. Server uses directive-based authorization (`@auth`, `@admin`) with middleware for rate limiting and CORS.
