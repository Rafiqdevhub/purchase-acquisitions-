# Purchase Acquisitions API

A Node.js Express application for managing purchase acquisitions with authentication, using Neon Database for PostgreSQL and Drizzle ORM.

## Features

- User authentication with JWT
- Secure API with Arcjet protection
- PostgreSQL database with Neon
- Docker containerization
- Development and production environments
- Winston logging
- Input validation with Zod

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Neon account (for production database)

## Environment Setup

### Development Environment

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd purchase-acquisitions
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.development` and update if needed:

   ```bash
   cp .env.development .env
   ```

4. **Run with Docker (Recommended):**

   ```bash
   docker-compose -f docker-compose.dev.yml --env-file .env.development up --build
   ```

   This will:
   - Start Neon Local (local PostgreSQL proxy)
   - Build and run the application in development mode
   - Mount source code for hot reloading

5. **Access the application:**
   - API: http://localhost:5000
   - Health check: http://localhost:5000/health

### Production Environment

1. **Set up Neon Cloud Database:**
   - Create a Neon project at https://neon.tech
   - Get your connection string

2. **Configure environment:**
   Copy `.env.production` and fill in your values:

   ```bash
   cp .env.production .env
   # Edit .env with your Neon Cloud DATABASE_URL and other secrets
   ```

3. **Run with Docker:**

   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env up --build
   ```

   This will:
   - Build the application for production
   - Connect to your Neon Cloud database
   - Run with optimized settings

## API Endpoints

### Authentication

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/me` - Get current user

### Health Check

- `GET /health` - Application health status

## Database

### Development

Uses Neon Local for a local PostgreSQL instance that mimics Neon's serverless experience.

### Production

Uses Neon Cloud for serverless PostgreSQL.

### Migrations

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

## Docker Commands

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --env-file .env.development up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
```

### Production

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml --env-file .env up --build

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

## Environment Variables

### Development (.env.development)

- `NODE_ENV=development`
- `DATABASE_URL=postgres://user:password@neon-local:5432/neondb`
- `ARCJET_KEY` - Your Arcjet API key

### Production (.env.production)

- `NODE_ENV=production`
- `DATABASE_URL` - Your Neon Cloud connection string
- `JWT_SECRET` - Secure JWT secret
- `ARCJET_KEY` - Your Arcjet API key

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app.js              # Express app setup
├── index.js            # Server entry point
├── config/
│   ├── database.js     # Database configuration
│   ├── logger.js       # Winston logger setup
│   └── arcjet.js       # Arcjet security config
├── controllers/
│   └── auth.controller.js
├── middleware/
│   └── security.middleware.js
├── models/
│   └── user.model.js
├── routes/
│   └── auth.routes.js
├── services/
│   └── auth.service.js
├── utils/
│   ├── cookies.js
│   ├── format.js
│   └── jwt.js
└── validations/
    ├── auth.validation.js
    └── users.validations.js
```

## Security

- Helmet for security headers
- CORS configuration
- Arcjet for bot protection and rate limiting
- Input validation with Zod
- JWT authentication
- Bcrypt for password hashing

## Logging

Logs are written to `./logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC
