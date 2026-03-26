import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DatabaseService {
 constructor(private prisma: PrismaService) {}

 // Legal Entities
 async createLegalEntity(data: {
 inn: string;
 ogrn?: string;
 kpp?: string;
 name?: string;
 fullName?: string;
 regAddress?: string;
 factAddress?: string;
 ceo?: string;
 beneficiary?: string;
 regDate?: Date;
 okved?: string;
 account?: string;
 isResident?: boolean;
 type?: string;
 }) {
 return this.prisma.legalEntity.upsert({
 where: { inn: data.inn },
 update: data,
 create: data,
 });
 }

 async createManyLegalEntities(items: Array<{
 inn: string;
 ogrn?: string;
 kpp?: string;
 name?: string;
 fullName?: string;
 regAddress?: string;
 factAddress?: string;
 ceo?: string;
 beneficiary?: string;
 regDate?: Date;
 okved?: string;
 account?: string;
 isResident?: boolean;
 type?: string;
 }>) {
 const results = { success:0, failed:0, errors: [] as string[] };

 for (const item of items) {
 try {
 await this.prisma.legalEntity.upsert({
 where: { inn: item.inn },
 update: item,
 create: item,
 });
 results.success++;
 } catch (error) {
 results.failed++;
 results.errors.push(`Failed to import ${item.inn}: ${(error as Error).message}`);
 }
 }

 return results;
 }

 async findLegalEntityByInn(inn: string) {
 return this.prisma.legalEntity.findUnique({
 where: { inn },
 });
 }

 async findLegalEntities(params: {
 skip?: number;
 take?: number;
 inn?: string;
 ogrn?: string;
 name?: string;
 }) {
 const { skip =0, take =20, inn, ogrn, name } = params;

 return this.prisma.legalEntity.findMany({
 skip,
 take,
 where: {
 ...(inn && { inn: { contains: inn } }),
 ...(ogrn && { ogrn: { contains: ogrn } }),
 ...(name && { name: { contains: name, mode: 'insensitive' } }),
 },
 orderBy: { createdAt: 'desc' },
 });
 }

 // Related Persons
 async createRelatedPerson(data: {
 legalEntityInn: string;
 inn: string;
 name: string;
 type: string;
 relation: string;
 isClient?: boolean;
 }) {
 return this.prisma.relatedPerson.create({ data });
 }

 async createManyRelatedPersons(items: Array<{
 legalEntityInn: string;
 inn: string;
 name: string;
 type: string;
 relation: string;
 isClient?: boolean;
 }>) {
 return this.prisma.relatedPerson.createMany({ data: items, skipDuplicates: true });
 }

 async findRelatedPersons(legalEntityInn: string) {
 return this.prisma.relatedPerson.findMany({
 where: { legalEntityInn },
 });
 }

 // Search History
 async createSearchHistory(data: {
 userId?: string;
 searchParams: Record<string, unknown>;
 resultsCount: number;
 }) {
 return this.prisma.searchHistory.create({
 data: {
 ...data,
 searchParams: data.searchParams as any,
 },
 });
 }

 async getSearchHistory(userId?: string, limit =50) {
 return this.prisma.searchHistory.findMany({
 where: userId ? { userId } : undefined,
 take: limit,
 orderBy: { createdAt: 'desc' },
 });
 }

 // Export History
 async createExportHistory(data: {
 userId?: string;
 itemsCount: number;
 options: Record<string, unknown>;
 status?: string;
 }) {
 return this.prisma.exportHistory.create({
 data: {
 ...data,
 options: data.options as any,
 },
 });
 }

 async updateExportHistory(id: number, data: {
 status?: string;
 result?: Record<string, unknown>;
 completedAt?: Date;
 }) {
 return this.prisma.exportHistory.update({
 where: { id },
 data: {
 ...data,
 result: data.result as any,
 },
 });
 }

 async getExportHistory(userId?: string, limit =50) {
 return this.prisma.exportHistory.findMany({
 where: userId ? { userId } : undefined,
 take: limit,
 orderBy: { createdAt: 'desc' },
 });
 }
}
