# Docker Deployment

## Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop with volumes (WARNING: deletes database data)
docker-compose down -v
```

## Services

| Service          | Port | URL                         |
| ---------------- | ---- | --------------------------- |
| PostgreSQL       | 5432 | postgresql://localhost:5432 |
| Backend (NestJS) | 3001 | http://localhost:3001       |
| Swagger API Docs | 3001 | http://localhost:3001/docs  |

## Environment Variables

Create `.env` file in root directory:

```env

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Server
NODE_ENV=production
```

## Database Setup

After starting PostgreSQL, run migrations:

```bash
# Generate Prisma client
docker-compose exec backend npx prisma generate

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database (optional)
docker-compose exec backend npm run prisma:seed
```

## Development

For development, you can run services individually:

```bash
# Start PostgreSQL only
docker-compose up -d postgres

# Run backend locally
cd backend && npm run start:dev
```

## Reset Database

```bash
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
docker-compose up -d backend
```

## Default Users

| Email             | Password | Role        |
| ----------------- | -------- | ----------- |
| admin@example.com | admin123 | ADMIN       |
| test@example.com  | test123  | AML_OFFICER |
