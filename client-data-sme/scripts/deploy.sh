#!/bin/bash

# Quick Deploy Script
# This script builds and deploys the application using Docker

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Parse arguments
MODE="production"
REBUILD=false
DETACHED=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            MODE="development"
            shift
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        --no-detach)
            DETACHED=false
            shift
            ;;
        --help)
            echo "Usage: ./deploy.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dev        Run in development mode"
            echo "  --rebuild    Rebuild images before starting"
            echo "  --no-detach  Don't run in detached mode"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Deploy function
deploy() {
    log_info "Starting deployment in $MODE mode..."
    echo ""

    # Stop existing containers
    log_info "Stopping existing containers..."
    if [ "$MODE" = "development" ]; then
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    else
        docker-compose down 2>/dev/null || true
    fi
    log_success "Containers stopped"
    echo ""

    # Rebuild if requested
    if [ "$REBUILD" = true ]; then
        log_info "Rebuilding Docker images..."
        if [ "$MODE" = "development" ]; then
            docker-compose -f docker-compose.dev.yml build --no-cache
        else
            docker-compose build --no-cache
        fi
        log_success "Images rebuilt"
        echo ""
    fi

    # Start containers
    log_info "Starting containers..."
    if [ "$MODE" = "development" ]; then
        COMPOSE_FILE="docker-compose.dev.yml"
        SERVICE_NAME="client-data-sme-dev"
        PORT="5173"
        
        if [ "$DETACHED" = true ]; then
            docker-compose -f $COMPOSE_FILE up -d
        else
            docker-compose -f $COMPOSE_FILE up
        fi
    else
        COMPOSE_FILE="docker-compose.yml"
        SERVICE_NAME="client-data-sme"
        PORT="80"
        
        if [ "$DETACHED" = true ]; then
            docker-compose up -d
        else
            docker-compose up
        fi
    fi

    log_success "Containers started"
    echo ""

    # Wait for health check
    if [ "$DETACHED" = true ]; then
        log_info "Waiting for application to be healthy..."
        for i in {1..30}; do
            if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
                log_success "Application is healthy!"
                break
            fi
            if [ $i -eq 30 ]; then
                log_warning "Health check timed out, but containers are running"
                break
            fi
            sleep 2
        done
        echo ""
    fi

    # Show status
    log_info "Container status:"
    if [ "$MODE" = "development" ]; then
        docker-compose -f $COMPOSE_FILE ps
    else
        docker-compose ps
    fi
    echo ""

    # Success message
    log_success "Deployment completed successfully!"
    echo ""
    echo "📝 Application information:"
    echo "   - Mode: $MODE"
    echo "   - Service: $SERVICE_NAME"
    echo "   - URL: http://localhost:$PORT"
    echo "   - Health check: http://localhost:$PORT/health"
    echo ""
    echo "📋 Useful commands:"
    echo "   - View logs: docker-compose -f $COMPOSE_FILE logs -f"
    echo "   - Stop containers: docker-compose -f $COMPOSE_FILE down"
    echo "   - Restart containers: docker-compose -f $COMPOSE_FILE restart"
    echo "   - Execute in container: docker-compose -f $COMPOSE_FILE exec $SERVICE_NAME sh"
}

# Run deployment
deploy
exit 0