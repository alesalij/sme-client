#!/bin/bash

# Скрипт быстрого деплоя backend
# Этот скрипт собирает и разворачивает backend используя Docker

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Функции
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

# Проверка установки Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker не установлен. Пожалуйста, установите Docker сначала."
    exit 1
fi

# Проверка установки Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose не установлен. Пожалуйста, установите Docker Compose сначала."
    exit 1
fi

# Парсинг аргументов
REBUILD=false
DETACHED=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --rebuild)
            REBUILD=true
            shift
            ;;
        --no-detach)
            DETACHED=false
            shift
            ;;
        --help)
            echo "Использование: ./deploy.sh [ОПЦИИ]"
            echo ""
            echo "Опции:"
            echo "  --rebuild    Пересобрать образы перед запуском"
            echo "  --no-detach  Не запускать в фоновом режиме"
            echo "  --help       Показать справку"
            exit 0
            ;;
        *)
            log_error "Неизвестная опция: $1"
            echo "Используйте --help для получения справки"
            exit 1
            ;;
    esac
done

# Функция деплоя
deploy() {
    log_info "Запуск деплоя backend..."
    echo ""

    COMPOSE_FILE="docker-compose.prod.yml"
    SERVICE_NAME="sme_backend_api"

    # Остановка существующих контейнеров
    log_info "Остановка существующих контейнеров..."
    docker-compose -f $COMPOSE_FILE down 2>/dev/null || true
    log_success "Контейнеры остановлены"
    echo ""

    # Пересборка если запрошено
    if [ "$REBUILD" = true ]; then
        log_info "Пересборка Docker образов..."
        docker-compose -f $COMPOSE_FILE build --no-cache
        log_success "Образы пересобраны"
        echo ""
    fi

    # Генерация SSL-сертификатов если их нет
    if [ ! -f "./nginx/ssl/cert.pem" ] || [ ! -f "./nginx/ssl/key.pem" ]; then
        log_info "SSL-сертификаты не найдены. Генерация самоподписанных сертификатов..."
        bash "$(dirname "$0")/generate-ssl.sh"
        echo ""
    fi

    # Запуск контейнеров
    log_info "Запуск контейнеров..."
    if [ "$DETACHED" = true ]; then
        docker-compose -f $COMPOSE_FILE up -d
    else
        docker-compose -f $COMPOSE_FILE up
    fi

    log_success "Контейнеры запущены"
    echo ""

    # Ожидание health check
    if [ "$DETACHED" = true ]; then
        log_info "Ожидание готовности приложения..."
        for i in {1..30}; do
            if curl -sk https://localhost/health > /dev/null 2>&1; then
                log_success "Приложение готово!"
                break
            fi
            if [ $i -eq 30 ]; then
                log_warning "Health check истекло время ожидания, но контейнеры запущены"
                break
            fi
            sleep 2
        done
        echo ""
    fi

    # Показать статус
    log_info "Статус контейнеров:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""

    # Сообщение об успехе
    log_success "Деплой backend успешно завершен!"
    echo ""
    echo "📝 Информация о приложении:"
    echo "   - Сервис: $SERVICE_NAME"
    echo "   - URL: https://localhost"
    echo "   - Health check: https://localhost/health (или http://localhost/health)"
    echo "   - Swagger Docs: https://localhost/docs"
    echo ""
    echo "📋 Полезные команды:"
    echo "   - Просмотр логов: docker-compose -f $COMPOSE_FILE logs -f"
    echo "   - Остановка контейнеров: docker-compose -f $COMPOSE_FILE down"
    echo "   - Перезапуск контейнеров: docker-compose -f $COMPOSE_FILE restart"
    echo "   - Выполнение в контейнере: docker-compose -f $COMPOSE_FILE exec $SERVICE_NAME sh"
}

# Запуск деплоя
deploy
exit 0
