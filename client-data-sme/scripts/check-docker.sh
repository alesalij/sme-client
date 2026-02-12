#!/bin/bash

# Скрипт проверки Docker окружения
# Этот скрипт проверяет, установлены ли Docker и Docker Compose и правильно ли они настроены

echo "🔍 Проверка Docker окружения..."
echo ""

# Проверка установки Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен"
    echo "Пожалуйста, установите Docker с https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker установлен"
docker --version
echo ""

# Проверка работы Docker демона
if ! docker info &> /dev/null; then
    echo "❌ Docker демон не запущен"
    echo "Пожалуйста, запустите Docker демон"
    exit 1
fi

echo "✅ Docker демон запущен"
echo ""

# Проверка установки Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен"
    echo "Пожалуйста, установите Docker Compose с https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker Compose установлен"
docker-compose --version
echo ""

# Проверка наличия файлов Docker Compose
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml не найден"
    exit 1
fi

echo "✅ docker-compose.yml найден"
echo ""

if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ docker-compose.dev.yml не найден"
    exit 1
fi

echo "✅ docker-compose.dev.yml найден"
echo ""

# Проверка валидности файлов Docker Compose
echo "🔍 Проверка валидности файлов Docker Compose..."

if docker-compose config > /dev/null 2>&1; then
    echo "✅ docker-compose.yml валиден"
else
    echo "❌ docker-compose.yml содержит ошибки"
    exit 1
fi

if docker-compose -f docker-compose.dev.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.dev.yml валиден"
else
    echo "❌ docker-compose.dev.yml содержит ошибки"
    exit 1
fi

echo ""

# Проверка наличия Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile не найден"
    exit 1
fi

echo "✅ Dockerfile найден"
echo ""

# Проверка наличия nginx.conf
if [ ! -f "nginx.conf" ]; then
    echo "❌ nginx.conf не найден"
    exit 1
fi

echo "✅ nginx.conf найден"
echo ""

# Проверка наличия .dockerignore
if [ ! -f ".dockerignore" ]; then
    echo "❌ .dockerignore не найден"
    exit 1
fi

echo "✅ .dockerignore найден"
echo ""

# Проверка ресурсов Docker
echo "🔍 Проверка ресурсов Docker..."
docker system df
echo ""

# Проверка запущенных контейнеров
echo "🔍 Проверка запущенных контейнеров..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "✅ Все проверки пройдены! Docker окружение готово к использованию."
echo ""
echo "Следующие шаги:"
echo "  - Запустите 'make docker:up' для запуска production контейнеров"
echo "  - Запустите 'make docker:dev:up' для запуска development контейнеров"
echo "  - Запустите 'make docker:build' для сборки Docker образов"