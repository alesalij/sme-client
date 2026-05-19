#!/bin/bash

# Скрипт генерации самоподписанного SSL-сертификата для локального HTTPS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSL_DIR="${SCRIPT_DIR}/../nginx/ssl"

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

mkdir -p "$SSL_DIR"

if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
    echo -e "${YELLOW}SSL-сертификаты уже существуют.${NC}"
    echo "Если нужно пересоздать, удалите файлы в $SSL_DIR и запустите скрипт снова."
    exit 0
fi

echo "Генерация самоподписанного SSL-сертификата..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/key.pem" \
    -out "$SSL_DIR/cert.pem" \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=ClientDataSME-Backend/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo -e "${GREEN}✅ SSL-сертификаты созданы:${NC}"
echo "   - $SSL_DIR/cert.pem"
echo "   - $SSL_DIR/key.pem"
echo ""
echo "Для использования реальных сертификатов замените эти файлы на свои."
