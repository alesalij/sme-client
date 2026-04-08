import { Injectable } from '@nestjs/common';
import { ProxyService } from '../common/proxy.service';
import { EmailService } from '../common/email.service';

export interface BatchImportResult {
  success: number;
  failed: number;
  errors: string[];
}

@Injectable()
export class LegalEntitiesService {
  constructor(
    private proxy: ProxyService,
    private emailService: EmailService,
  ) {}

  /**
   * Получить все юридические лица
   */
  async findAll(params: { skip?: number; take?: number }) {
    return this.proxy.get('LEGAL_ENTITIES_API', '/legal-entities', {
      skip: String(params.skip || 0),
      take: String(params.take || 20),
    });
  }

  /**
   * Получить юридическое лицо по ID
   */
  async findById(id: string) {
    return this.proxy.get('LEGAL_ENTITIES_API', `/legal-entities/${id}`);
  }

  /**
   * Получить юридическое лицо по ИНН
   */
  async findByInn(inn: string) {
    return this.proxy.get(
      'LEGAL_ENTITIES_API',
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
    return this.proxy.post('LEGAL_ENTITIES_API', '/legal-entities', data);
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
      'LEGAL_ENTITIES_API',
      `/legal-entities/${id}`,
      data,
    );
  }

  /**
   * Удалить юридическое лицо
   */
  async delete(id: string) {
    return this.proxy.delete('LEGAL_ENTITIES_API', `/legal-entities/${id}`);
  }

  /**
   * Сохранить анкету
   */
  async saveQuestionnaire(data: {
    legalEntityId: string;
    questionnaireData: Record<string, unknown>;
    userId: string;
  }) {
    return this.proxy.post('LEGAL_ENTITIES_API', '/questionnaires', data);
  }

  /**
   * Получить последнюю анкету
   */
  async getQuestionnaire(legalEntityId: string) {
    return this.proxy.get('LEGAL_ENTITIES_API', '/questionnaires/latest', {
      legalEntityId,
    });
  }

  /**
   * Batch import legal entities
   */
  async batchImport(
    items: Array<{
      inn?: string;
      ogrn?: string;
      account?: string;
      name?: string;
      fullName?: string;
      kpp?: string;
      regAddress?: string;
      factAddress?: string;
      ceo?: string;
      beneficiary?: string;
      regDate?: string;
      okved?: string;
      type?: string;
    }>,
    notifyEmail?: string,
  ): Promise<BatchImportResult> {
    const results: BatchImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const item of items) {
      try {
        await this.proxy.post('LEGAL_ENTITIES_API', '/legal-entities', item);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to import ${item.inn || item.name}: ${(error as Error).message}`,
        );
      }
    }

    // Отправить результат на почту
    if (notifyEmail && this.emailService.isConfigured()) {
      const htmlBody = `
        <h2>Результат импорта юридических лиц</h2>
        <p><strong>Успешно:</strong> ${results.success}</p>
        <p><strong>Ошибок:</strong> ${results.failed}</p>
        ${
          results.errors.length > 0
            ? `
          <h3>Ошибки:</h3>
          <ul>
            ${results.errors.map((e) => `<li>${e}</li>`).join('')}
          </ul>
        `
            : ''
        }
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Автоматическое уведомление от SME Client
        </p>
      `;

      await this.emailService.send({
        to: notifyEmail,
        subject: `[SME Client] Результат импорта юридических лиц`,
        html: htmlBody,
      });
    }

    return results;
  }
}
