# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **acquisitions-purchase** service - a Node.js/Express API using ES modules with Drizzle ORM for database operations and Neon as the PostgreSQL provider. The service handles user authentication and is designed as part of a microservices architecture focused on purchase/acquisition workflows.

## Common Development Commands

### Development

```bash
npm run dev          # Start development server with --watch
npm start           # Start production server
```

### Database Operations

```bash
npm run db:generate # Generate Drizzle schema migrations
npm run db:migrate  # Apply database migrations
npm run db:studio   # Open Drizzle Studio for database management
```

### Code Quality

```bash
npm run lint        # Run ESLint
npm run lint:fix    # Run ESLint with auto-fix
npm run format      # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing

```bash
npm test           # Run Jest tests
```

### Docker

```bash
npm run dev:docker  # Run development environment with Docker (requires scripts/dev.sh)
npm run prod:docker # Run production environment with Docker (requires scripts/prod.sh)
```

## Architecture & Code Organization

### Module Resolution System

The project uses Node.js subpath imports (package.json `imports` field) for clean internal module references:

- `#src/*` → `./src/*`
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

Always use these import paths instead of relative paths when referencing internal modules.

### Application Structure

- **Entry Point**: `src/index.js` → `src/server.js` → `src/app.js`
- **Database**: Drizzle ORM with Neon PostgreSQL (serverless)
- **Authentication**: JWT with HTTP-only cookies, bcrypt for password hashing
- **Validation**: Zod schemas for request validation
- **Logging**: Winston logger with file and console transports
- **Security**: Helmet, CORS, request logging via Morgan

### Key Patterns

#### Controller Pattern

Controllers handle request validation using Zod schemas, then delegate business logic to services:

```javascript
const validationResult = schema.safeParse(req.body);
if (!validationResult.success) {
  return res.status(400).json({
    error: 'Validation failed',
    details: formatValidationError(validationResult.error),
  });
}
```

#### Service Pattern

Services contain business logic and interact with the database via Drizzle ORM:

```javascript
const [existingUser] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);
```

#### Error Handling

- Services throw descriptive errors that controllers catch and transform into appropriate HTTP responses
- Centralized logging via Winston with structured metadata
- Validation errors formatted via `formatValidationError` utility

### Database Schema

Uses Drizzle ORM with PostgreSQL. Schema files are in `src/models/`. Current schema includes:

- **users table**: id, name, email (unique), password (hashed), role, timestamps

### Environment Configuration

- `DATABASE_URL`: Neon PostgreSQL connection string
- `NODE_ENV`: Environment mode (affects logging)
- `PORT`: Server port (default: 5000)
- `LOG_LEVEL`: Winston log level (default: 'info')

## Code Style Enforcement

### ESLint Configuration

- Uses ES2022 with module syntax
- Enforces single quotes, semicolons, 2-space indentation
- Unix line endings
- Arrow functions preferred over function expressions
- No unused variables (except those prefixed with `_`)

### Prettier Configuration

- Single quotes, trailing commas (es5)
- 2-space tabs, 80 character line width
- LF line endings, bracket spacing enabled

## Development Notes

### Authentication Flow

The service implements cookie-based JWT authentication:

1. Sign-up/Sign-in endpoints validate input with Zod
2. Passwords are hashed with bcrypt (salt rounds: 10)
3. JWT tokens are stored in HTTP-only cookies via the `cookies` utility
4. User roles supported: 'user' (default), 'admin'

### Database Migrations

Drizzle generates migrations based on schema changes in `src/models/*.js`. The `drizzle/` directory contains generated migration files and should not be manually edited.

### Logging Strategy

Winston logger configuration:

- File logging: `logs/error.log` (errors only), `logs/combined.log` (all levels)
- Console logging: Development only, with colorized output
- Request logging: Morgan integration with Winston stream
- Structured logging with service metadata: `{ service: 'acquisitions-api' }`
