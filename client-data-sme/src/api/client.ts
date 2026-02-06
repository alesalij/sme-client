import axios from "axios";
import {
  SearchParams,
  SearchResult,
  Client,
  RelatedPerson,
  ExportItem,
  ExportResult,
} from "@/types";
import { mockSearchClients, mockGetRelatedPersons } from "./mockData";

// Конфигурация API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://srvap6229.rccf.ru:8090";

// Создаем экземпляр axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Добавляем interceptor для логирования
api.interceptors.request.use(
  (config) => {
    console.log(
      `[API] ${config.method?.toUpperCase()} ${config.url}`,
      config.data,
    );
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error(
      "[API] Response error:",
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// API для поиска клиентов
export const searchApi = {
  // Поиск клиентов по параметрам
  async searchClients(params: SearchParams): Promise<SearchResult> {
    // В продакшене здесь был бы реальный API вызов
    // const { data } = await api.post('/api/v1/clients/search', params)

    // Пока используем mock данные для демонстрации
    const enableMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

    if (enableMockData) {
      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockSearchClients(params);
    }

    // Реальный API вызов (закомментирован до настройки сервера)
    const { data } = await api.post("/api/v1/clients/search", params);
    return data;
  },

  // Получение деталей клиента по ID
  async getClientDetails(clientId: number): Promise<Client> {
    const enableMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

    if (enableMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Находим клиента в mock данных
      const { mockSearchClients } = await import("./mockData");
      const result = mockSearchClients({});
      const client = result.clients.find((c) => c.id === clientId);
      if (!client) throw new Error("Client not found");
      return client;
    }

    const { data } = await api.get(`/api/v1/clients/${clientId}`);
    return data;
  },

  // Получение связанных лиц
  async getRelatedPersons(inn: string): Promise<RelatedPerson[]> {
    const enableMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

    if (enableMockData) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockGetRelatedPersons(inn);
    }

    const { data } = await api.get(`/api/v1/clients/related`, {
      params: { inn },
    });
    return data;
  },

  // Поиск через URSA
  async searchThroughUrsa(params: SearchParams): Promise<any> {
    const { data } = await api.post("/api/v1/clients/ursa-search", params);
    return data;
  },
};

// API для массовой выгрузки
export const exportApi = {
  // Массовая выгрузка клиентов
  async massExport(
    items: ExportItem[],
    options: any,
    actualDate?: string,
  ): Promise<ExportResult> {
    const { data } = await api.post("/api/v1/export/mass", {
      items,
      options,
      actualDate,
    });
    return data;
  },

  // Загрузка файла для массовой выгрузки
  async uploadExportFile(file: File): Promise<ExportItem[]> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post("/api/v1/export/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // Скачивание результата экспорта
  async downloadExportResult(exportId: string): Promise<Blob> {
    const response = await api.get(`/api/v1/export/${exportId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// API для валидации данных
export const validationApi = {
  // Валидация ИНН
  validateInn(inn: string): {
    isValid: boolean;
    type?: "ЮЛ" | "ИП";
    error?: string;
  } {
    if (!inn || !/^\d+$/.test(inn)) {
      return { isValid: false, error: "ИНН должен содержать только цифры" };
    }

    if (inn.length !== 10 && inn.length !== 12) {
      return {
        isValid: false,
        error: "ИНН должен содержать 10 (для ЮЛ) или 12 (для ИП) знаков",
      };
    }

    const type = inn.length === 10 ? "ЮЛ" : "ИП";
    return { isValid: true, type };
  },

  // Валидация ОГРН
  validateOgrn(ogrn: string): { isValid: boolean; error?: string } {
    if (!ogrn || !/^\d+$/.test(ogrn)) {
      return { isValid: false, error: "ОГРН должен содержать только цифры" };
    }

    if (ogrn.length !== 13 && ogrn.length !== 15) {
      return {
        isValid: false,
        error: "ОГРН должен содержать 13 (для ЮЛ) или 15 (для ИП) знаков",
      };
    }

    return { isValid: true };
  },

  // Валидация номера счета
  validateAccountNumber(account: string): { isValid: boolean; error?: string } {
    if (!account || !/^\d+$/.test(account)) {
      return {
        isValid: false,
        error: "Номер счета должен содержать только цифры",
      };
    }

    if (account.length < 20 || account.length > 25) {
      return {
        isValid: false,
        error: "Номер счета должен содержать от 20 до 25 знаков",
      };
    }

    return { isValid: true };
  },

  // Валидация даты
  validateDate(dateString: string): { isValid: boolean; error?: string } {
    if (!dateString) return { isValid: true };

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: "Некорректный формат даты" };
    }

    const now = new Date();
    if (date > now) {
      return { isValid: false, error: "Дата не может быть в будущем" };
    }

    return { isValid: true };
  },
};

// Экспортируем настроенный axios экземпляр для кастомных запросов
export { api };
