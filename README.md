# Purchase Acquisitions API

A Node.js Express application for managing purchase acquisitions with authentication, using Neon Database for PostgreSQL and Drizzle ORM.

## Features

- User authentication with JWT
- Secure API with Arcjet protection
- PostgreSQL database with Neon
- Docker containerization with multi-stage builds
- Development and production environments
- Winston logging with file persistence
- Input validation with Zod
- Rate limiting and bot protection
- Comprehensive test suite with Jest
- CI/CD with GitHub Actions

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Neon account (for production database)
- Git (for cloning the repository)

## Quick Start (Using Pre-built Docker Image)

### Option 1: Pull and Run Production Image

The application is available as a pre-built Docker image on Docker Hub:

```bash
# Pull the latest production image
docker pull rafiq9323/acquisitions-purchase:latest

# Run with environment variables
docker run -d \
  --name purchase-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL='your-neon-cloud-database-url' \
  -e JWT_SECRET='your-secure-jwt-secret' \
  -e ARCJET_KEY='your-arcjet-api-key' \
  -v $(pwd)/logs:/app/logs \
  rafiq9323/acquisitions-purchase:latest
```

### Option 2: Using Docker Compose (Recommended)

1. **Create a project directory:**

   ```bash
   mkdir purchase-acquisitions
   cd purchase-acquisitions
   ```

2. **Download the docker-compose.prod.yml:**

   ```bash
   wget https://raw.githubusercontent.com/yourusername/purchase-acquisitions/main/docker-compose.prod.yml
   ```

3. **Create environment file:**

   ```bash
   cat > .env << EOF
   NODE_ENV=production
   PORT=5000
   LOG_LEVEL=info
   DATABASE_URL=your-neon-cloud-database-url
   JWT_SECRET=your-secure-jwt-secret-here
   ARCJET_KEY=your-arcjet-api-key
   EOF
   ```

4. **Run the application:**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Access the application:**
   - API: http://localhost:5000
   - Health check: http://localhost:5000/health
   - API Info: http://localhost:5000/api

## Full Development Setup

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
   - Create ephemeral database branches for testing

5. **Access the application:**
   - API: http://localhost:5000
   - Health check: http://localhost:5000/health
   - Database: postgres://neon:npg@localhost:5432/neondb

### Alternative: Local Development (No Docker)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.development .env
   # Edit .env with your configuration
   ```

3. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Configuration

### Required Environment Variables

#### Development (.env.development)

```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug

# Neon Local Configuration (automatically configured)
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb

# Neon Cloud Configuration (for development with cloud)
# DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
# NEON_API_KEY=your_neon_api_key
# NEON_PROJECT_ID=your_project_id
# PARENT_BRANCH_ID=your_branch_id

# Security
JWT_SECRET=development-jwt-secret-change-in-production
ARCJET_KEY=your_arcjet_development_key
```

#### Production (.env.production)

```env
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Neon Cloud Database (Required)
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require&channel_binding=require

# Security (Required)
JWT_SECRET=your-secure-jwt-secret-here
ARCJET_KEY=your_arcjet_production_key
```

## Available Docker Images and Tags

The application provides several Docker image tags:

- `rafiq9323/acquisitions-purchase:latest` - Latest stable production build
- `rafiq9323/acquisitions-purchase:main` - Latest main branch build
- `rafiq9323/acquisitions-purchase:prod-YYYYMMDD-HHmmss` - Timestamped production builds
- `rafiq9323/acquisitions-purchase:main-<commit-sha>` - Specific commit builds

### Multi-Architecture Support

Images are built for multiple architectures:

- `linux/amd64` (x86_64)
- `linux/arm64` (ARM64/Apple Silicon)

## API Endpoints

### Authentication

- `POST /api/auth/sign-up` - User registration

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```

- `POST /api/auth/sign-in` - User login

  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

- `POST /api/auth/sign-out` - User logout

### Users (Protected Routes)

- `GET /api/users` - Get all users (authenticated)
- `GET /api/users/:id` - Get user by ID (authenticated)
- `PUT /api/users/:id` - Update user (authenticated, own profile or admin)
- `DELETE /api/users/:id` - Delete user (admin only)

### Health & Monitoring

- `GET /health` - Application health status
- `GET /api` - API information
- `GET /metrics` - Prometheus metrics

## Database Management

### Neon Local (Development)

Neon Local provides a local PostgreSQL instance that mimics Neon's serverless experience:

- Automatic ephemeral branch creation
- Git branch-based database branching
- Local development without cloud dependencies

### Neon Cloud (Production)

Production uses Neon Cloud for serverless PostgreSQL:

- Auto-scaling compute
- Built-in connection pooling
- Automatic backups and point-in-time recovery

### Database Operations

```bash
# Generate new migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Reset database (development only)
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

## Docker Operations

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --env-file .env.development up --build

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# View application logs
docker-compose -f docker-compose.dev.yml logs -f app

# View Neon Local logs
docker-compose -f docker-compose.dev.yml logs -f neon-local

# Restart application only
docker-compose -f docker-compose.dev.yml restart app

# Execute commands in running container
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml --env-file .env up -d

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Update to latest image
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Scale application (multiple instances)
docker-compose -f docker-compose.prod.yml up --scale app=3 -d
```

### Direct Docker Commands

```bash
# Pull specific version
docker pull rafiq9323/acquisitions-purchase:prod-20250116-143022

# Run with custom configuration
docker run -d \
  --name purchase-api \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  --restart unless-stopped \
  rafiq9323/acquisitions-purchase:latest

# View container logs
docker logs -f purchase-api

# Execute commands in container
docker exec -it purchase-api npm run db:migrate

# Container health check
docker inspect --format='{{.State.Health.Status}}' purchase-api
```

## Testing

### Running Tests

```bash
# Install dependencies
npm install

# Run tests locally
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/app.test.js
```

### Testing in Docker

```bash
# Run tests in development container
docker-compose -f docker-compose.dev.yml exec app npm test

# Run tests with coverage in container
docker-compose -f docker-compose.dev.yml exec app npm test -- --coverage
```

### Test Structure

- [`tests/app.test.js`](tests/app.test.js) - API endpoint tests
- Health check validation
- Route testing with supertest
- Environment-specific test configurations

## Monitoring and Logging

### Application Logs

Logs are written to `./logs/` directory:

- `combined.log` - All application logs
- `error.log` - Error logs only

### Log Levels

- `error` - Error messages
- `warn` - Warning messages
- `info` - General information
- `debug` - Detailed debugging information

### Prometheus Metrics

Access metrics at: http://localhost:5000/metrics

Available metrics:

- HTTP request duration
- HTTP request count
- Node.js process metrics
- Memory usage
- CPU usage

### Health Monitoring

The application includes comprehensive health checks:

```bash
# Check application health
curl http://localhost:5000/health

# Response format:
{
  "status": "OK",
  "timestamp": "2024-01-16T14:30:22.123Z",
  "uptime": 123.456
}
```

## Security Features

### Arcjet Protection

- **Bot Detection**: Blocks automated requests and malicious bots
- **Rate Limiting**: Role-based request limiting
  - Admin: 20 requests/minute
  - User: 10 requests/minute
  - Guest: 5 requests/minute
- **Shield Protection**: General attack protection

### Security Headers

- Helmet.js for security headers
- CORS configuration
- Secure cookie settings

### Authentication

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Secure cookie handling

## CI/CD Pipeline

### GitHub Actions Workflows

1. **Lint and Format** (`.github/workflows/lint-and-format.yml`)
   - ESLint code quality checks
   - Prettier formatting validation
   - Runs on push and pull requests

2. **Tests** (`.github/workflows/tests.yml`)
   - Jest test execution
   - Coverage reporting
   - Test result artifacts

3. **Docker Build and Push** (`.github/workflows/docker-build-and-push.yml`)
   - Multi-architecture builds
   - Automated image tagging
   - Docker Hub publishing

### Deployment Process

1. Code pushed to main branch
2. Automated tests run
3. Docker image built and tagged
4. Image pushed to Docker Hub
5. Available for production deployment

## Project Structure

```
src/
├── app.js                    # Express app setup
├── index.js                  # Server entry point
├── server.js                 # Server configuration
├── config/
│   ├── database.js          # Database configuration
│   ├── logger.js            # Winston logger setup
│   └── arcjet.js            # Arcjet security config
├── controllers/
│   ├── auth.controller.js   # Authentication endpoints
│   └── users.controller.js  # User management endpoints
├── middleware/
│   ├── auth.middleware.js   # JWT authentication
│   └── security.middleware.js # Arcjet security
├── models/
│   └── user.model.js        # Drizzle user schema
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   └── users.routes.js      # User management routes
├── services/
│   ├── auth.service.js      # Authentication logic
│   └── users.service.js     # User management logic
├── utils/
│   ├── cookies.js           # Cookie utilities
│   ├── format.js            # Response formatting
│   └── jwt.js               # JWT utilities
└── validations/
    ├── auth.validation.js   # Auth input validation
    └── users.validations.js # User input validation

Docker Configuration:
├── Dockerfile               # Multi-stage build
├── docker-compose.yml       # Basic compose file
├── docker-compose.dev.yml   # Development with Neon Local
├── docker-compose.prod.yml  # Production configuration
└── .dockerignore           # Docker ignore patterns

Configuration:
├── .env.development         # Development environment
├── .env.production          # Production environment
├── drizzle.config.js        # Database configuration
├── jest.config.mjs          # Test configuration
├── eslint.config.js         # Linting configuration
└── .prettierrc              # Code formatting

Scripts:
└── scripts/
    ├── dev.sh              # Development startup script
    └── prod.sh             # Production startup script
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   # Or use different port
   PORT=3000 docker-compose up
   ```

2. **Database Connection Issues**

   ```bash
   # Check Neon Local status
   docker-compose logs neon-local
   # Verify environment variables
   docker-compose exec app printenv | grep DATABASE_URL
   ```

3. **Permission Issues (Linux/macOS)**

   ```bash
   # Fix log directory permissions
   sudo chown -R $USER:$USER ./logs
   chmod 755 ./logs
   ```

4. **Memory Issues**
   ```bash
   # Check container resource usage
   docker stats
   # Increase Docker memory limits if needed
   ```

### Debug Mode

```bash
# Run with debug logging
LOG_LEVEL=debug docker-compose up

# Access container shell
docker-compose exec app sh

# Check application status
docker-compose exec app npm run health-check
```

### Log Analysis

```bash
# Follow application logs
tail -f logs/combined.log

# Search for errors
grep "ERROR" logs/error.log

# Monitor real-time logs
docker-compose logs -f --tail=100 app
```

## Performance Optimization

### Production Recommendations

1. **Resource Limits**: Configure appropriate CPU and memory limits
2. **Load Balancing**: Use multiple replicas with a load balancer
3. **Database**: Use connection pooling and read replicas
4. **Caching**: Implement Redis for session storage
5. **Monitoring**: Set up comprehensive monitoring and alerting

### Scaling

```bash
# Scale application horizontally
docker-compose -f docker-compose.prod.yml up --scale app=3 -d

# Use with load balancer (nginx, HAProxy, etc.)
# Configure health checks for proper load distribution
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Workflow

1. Use development environment for coding
2. Write tests for new features
3. Ensure all tests pass
4. Follow code formatting standards
5. Update documentation as needed

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

- **Issues**: Report issues on GitHub
- **Documentation**: Check the README for detailed instructions
- **Community**: Join our Discord/Slack for community support

---

**Quick Commands Summary:**

```bash
# Pull and run production image
docker pull rafiq9323/acquisitions-purchase:latest
docker run -d -p 5000:5000 --env-file .env rafiq9323/acquisitions-purchase:latest

# Development setup
git clone <repo> && cd purchase-acquisitions
docker-compose -f docker-compose.dev.yml up --build

# Production deployment
docker-compose -f docker-compose.prod.yml --env-file .env up -d

# Health check
curl http://localhost:5000/health
```
