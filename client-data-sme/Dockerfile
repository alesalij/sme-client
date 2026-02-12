# Этап сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production=false

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Этап продакшена
FROM nginx:alpine AS production

# Копирование собранных ресурсов из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]