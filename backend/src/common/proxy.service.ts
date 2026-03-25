import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { httpAgent, httpsAgent, httpsOverHttpAgent } from "./https";
import {
  servicesConfig,
  getServiceConfig,
  ServiceConfig,
} from "../config/services.config";

export interface ProxyRequestOptions {
  path?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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

    const validTimestamps = timestamps.filter((ts) => now - ts < this.windowMs);

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
    const validTimestamps = timestamps.filter((ts) => now - ts < this.windowMs);
    return this.maxRequests - validTimestamps.length;
  }
}

@Injectable()
export class ProxyService {
  private rateLimiters: Map<string, RateLimiter> = new Map();

  constructor(private config: ConfigService) {
    this.initRateLimiters();
  }

  private initRateLimiters(): void {
    servicesConfig.forEach((service) => {
      this.rateLimiters.set(
        service.key,
        new RateLimiter(service.rateLimit.max, service.rateLimit.windowMs),
      );
    });
  }

  private getConfig(serviceKey: string): ServiceConfig | undefined {
    return getServiceConfig(serviceKey);
  }

  getServiceUrl(serviceKey: string): string {
    const config = this.getConfig(serviceKey);
    if (!config) {
      console.warn(`Service config not found for key: ${serviceKey}`);
      return "";
    }

    const isProduction = this.config.get("NODE_ENV") === "production";

    if (isProduction && config.prodUrl) {
      return config.prodUrl;
    }
    if (!isProduction && config.devUrl) {
      return config.devUrl;
    }

    return config.devUrl || config.prodUrl || "";
  }

  private checkRateLimit(serviceKey: string): void {
    const limiter = this.rateLimiters.get(serviceKey);
    if (limiter && !limiter.check(serviceKey)) {
      throw new HttpException(
        `Rate limit exceeded for service: ${serviceKey}. Too many requests.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private getTimeout(serviceKey: string, customTimeout?: number): number {
    const config = this.getConfig(serviceKey);
    return customTimeout || config?.timeout || 30000;
  }

  async forward<T = unknown>(
    serviceKey: string,
    options: ProxyRequestOptions,
  ): Promise<T> {
    const baseUrl = this.getServiceUrl(serviceKey);

    if (!baseUrl) {
      throw new HttpException(
        `Service URL not configured: ${serviceKey}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    this.checkRateLimit(serviceKey);

    const { path = "", method = "GET", params, body, headers = {} } = options;

    const timeout = this.getTimeout(serviceKey, options.timeout);

    // Формируем полный URL
    let url = baseUrl;
    if (path) {
      // Убираем trailing slash из baseUrl и добавляем path
      const base = baseUrl.replace(/\/$/, "");
      url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
    }
    const defaultHttpsAgent = https.agent({
      rejectUnauthorized: false,
    });
    const config: AxiosRequestConfig = {
      method,
      url,
      params,
      data: body,
      timeout,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      validateStatus: () => true,
    };
    if (
      config.baseURL !== "mock" &&
      !baseUrl.match(/^https?:\/\/\w+(\.rccf\.ru)?(:\d+)?(\/|$)/i)
    ) {
      // внешний URL, использовать прокси туннель
      config.httpAgent = httpAgent;
      config.httpsAgent = httpsOverHttpAgent;
    } else if (baseUrl.match(/^https:\/\/\w+\.rccf\.ru/i)) {
      // внутренний HTTPS, использовать стандартный агент
      config.httpsAgent = defaultHttpsAgent;
    }

    try {
      const response = await axios(config);

      if (response.status >= 400) {
        const errorBody =
          response.data || `External service error: ${response.status}`;

        const errorMessage =
          typeof errorBody === "string" ? errorBody : JSON.stringify(errorBody);

        throw new HttpException(errorMessage, HttpStatus.BAD_GATEWAY);
      }

      return response.data as T;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const axiosError = error as AxiosError;

      if (axiosError.code === "ECONNABORTED") {
        throw new HttpException(
          `Service timeout (${timeout}ms): ${serviceKey}`,
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      const errorMessage = axiosError.message || "Unknown error";
      throw new HttpException(
        `Failed to connect to external service: ${errorMessage}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async get<T = unknown>(
    serviceKey: string,
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: "GET", params });
  }

  async post<T = unknown>(
    serviceKey: string,
    path: string,
    body: unknown,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: "POST", body });
  }

  async put<T = unknown>(
    serviceKey: string,
    path: string,
    body: unknown,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: "PUT", body });
  }

  async patch<T = unknown>(
    serviceKey: string,
    path: string,
    body: unknown,
  ): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: "PATCH", body });
  }

  async delete<T = unknown>(serviceKey: string, path: string): Promise<T> {
    return this.forward<T>(serviceKey, { path, method: "DELETE" });
  }

  resetRateLimit(serviceKey: string): void {
    const limiter = this.rateLimiters.get(serviceKey);
    if (limiter) {
      limiter.reset(serviceKey);
    }
  }

  getRateLimitStatus(
    serviceKey: string,
  ): { remaining: number; resetAt: number } | null {
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
