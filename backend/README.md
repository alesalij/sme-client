# Backend (NestJS)

NestJS backend application - API Gateway для пересылки запросов на внешние сервисы.

## Архитектура

Этот backend не работает напрямую с базой данных. Он выступает как **API Gateway** и пересылает запросы на внешние сервисы:

```
Client -> Backend (NestJS) -> External Services
                              ├── Legal Entities API
                              ├── Checks API
                              └── Users API
```

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Proxy**: Универсальный сервис для пересылки запросов
- **Validation**: class-validator
- **API Docs**: Swagger

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

## Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `npm run build`     | Build production                    |
| `npm run start`     | Start production server             |
| `npm run start:dev` | Start development server with watch |
| `npm run lint`      | Run ESLint                          |

## Конфигурация внешних сервисов

### Файл конфигурации

Все настройки внешних сервисов находятся в `src/config/services.config.ts`:

```typescript
export const servicesConfig: ServiceConfig[] = [
  {
    key: "LEGAL_ENTITIES_API",
    name: "API юридических лиц",
    devUrl: process.env.LEGAL_ENTITIES_API_DEV_URL || "http://localhost:4001",
    prodUrl:
      process.env.LEGAL_ENTITIES_API_PROD_URL ||
      "https://legal-entities-api.production.com",
    timeout: 15000, // 15 секунд
    rateLimit: {
      max: 200, // 200 запросов
      windowMs: 60000, // за 1 минуту
    },
  },
  // ... другие сервисы
];
```

### Переменные окружения (.env)

Для переопределения URL можно использовать переменные окружения:

```env
# Режим работы
NODE_ENV=development  # или production

# Переопределение URL (опционально)
LEGAL_ENTITIES_API_DEV_URL=http://localhost:4001
LEGAL_ENTITIES_API_PROD_URL=https://legal-entities-api.production.com
CHECKS_API_DEV_URL=http://localhost:4002
CHECKS_API_PROD_URL=https://checks-api.production.com
USERS_API_DEV_URL=http://localhost:4003
USERS_API_PROD_URL=https://users-api.production.com
```

### Логика выбора URL

- При `NODE_ENV=development` → используется `*_DEV_URL`
- При `NODE_ENV=production` → используется `*_PROD_URL`

### Rate Limiting

Каждый сервис имеет свои настройки ограничения запросов:

| Сервис             | Лимит | Окно  |
| ------------------ | ----- | ----- |
| LEGAL_ENTITIES_API | 200   | 1 мин |
| CHECKS_API         | 50    | 1 мин |
| USERS_API          | 500   | 1 мин |

При превышении лимита возвращается HTTP 429 (Too Many Requests).

### Timeout

Таймаут по умолчанию для каждого сервиса:

| Сервис             | Таймаут |
| ------------------ | ------- |
| LEGAL_ENTITIES_API | 15 сек  |
| CHECKS_API         | 60 сек  |
| USERS_API          | 10 сек  |

При превышении таймаута возвращается HTTP 504 (Gateway Timeout).

## API Endpoints

### Legal Entities (`/api/legal-entities`)

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| GET    | `/`                  | Получить все юридические лица |
| GET    | `/:id`               | Получить по ID                |
| POST   | `/`                  | Создать юридическое лицо      |
| PATCH  | `/:id`               | Обновить юридическое лицо     |
| DELETE | `/:id`               | Удалить юридическое лицо      |
| POST   | `/questionnaire`     | Сохранить анкету              |
| GET    | `/:id/questionnaire` | Получить анкету               |

### Checks (`/api/checks`)

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/start`            | Запустить проверки             |
| POST   | `/perform`          | Выполнить проверку             |
| GET    | `/legal-entity/:id` | Получить проверки для юр. лица |
| GET    | `/:id`              | Получить проверку по ID        |
| PATCH  | `/:id`              | Обновить статус проверки       |
| POST   | `/periodic/:inn`    | Периодическая проверка         |

### Users (`/api/users`)

| Method | Endpoint | Description                 |
| ------ | -------- | --------------------------- |
| GET    | `/`      | Получить всех пользователей |
| GET    | `/:id`   | Получить пользователя по ID |
| PATCH  | `/:id`   | Обновить пользователя       |
| DELETE | `/:id`   | Деактивировать пользователя |

### Health

- `GET /health` - Проверка здоровья сервиса

## Swagger

Документация API: http://localhost:3001/docs
