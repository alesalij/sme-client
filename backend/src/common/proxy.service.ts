import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { servicesConfig, getServiceConfig, ServiceConfig } from '../config/services.config';

export interface ProxyRequestOptions {
  path?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Простой rate limiter на основе Map
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number,
    private windowMs: number,
  ) {}

  check(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Фильтруем старые запросы
    const validTimestamps = timestamps.filter(
      ts => now - ts < this.windowMs
    );

    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  getRemaining(key: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    const validTimestamps = timestamps.filter(
      ts => now - ts < this.windowMs
    );
    return this.maxRequests - validTimestamps.length;
  }
}

@Injectable()
export class ProxyService {
  private rateLimiters: Map<string, RateLimiter> = new Map();

  constructor(private config: ConfigService) {
    this.initRateLimiters();
  }

  /**
   * Инициализировать rate limiters для всех сервисов
   */
  private initRateLimiters(): void {
    servicesConfig.forEach(service => {
      this.rateLimiters.set(
        service.key,
        new RateLimiter(service.rateLimit.max, service.rateLimit.windowMs)
      );
    });
  }

  /**
   * Получить конфигурацию сервиса
   */
  private getConfig(serviceKey: string): ServiceConfig | undefined {
    return getServiceConfig(serviceKey);
  }

  /**
   * Получить URL для внешнего сервиса
   * Автоматически выбирает dev или prod в зависимости от NODE_ENV
   */
  getServiceUrl(serviceKey: string): string {
    const config = this.getConfig(serviceKey);
    if (!config) {
      console.warn(`Service config not found for key: ${serviceKey}`);
      return '';
    }

    const isProduction = this.config.get('NODE_ENV') === 'production';

    if (isProduction && config.prodUrl) {
      return config.prodUrl;
    }
    if (!isProduction && config.devUrl) {
      return config.devUrl;
    }

    return config.devUrl || config.prodUrl || '';
  }

  /**
   * Проверить rate limit для сервиса
   */
  private checkRateLimit(serviceKey: string): void {
    const limiter = this.rateLimiters.get(serviceKey);
    if (limiter && !limiter.check(serviceKey)) {
      throw new HttpException(
        `Rate limit exceeded for service: ${serviceKey}. Too many requests.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }

  /**
   * Получить таймаут для сервиса
   */
  private getTimeout(serviceKey: string, customTimeout?: number): number {
    const config = this.getConfig(serviceKey);
    return customTimeout || config?.timeout || 30000;
  }

  /**
   * Переслать запрос на внешний сервис
   */
  async forward<T = unknown>(
    serviceKey: string,
    options: ProxyRequestOptions,
  ): Promise<T> {
    const baseUrl = this.getServiceUrl(serviceKey);
    
    if (!baseUrl) {
      throw new HttpException(
        `Service URL not configured: ${serviceKey}`,
        HttpStatus.BAD_GATEWAY
      );
    }

    // Проверка rate limit
    this.checkRateLimit(serviceKey);

    const {
      path = '',
      method = 'GET',
      params,
      body,
      headers = {},
    } = options;

    const timeout = this.getTimeout(serviceKey, options.timeout);
    const url = new URL(path, baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errorBody = contentType?.includes('application/json')
          ? await response.json()
          : await response.text();

        throw new HttpException(
          errorBody || `External service error: ${response.status}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      if (contentType?.includes('application/json')) {
        return response.json();
      }

      return response.text() as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage = (error as Error).message;

      // Обработка таймаута
      if (errorMessage.includes('aborted')) {
        throw new HttpException(
          `Service timeout (${timeout}ms): ${serviceKey}`,
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      throw new HttpException(
        `Failed to connect to external service: ${errorMessage}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Упрощённые методы для типичных операций
   */
  async get<T = unknown>(
    serviceKey: string,
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: 'GET', params });
  }

  async post<T = unknown>(
    serviceKey: string,
    path: string,
    body: unknown,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: 'POST', body });
  }

  async put<T = unknown>(
    serviceKey: string,
    path: string,
    body: unknown,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: 'PUT', body });
  }

  async patch<T = unknown>(
    serviceKey: string,
    path: string,
    body: unknown,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: 'PATCH', body });
  }

  async delete<T = unknown>(
    serviceKey: string,
    path: string,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: 'DELETE' });
  }

  /**
   * Сбросить rate limit для сервиса (для админских целей)
   */
  resetRateLimit(serviceKey: string): void {
    const limiter = this.rateLimiters.get(serviceKey);
    if (limiter) {
      limiter.reset(serviceKey);
    }
  }

  /**
   * Получить статус rate limit для сервиса
   */
  getRateLimitStatus(serviceKey: string): { remaining: number; resetAt: number } | null {
    const limiter = this.rateLimiters.get(serviceKey);
    if (!limiter) return null;

    const config = getServiceConfig(serviceKey);
    const windowMs = config?.rateLimit.windowMs || 60000;

    return {
      remaining: limiter.getRemaining(serviceKey),
      resetAt: Date.now() + windowMs,
    };
  }
}