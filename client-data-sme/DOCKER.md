# Docker Deployment Guide

## 🐳 Docker Deployment

This guide covers deploying Client Data SME using Docker.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## Quick Start

### Production Deployment

```bash
# Clone the repository
git clone <repository-url>
cd client-data-sme

# Build and run
docker-compose up -d

# Access the application
open http://localhost
```

### Development with Docker

```bash
# Run with hot-reload
docker-compose -f docker-compose.dev.yml up

# Access the application
open http://localhost:5173
```

## Docker Files

### Dockerfile (Production)

Multi-stage build that:

1. **Build stage**: Builds the React application using Node.js
2. **Production stage**: Serves the built files using nginx

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile.dev (Development)

Development environment with:

- Hot module replacement
- Volume mounting for live updates
- Development server on port 5173

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

## Docker Compose Files

### docker-compose.yml (Production)

```yaml
version: "3.8"

services:
  client-data-sme:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: client-data-sme
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--quiet",
          "--tries=1",
          "--spider",
          "http://localhost/health",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - client-data-network

networks:
  client-data-network:
    driver: bridge
```

### docker-compose.dev.yml (Development)

```yaml
version: "3.8"

services:
  client-data-sme-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: client-data-sme-dev
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    environment:
      - NODE_ENV=development
    restart: unless-stopped
    stdin_open: true
    tty: true
    networks:
      - client-data-network

networks:
  client-data-network:
    driver: bridge
```

## Configuration

### nginx.conf

The nginx configuration includes:

- Gzip compression
- Security headers
- Static asset caching
- SPA routing support
- Health check endpoint
- Optional API proxy (commented out)

### Environment Variables

Set environment variables in `docker-compose.yml`:

```yaml
services:
  client-data-sme:
    environment:
      - VITE_API_BASE_URL=https://api-server:8090
      - VITE_ENABLE_MOCK_DATA=false
      - VITE_APP_TITLE=Client Data SME
```

## Usage

### Basic Commands

```bash
# Build and start production
docker-compose up -d

# Start development environment
docker-compose -f docker-compose.dev.yml up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild without cache
docker-compose build --no-cache

# Execute command in container
docker-compose exec client-data-sme sh
```

### Advanced Commands

```bash
# Check container health
docker-compose ps

# View resource usage
docker stats client-data-sme

# Inspect container
docker inspect client-data-sme

# Export logs to file
docker-compose logs > app.log

# Scale services
docker-compose up -d --scale client-data-sme=3
```

## Building Images

### Manual Build

```bash
# Build production image
docker build -t client-data-sme:latest .

# Build development image
docker build -f Dockerfile.dev -t client-data-sme:dev .

# Tag image
docker tag client-data-sme:latest registry.example.com/client-data-sme:1.0.0

# Push to registry
docker push registry.example.com/client-data-sme:1.0.0
```

### Build Arguments

```bash
# Build with custom node version
docker build --build-arg NODE_VERSION=18 -t client-data-sme .

# Build with custom npm registry
docker build --build-arg NPM_REGISTRY=https://registry.npmjs.org -t client-data-sme .
```

## Deployment Scenarios

### 1. Local Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Your changes will be reflected immediately
# Access at http://localhost:5173
```

### 2. Production Deployment

```bash
# Build and start
docker-compose up -d

# Access at http://localhost
# Health check at http://localhost/health
```

### 3. Behind Reverse Proxy

```yaml
# docker-compose.yml
services:
  client-data-sme:
    environment:
      - VITE_API_BASE_URL=https://api.example.com
    networks:
      - proxy-network

networks:
  proxy-network:
    external: true
```

### 4. Multiple Instances

```bash
# Scale horizontally
docker-compose up -d --scale client-data-sme=3

# Use load balancer (nginx, traefik, etc.)
```

## Monitoring

### Health Checks

```bash
# Check health endpoint
curl http://localhost/health

# View health status
docker-compose ps
```

### Logs

```bash
# Follow logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f client-data-sme

# Last 100 lines
docker-compose logs --tail=100
```

### Metrics

```bash
# Container stats
docker stats client-data-sme

# Disk usage
docker system df

# Image sizes
docker images client-data-sme
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check port conflicts
netstat -tulpn | grep :80

# Rebuild image
docker-compose build --no-cache
```

### Build Failures

```bash
# Clear Docker cache
docker system prune -a

# Check disk space
df -h

# Increase Docker resources (Docker Desktop settings)
```

### Network Issues

```bash
# Check network connectivity
docker-compose exec client-data-sme ping google.com

# Inspect network
docker network inspect client-data-network

# Recreate network
docker-compose down
docker network rm client-data-network
docker-compose up -d
```

### Hot Reload Not Working (Dev)

```bash
# Check volume mounts
docker-compose -f docker-compose.dev.yml config

# Restart container
docker-compose -f docker-compose.dev.yml restart

# Clear node_modules volume
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up
```

## Security

### Best Practices

1. **Use specific image tags**: Avoid `latest` tag
2. **Scan images**: Run security scans
3. **Limit container privileges**: Use non-root user
4. **Update regularly**: Keep images updated
5. **Secrets management**: Use Docker secrets or environment variables

### Security Scanning

```bash
# Scan image with Trivy
trivy image client-data-sme:latest

# Scan with Docker Scout
docker scout cves client-data-sme:latest
```

### Secrets Management

```yaml
# docker-compose.yml
services:
  client-data-sme:
    secrets:
      - api_key
      - db_password

secrets:
  api_key:
    file: ./secrets/api_key.txt
  db_password:
    file: ./secrets/db_password.txt
```

## Performance Optimization

### Image Size Reduction

```dockerfile
# Use Alpine base
FROM node:18-alpine

# Multi-stage build
FROM node:18-alpine AS builder
# ... build steps ...
FROM nginx:alpine

# Clean up in build stage
RUN npm ci --only=production && npm cache clean --force
```

### Build Caching

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t client-data-sme .

# Layer caching optimization
COPY package*.json ./
RUN npm ci
COPY . .
```

### Production Optimization

```nginx
# nginx.conf optimizations
gzip on;
gzip_types text/plain text/css application/json application/javascript;
expires 1y;
add_header Cache-Control "public, immutable";
```

## Backup and Restore

### Backup

```bash
# Backup volumes
docker run --rm -v client-data-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data

# Backup configuration
tar czf config-backup.tar.gz docker-compose.yml nginx.conf .env
```

### Restore

```bash
# Restore volumes
docker run --rm -v client-data-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /

# Restore configuration
tar xzf config-backup.tar.gz
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t client-data-sme .
      - name: Login to Docker Hub
        run: docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
      - name: Push Docker image
        run: docker push your-registry/client-data-sme:latest
```

### GitLab CI

```yaml
build-image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t client-data-sme .
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY/client-data-sme:latest
```

## Support

For Docker-specific issues:

- Docker documentation: https://docs.docker.com
- Docker Compose documentation: https://docs.docker.com/compose
- Nginx documentation: https://nginx.org/en/docs/

---

© 2026 АО «Ренессанс Кредит». Все права защищены.
