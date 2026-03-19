# Backend (NestJS)

NestJS backend application for AML Check system.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: class-validator
- **API Docs**: Swagger

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

## Scripts

| Command                   | Description                         |
| ------------------------- | ----------------------------------- |
| `npm run build`           | Build production                    |
| `npm run start`           | Start production server             |
| `npm run start:dev`       | Start development server with watch |
| `npm run lint`            | Run ESLint                          |
| `npm run prisma:generate` | Generate Prisma client              |
| `npm run prisma:migrate`  | Run database migrations             |
| `npm run prisma:push`     | Push schema to database             |

## API Endpoints

### Legal Entities (`/api/legal-entities`)

- `GET /` - Get all legal entities
- `GET /search` - Search in Spark API by INN
- `GET /:id` - Get by ID
- `GET /:id/spark-details` - Get Spark details
- `POST /` - Create legal entity
- `PATCH /:id` - Update legal entity
- `DELETE /:id` - Delete legal entity
- `POST /questionnaire` - Save questionnaire
- `GET /:id/questionnaire` - Get questionnaire

### Checks (`/api/checks`)

- `POST /start` - Start checks for legal entity
- `POST /perform` - Perform specific check
- `GET /legal-entity/:id` - Get checks by legal entity
- `GET /:id` - Get check by ID
- `PATCH /:id` - Update check status
- `POST /periodic/:inn` - Perform periodic check

### Users (`/api/users`)

- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PATCH /:id` - Update user
- `DELETE /:id` - Deactivate user

### Health

- `GET /health` - Health check

## Environment Variables

```env
DATABASE_URL=postgresql://spark:spark_password@localhost:5432/spark_db
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
SPARK_MOCK=true
```

## Swagger

API documentation available at: http://localhost:3001/docs
