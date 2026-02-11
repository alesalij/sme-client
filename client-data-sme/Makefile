.PHONY: help install dev build preview lint lint:fix clean docker:up docker:down docker:dev:up docker:dev:down docker:build docker:rebuild docker:logs docker:ps docker:exec

# Default target
help:
	@echo "Client Data SME - Make commands"
	@echo ""
	@echo "Development:"
	@echo "  make install           - Install dependencies"
	@echo "  make dev               - Start development server"
	@echo "  make build             - Build for production"
	@echo "  make preview           - Preview production build"
	@echo "  make lint              - Run ESLint"
	@echo "  make lint:fix          - Fix ESLint errors"
	@echo "  make clean             - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  make docker:up         - Start production containers"
	@echo "  make docker:down       - Stop production containers"
	@echo "  make docker:dev:up     - Start development containers"
	@echo "  make docker:dev:down   - Stop development containers"
	@echo "  make docker:build      - Build Docker images"
	@echo "  make docker:rebuild    - Rebuild Docker images"
	@echo "  make docker:logs       - View container logs"
	@echo "  make docker:ps         - Show container status"
	@echo "  make docker:exec       - Execute command in container"

# Development
install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

lint:fix:
	npm run lint:fix

clean:
	rm -rf dist node_modules .vite

# Docker
docker:up:
	docker-compose up -d

docker:down:
	docker-compose down

docker:dev:up:
	docker-compose -f docker-compose.dev.yml up

docker:dev:down:
	docker-compose -f docker-compose.dev.yml down

docker:build:
	docker-compose build

docker:rebuild:
	docker-compose build --no-cache
	docker-compose up -d

docker:logs:
	docker-compose logs -f

docker:ps:
	docker-compose ps

docker:exec:
	docker-compose exec client-data-sme sh