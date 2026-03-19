import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CheckStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

@Injectable()
export class ChecksService {
  constructor(private prisma: PrismaService) {}

  async performSparkCheck(legalEntityId: string) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = {
      id: `spark_${Date.now()}`,
      type: "SPARK" as const,
      status: "COMPLETED" as const,
      data: {
        riskScore: 85,
        hasNegativeInfo: false,
        checks: [
          { name: "Реестр недобросовестных поставщиков", passed: true },
          { name: "Список дисквалифицированных лиц", passed: true },
          { name: "Признаки фирмы-однодневки", passed: true },
          { name: "Арбитражные дела", passed: true },
          { name: "Исполнительные производства", passed: true },
        ],
        recommendations: "Риски не выявлены",
      },
      result: "Проверка пройдена успешно",
      performedAt: new Date().toISOString(),
    };

    // Update check record
    const check = await this.prisma.check.findFirst({
      where: { legalEntityId, type: "SPARK" },
      orderBy: { createdAt: "desc" },
    });

    if (check) {
      await this.prisma.check.update({
        where: { id: check.id },
        data: {
          status: "COMPLETED",
          result: result.result,
          data: result.data,
          performedAt: new Date(),
        },
      });
    }

    // Update legal entity
    await this.prisma.legalEntity.update({
      where: { id: legalEntityId },
      data: { sparkData: result.data },
    });

    return result;
  }

  async performInternalCheck(
    legalEntityId: string,
    checkType: "INTERNAL_BASIC" | "INTERNAL_EXTENDED",
  ) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = {
      id: `internal_${Date.now()}`,
      type: checkType,
      status: "COMPLETED" as const,
      data: {
        blacklistCheck: false,
        sanctionsCheck: false,
        pepCheck: false,
        historyCheck: "Нет истории сотрудничества",
        riskFactors: [],
      },
      result: "Внутренние проверки пройдены",
      performedAt: new Date().toISOString(),
    };

    const check = await this.prisma.check.findFirst({
      where: { legalEntityId, type: checkType },
      orderBy: { createdAt: "desc" },
    });

    if (check) {
      await this.prisma.check.update({
        where: { id: check.id },
        data: {
          status: "COMPLETED",
          result: result.result,
          data: result.data,
          performedAt: new Date(),
        },
      });
    }

    await this.prisma.legalEntity.update({
      where: { id: legalEntityId },
      data: { internalChecksData: result.data },
    });

    return result;
  }

  async startChecks(legalEntityId: string) {
    const checks = await this.prisma.$transaction([
      this.prisma.check.create({
        data: { legalEntityId, type: "SPARK", status: "PENDING" },
      }),
      this.prisma.check.create({
        data: { legalEntityId, type: "INTERNAL_BASIC", status: "PENDING" },
      }),
      this.prisma.check.create({
        data: { legalEntityId, type: "INTERNAL_EXTENDED", status: "PENDING" },
      }),
      this.prisma.check.create({
        data: { legalEntityId, type: "CONSOLIDATED", status: "PENDING" },
      }),
    ]);

    return checks;
  }

  async findByLegalEntity(legalEntityId: string) {
    return this.prisma.check.findMany({
      where: { legalEntityId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const check = await this.prisma.check.findUnique({ where: { id } });
    if (!check) {
      throw new NotFoundException("Проверка не найдена");
    }
    return check;
  }

  async updateStatus(
    id: string,
    status: CheckStatus,
    result?: string,
    data?: Prisma.InputJsonValue,
  ) {
    return this.prisma.check.update({
      where: { id },
      data: {
        status,
        result,
        data: data as Prisma.InputJsonValue,
        performedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
  }

  async performPeriodicCheck(inn: string) {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const hasIssues = Math.random() > 0.7;

    const result = {
      id: `periodic_${Date.now()}`,
      type: "PERIODIC" as const,
      status: "COMPLETED" as const,
      data: {
        inn,
        lastCheckDate: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        changesDetected: hasIssues,
        changes: hasIssues
          ? [
              {
                field: "director",
                oldValue: "Иванов И.И.",
                newValue: "Петров П.П.",
              },
              {
                field: "address",
                oldValue: "ул. Ленина, 1",
                newValue: "ул. Пушкина, 10",
              },
            ]
          : [],
        recommendations: hasIssues
          ? "Требуется обновить документы"
          : "Изменений не обнаружено",
      },
      result: hasIssues ? "Обнаружены изменения" : "Изменений не обнаружено",
      performedAt: new Date().toISOString(),
    };

    await this.prisma.check.create({
      data: {
        type: "PERIODIC",
        status: "COMPLETED",
        data: result.data,
        result: result.result,
        performedAt: new Date(),
      },
    });

    return result;
  }
}
