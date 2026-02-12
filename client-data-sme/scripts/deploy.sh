#!/bin/bash

# Скрипт быстрого деплоя
# Этот скрипт собирает и разворачивает приложение используя Docker

set -e  # Выход при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Без цвета

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
            echo "Использование: ./deploy.sh [ОПЦИИ]"
            echo ""
            echo "Опции:"
            echo "  --dev        Запуск в режиме разработки"
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
    log_info "Запуск деплоя в режиме $MODE..."
    echo ""

    # Остановка существующих контейнеров
    log_info "Остановка существующих контейнеров..."
    if [ "$MODE" = "development" ]; then
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    else
        docker-compose down 2>/dev/null || true
    fi
    log_success "Контейнеры остановлены"
    echo ""

    # Пересборка если запрошено
    if [ "$REBUILD" = true ]; then
        log_info "Пересборка Docker образов..."
        if [ "$MODE" = "development" ]; then
            docker-compose -f docker-compose.dev.yml build --no-cache
        else
            docker-compose build --no-cache
        fi
        log_success "Образы пересобраны"
        echo ""
    fi

    # Запуск контейнеров
    log_info "Запуск контейнеров..."
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

    log_success "Контейнеры запущены"
    echo ""

    # Ожидание health check
    if [ "$DETACHED" = true ]; then
        log_info "Ожидание готовности приложения..."
        for i in {1..30}; do
            if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
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
    if [ "$MODE" = "development" ]; then
        docker-compose -f $COMPOSE_FILE ps
    else
        docker-compose ps
    fi
    echo ""

    # Сообщение об успехе
    log_success "Деплой успешно завершен!"
    echo ""
    echo "📝 Информация о приложении:"
    echo "   - Режим: $MODE"
    echo "   - Сервис: $SERVICE_NAME"
    echo "   - URL: http://localhost:$PORT"
    echo "   - Health check: http://localhost:$PORT/health"
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