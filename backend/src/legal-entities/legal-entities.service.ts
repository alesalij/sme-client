import { Injectable } from "@nestjs/common";
import { ProxyService } from "../common/proxy.service";

@Injectable()
export class LegalEntitiesService {
  constructor(private proxy: ProxyService) {}

  /**
   * Получить все юридические лица
   */
  async findAll(params: { skip?: number; take?: number }) {
    return this.proxy.get("LEGAL_ENTITIES_API", "/legal-entities", {
      skip: String(params.skip || 0),
      take: String(params.take || 20),
    });
  }

  /**
   * Получить юридическое лицо по ID
   */
  async findById(id: string) {
    return this.proxy.get("LEGAL_ENTITIES_API", `/legal-entities/${id}`);
  }

  /**
   * Получить юридическое лицо по ИНН
   */
  async findByInn(inn: string) {
    return this.proxy.get(
      "LEGAL_ENTITIES_API",
      `/legal-entities/by-inn/${inn}`,
    );
  }

  /**
   * Создать юридическое лицо
   */
  async create(data: {
    inn: string;
    name: string;
    fullName?: string;
    address?: string;
    director?: string;
    activity?: string;
    registrationDate?: string;
  }) {
    return this.proxy.post("LEGAL_ENTITIES_API", "/legal-entities", data);
  }

  /**
   * Обновить юридическое лицо
   */
  async update(
    id: string,
    data: {
      name?: string;
      fullName?: string;
      address?: string;
      director?: string;
      activity?: string;
      registrationDate?: string;
    },
  ) {
    return this.proxy.patch(
      "LEGAL_ENTITIES_API",
      `/legal-entities/${id}`,
      data,
    );
  }

  /**
   * Удалить юридическое лицо
   */
  async delete(id: string) {
    return this.proxy.delete("LEGAL_ENTITIES_API", `/legal-entities/${id}`);
  }

  /**
   * Сохранить анкету
   */
  async saveQuestionnaire(data: {
    legalEntityId: string;
    questionnaireData: Record<string, unknown>;
    userId: string;
  }) {
    return this.proxy.post("LEGAL_ENTITIES_API", "/questionnaires", data);
  }

  /**
   * Получить последнюю анкету
   */
  async getQuestionnaire(legalEntityId: string) {
    return this.proxy.get("LEGAL_ENTITIES_API", "/questionnaires/latest", {
      legalEntityId,
    });
  }
}
