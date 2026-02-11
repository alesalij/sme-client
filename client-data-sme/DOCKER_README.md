# 🐳 Docker Quick Start

Быстрый запуск Client Data SME с Docker.

## 🚀 Быстрый старт

### Production (1 команда)

```bash
# Запуск продакшен версии
docker-compose up -d

# Или использовать скрипт деплоя
./scripts/deploy.sh
```

Приложение будет доступно на: **http://localhost**

### Development (с hot-reload)

```bash
# Запуск development версии
docker-compose -f docker-compose.dev.yml up

# Или использовать скрипт деплоя
./scripts/deploy.sh --dev
```

Приложение будет доступно на: **http://localhost:5173**

## 📋 Основные команды

### Production

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Логи
docker-compose logs -f

# Пересборка
docker-compose build --no-cache

# Статус
docker-compose ps
```

### Development

```bash
# Запуск
docker-compose -f docker-compose.dev.yml up

# Остановка
docker-compose -f docker-compose.dev.yml down

# Логи
docker-compose -f docker-compose.dev.yml logs -f

# Статус
docker-compose -f docker-compose.dev.yml ps
```

### Makefile (рекомендуется)

```bash
# Production
make docker:up         # Запуск
make docker:down       # Остановка
make docker:logs       # Логи
make docker:ps         # Статус

# Development
make docker:dev:up     # Запуск с hot-reload
make docker:dev:down   # Остановка

# Сборка
make docker:build      # Сборка образов
make docker:rebuild    # Пересборка
```

## 🔍 Проверка окружения

```bash
# Проверить Docker окружение
./scripts/check-docker.sh
```

## 📦 Скрипты деплоя

```bash
# Production deployment
./scripts/deploy.sh

# Development deployment
./scripts/deploy.sh --dev

# Rebuild before deployment
./scripts/deploy.sh --rebuild

# Run in foreground
./scripts/deploy.sh --no-detach

# Show help
./scripts/deploy.sh --help
```

## 🌐 Доступ к приложению

### Production
- **URL**: http://localhost
- **Health check**: http://localhost/health

### Development
- **URL**: http://localhost:5173
- **Hot reload**: Автоматическая перезагрузка при изменении файлов

## 🐛 Troubleshooting

### Контейнер не запускается

```bash
# Проверить логи
docker-compose logs

# Пересобрать образ
docker-compose build --no-cache
docker-compose up -d
```

### Проблемы с сетью

```bash
# Проверить порты
netstat -tulpn | grep :80

# Проверить сеть
docker network inspect client-data-network
```

### Очистка Docker

```bash
# Очистить неиспользуемые ресурсы
docker system prune -a

# Очистить volumes (внимательно!)
docker system prune -a --volumes
```

## 📚 Документация

- **DOCKER.md** - Полная документация по Docker
- **README.md** - Основная документация проекта
- **GETTING_STARTED.md** - Быстрый старт

## 🔗 Полезные ссылки

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

© 2023 АО «Ренессанс Кредит». Все права защищены.