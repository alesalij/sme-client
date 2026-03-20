import { Injectable } from "@nestjs/common";
import { ProxyService } from "../common/proxy.service";

@Injectable()
export class ChecksService {
  constructor(private proxy: ProxyService) {}

  /**
   * Запустить проверки для юридического лица
   */
  async startChecks(legalEntityId: string, userId: string) {
    return this.proxy.post("CHECKS_API", "/checks/start", {
      legalEntityId,
      userId,
    });
  }

  /**
   * Выполнить внутреннюю проверку
   */
  async performInternalCheck(
    legalEntityId: string,
    checkType: "INTERNAL_BASIC" | "INTERNAL_EXTENDED",
  ) {
    return this.proxy.post("CHECKS_API", "/checks/perform", {
      legalEntityId,
      checkType,
    });
  }

  /**
   * Выполнить периодическую проверку
   */
  async performPeriodicCheck(inn: string) {
    return this.proxy.post("CHECKS_API", "/checks/periodic", { inn });
  }

  /**
   * Получить все проверки для юридического лица
   */
  async findByLegalEntity(legalEntityId: string) {
    return this.proxy.get(
      "CHECKS_API",
      `/checks/legal-entity/${legalEntityId}`,
    );
  }

  /**
   * Получить проверку по ID
   */
  async findOne(id: string) {
    return this.proxy.get("CHECKS_API", `/checks/${id}`);
  }

  /**
   * Обновить статус проверки
   */
  async updateStatus(
    id: string,
    status: string,
    result?: string,
    data?: Record<string, unknown>,
  ) {
    return this.proxy.patch("CHECKS_API", `/checks/${id}`, {
      status,
      result,
      data,
    });
  }
}
