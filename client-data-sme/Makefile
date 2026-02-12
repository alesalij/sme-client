.PHONY: help install dev build preview lint lint:fix clean docker:up docker:down docker:dev:up docker:dev:down docker:build docker:rebuild docker:logs docker:ps docker:exec

# Цель по умолчанию
help:
	@echo "Client Data SME - Команды Make"
	@echo ""
	@echo "Разработка:"
	@echo "  make install           - Установить зависимости"
	@echo "  make dev               - Запустить сервер разработки"
	@echo "  make build             - Собрать для продакшена"
	@echo "  make preview           - Предварительный просмотр сборки"
	@echo "  make lint              - Запустить ESLint"
	@echo "  make lint:fix          - Исправить ошибки ESLint"
	@echo "  make clean             - Очистить артефакты сборки"
	@echo ""
	@echo "Docker:"
	@echo "  make docker:up         - Запустить production контейнеры"
	@echo "  make docker:down       - Остановить production контейнеры"
	@echo "  make docker:dev:up     - Запустить development контейнеры"
	@echo "  make docker:dev:down   - Остановить development контейнеры"
	@echo "  make docker:build      - Собрать Docker образы"
	@echo "  make docker:rebuild    - Пересобрать Docker образы"
	@echo "  make docker:logs       - Просмотреть логи контейнеров"
	@echo "  make docker:ps         - Показать статус контейнеров"
	@echo "  make docker:exec       - Выполнить команду в контейнере"

# Разработка
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