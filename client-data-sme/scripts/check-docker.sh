#!/bin/bash

# Docker Environment Check Script
# This script checks if Docker and Docker Compose are properly installed and configured

echo "🔍 Checking Docker environment..."
echo ""

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker is installed"
docker --version
echo ""

# Check Docker daemon
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    echo "Please start Docker daemon"
    exit 1
fi

echo "✅ Docker daemon is running"
echo ""

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker Compose is installed"
docker-compose --version
echo ""

# Check Docker Compose files
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found"
    exit 1
fi

echo "✅ docker-compose.yml found"
echo ""

if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ docker-compose.dev.yml not found"
    exit 1
fi

echo "✅ docker-compose.dev.yml found"
echo ""

# Validate Docker Compose files
echo "🔍 Validating Docker Compose files..."

if docker-compose config > /dev/null 2>&1; then
    echo "✅ docker-compose.yml is valid"
else
    echo "❌ docker-compose.yml has errors"
    exit 1
fi

if docker-compose -f docker-compose.dev.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.dev.yml is valid"
else
    echo "❌ docker-compose.dev.yml has errors"
    exit 1
fi

echo ""

# Check Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found"
    exit 1
fi

echo "✅ Dockerfile found"
echo ""

# Check nginx.conf
if [ ! -f "nginx.conf" ]; then
    echo "❌ nginx.conf not found"
    exit 1
fi

echo "✅ nginx.conf found"
echo ""

# Check .dockerignore
if [ ! -f ".dockerignore" ]; then
    echo "❌ .dockerignore not found"
    exit 1
fi

echo "✅ .dockerignore found"
echo ""

# Check Docker resources
echo "🔍 Checking Docker resources..."
docker system df
echo ""

# Check running containers
echo "🔍 Checking running containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "✅ All checks passed! Docker environment is ready to use."
echo ""
echo "Next steps:"
echo "  - Run 'make docker:up' to start production containers"
echo "  - Run 'make docker:dev:up' to start development containers"
echo "  - Run 'make docker:build' to build Docker images"