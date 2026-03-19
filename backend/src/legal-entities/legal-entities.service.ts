import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import {
  CreateLegalEntityDto,
  UpdateLegalEntityDto,
  SaveQuestionnaireDto,
} from "./dto/legal-entity.dto";

@Injectable()
export class LegalEntitiesService {
  constructor(private prisma: PrismaService) {}

  async searchInSpark(inn: string) {
    // Mock implementation for development
    if (process.env.SPARK_MOCK === "true") {
      console.log(`Mocking Spark API search for INN: ${inn}`);
      return [
        {
          id: "1",
          inn,
          name: 'ООО "РОМАШКА"',
          fullName: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "РОМАШКА"',
          address: "г. Москва, ул. Ленина, д. 1",
          director: "Иванов Иван Иванович",
          activity: "Деятельность в области права",
          registrationDate: "2020-01-15",
        },
        {
          id: "2",
          inn,
          name: 'ООО "РОМАШКА ПЛЮС"',
          fullName: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "РОМАШКА ПЛЮС"',
          address: "г. Москва, ул. Пушкина, д. 10",
          director: "Петров Петр Петрович",
          activity: "Консультационные услуги",
          registrationDate: "2021-03-20",
        },
      ];
    }

    throw new Error("Spark API integration not implemented");
  }

  async getSparkDetails(legalEntityId: string, _inn: string) {
    if (process.env.SPARK_MOCK === "true") {
      console.log(
        `Mocking Spark API details for legal entity: ${legalEntityId}`,
      );
      return {
        sparkId: `SPARK_${legalEntityId}`,
        fullInfo: {
          registrationInfo: {
            date: "2020-01-15",
            authority: "ИФНС № 15 по г. Москве",
            status: "Действующее",
          },
          financials: {
            revenue: 50000000,
            profit: 10000000,
            employees: 25,
          },
          risks: {
            score: 85,
            hasBankruptcies: false,
            hasEnforcements: false,
          },
          connections: {
            shareholders: 2,
            subsidiaries: 1,
            affiliates: 3,
          },
        },
        retrievedAt: new Date().toISOString(),
      };
    }

    throw new Error("Spark API integration not implemented");
  }

  async findByInn(inn: string) {
    return this.prisma.legalEntity.findUnique({ where: { inn } });
  }

  async findById(id: string) {
    const entity = await this.prisma.legalEntity.findUnique({
      where: { id },
      include: {
        questionnaires: { orderBy: { createdAt: "desc" }, take: 1 },
        checks: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!entity) {
      throw new NotFoundException("Юридическое лицо не найдено");
    }
    return entity;
  }

  async create(data: CreateLegalEntityDto) {
    return this.prisma.legalEntity.create({
      data: {
        inn: data.inn,
        name: data.name,
        fullName: data.fullName,
        address: data.address,
        director: data.director,
        activity: data.activity,
        registrationDate: data.registrationDate
          ? new Date(data.registrationDate)
          : null,
        status: "IN_PROGRESS",
      },
    });
  }

  async update(id: string, data: UpdateLegalEntityDto) {
    return this.prisma.legalEntity.update({
      where: { id },
      data: {
        name: data.name,
        fullName: data.fullName,
        address: data.address,
        director: data.director,
        activity: data.activity,
        registrationDate: data.registrationDate
          ? new Date(data.registrationDate)
          : undefined,
      },
    });
  }

  async findAll(params: { skip?: number; take?: number }) {
    const [entities, total] = await Promise.all([
      this.prisma.legalEntity.findMany({
        skip: params.skip || 0,
        take: params.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          checks: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      }),
      this.prisma.legalEntity.count(),
    ]);

    return {
      data: entities,
      pagination: {
        total,
        page: Math.floor((params.skip || 0) / (params.take || 20)) + 1,
        limit: params.take || 20,
        pages: Math.ceil(total / (params.take || 20)),
      },
    };
  }

  async saveQuestionnaire(data: SaveQuestionnaireDto) {
    return this.prisma.questionnaire.create({
      data: {
        legalEntityId: data.legalEntityId,
        data: data.questionnaireData as Prisma.InputJsonValue,
      },
    });
  }

  async getQuestionnaire(legalEntityId: string) {
    return this.prisma.questionnaire.findFirst({
      where: { legalEntityId },
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(id: string) {
    return this.prisma.legalEntity.delete({ where: { id } });
  }
}
