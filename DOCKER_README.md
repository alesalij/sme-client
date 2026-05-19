# Docker Deployment

## Quick Start

### Production Deployment (HTTPS)

```bash
# Build and start all services with HTTPS
./scripts/deploy.sh

# Access at https://localhost
# Swagger Docs: https://localhost/docs
# Health check: https://localhost/health
```

> **Note:** Self-signed SSL certificates are auto-generated on first run. Replace `nginx/ssl/cert.pem` and `nginx/ssl/key.pem` with your own certificates if needed.

### HTTP only (legacy)

```bash
# Build and start all services (HTTP)
docker-compose up -d

# Access at http://localhost:5180 (frontend)
# Access at http://localhost:3001 (backend)
# Swagger Docs: http://localhost:3001/docs
```

## Services

| Service          | Port (HTTPS) | Port (HTTP) | URL                    |
| ---------------- | ------------ | ----------- | ---------------------- |
| Frontend         | 443          | 5180        | https://localhost      |
| Backend (NestJS) | 443          | 3001        | https://localhost/api  |
| Swagger API Docs | 443          | 3001        | https://localhost/docs |

## Environment Variables

### Frontend (client-data-sme/.env)

```env
NODE_ENV=production
VITE_API_BASE_URL=/api
VITE_APP_TITLE=Client Data SME
VITE_ENABLE_MOCK_DATA=false
```

### Backend (backend/.env)

```env
NODE_ENV=production

# External services URLs (optional)
LEGAL_ENTITIES_API_DEV_URL=http://localhost:4001
LEGAL_ENTITIES_API_PROD_URL=https://srvap6229.rccf.ru:8090
CHECKS_API_DEV_URL=http://localhost:4002
CHECKS_API_PROD_URL=https://srvap6229.rccf.ru:8090
USERS_API_DEV_URL=http://localhost:4003
USERS_API_PROD_URL=https://srvap6229.rccf.ru:8090
```

## Development

For development, you can run services individually:

```bash
# Start frontend (development mode with hot-reload)
cd client-data-sme
docker-compose -f docker-compose.dev.yml up

# Start backend (development mode)
cd backend
npm run start:dev
```

## Individual Service Deployment

### Deploy Frontend Only

```bash
cd client-data-sme
./scripts/deploy.sh
```

### Deploy Backend Only

```bash
cd backend
./scripts/deploy.sh
```

## SSL / HTTPS

### Self-signed Certificates (auto-generated)

Certificates are automatically generated on first deploy. To regenerate:

```bash
rm -rf nginx/ssl/*.pem nginx/ssl/*.key
./scripts/generate-ssl.sh
```

### Custom Certificates

Replace the files:

- `nginx/ssl/cert.pem` — your certificate (include intermediate certs if needed)
- `nginx/ssl/key.pem` — your private key

### Let's Encrypt (for public domains)

```bash
# Get certificates with certbot
certbot certonly --standalone -d your-domain.com

# Mount in docker-compose.prod.yml
volumes:
  - /etc/letsencrypt/live/your-domain.com/fullchain.pem:/etc/nginx/ssl/cert.pem:ro
  - /etc/letsencrypt/live/your-domain.com/privkey.pem:/etc/nginx/ssl/key.pem:ro
```

## Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Check status
docker-compose -f docker-compose.prod.yml ps

# Execute command in container
docker-compose -f docker-compose.prod.yml exec <service> sh

# Rebuild without cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

## Troubleshooting

### SSL Certificate Warnings

Self-signed certificates will trigger browser warnings. This is normal for local development.

**Option 1:** Trust the certificate in your browser/system
**Option 2:** Use Let's Encrypt or your own CA-signed certificate

### Port Conflicts

If ports 80/443 are already in use:

- Stop other services using these ports
- Or use individual service deployment on different ports

### Frontend Cannot Connect to API

Make sure `VITE_API_BASE_URL` is set to `/api` in `client-data-sme/.env` and rebuild:

```bash
cd client-data-sme
npm run build
docker-compose -f docker-compose.prod.yml up -d --build client
```
