/**
 * Конфигурация внешних сервисов
 *
 * Каждый сервис содержит:
 * - key: уникальный идентификатор для использования в ProxyService
 * - name: человекочитаемое название
 * - devUrl: URL для dev окружения
 * - prodUrl: URL для prod окружения
 * - timeout: таймаут запроса в миллисекундах
 * - rateLimit: ограничение количества запросов
 *   - max: максимальное количество запросов
 *   - windowMs: временное окно в миллисекундах
 */

export interface ServiceConfig {
  key: string;
  name: string;
  devUrl: string;
  prodUrl: string;
  timeout: number;
  rateLimit: {
    max: number;
    windowMs: number;
  };
}

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
  {
    key: "CHECKS_API",
    name: "API проверок",
    devUrl: process.env.CHECKS_API_DEV_URL || "http://localhost:4002",
    prodUrl:
      process.env.CHECKS_API_PROD_URL || "https://checks-api.production.com",
    timeout: 60000, // 60 секунд (проверки могут быть долгими)
    rateLimit: {
      max: 50, // 50 запросов
      windowMs: 60000, // за 1 минуту
    },
  },
  {
    key: "USERS_API",
    name: "API пользователей",
    devUrl: process.env.USERS_API_DEV_URL || "http://localhost:4003",
    prodUrl:
      process.env.USERS_API_PROD_URL || "https://users-api.production.com",
    timeout: 10000, // 10 секунд
    rateLimit: {
      max: 500, // 500 запросов
      windowMs: 60000, // за 1 минуту
    },
  },
];

/**
 * Получить конфигурацию сервиса по ключу
 */
export const getServiceConfig = (key: string): ServiceConfig | undefined => {
  return servicesConfig.find((s) => s.key === key);
};

/**
 * Получить все ключи сервисов
 */
export const getServiceKeys = (): string[] => {
  return servicesConfig.map((s) => s.key);
};

/**
 * Дефолтные настройки для всех сервисов
 */
export const defaultServiceConfig = {
  timeout: 30000, // 30 секунд
  rateLimit: {
    max: 100,
    windowMs: 60000,
  },
};
