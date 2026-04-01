import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

export interface VDmPerson {
 id: number;
 inn: string;
 ogrn?: string;
 name?: string;
 full_name?: string;
 type?: string;
 status?: string;
 reg_date?: Date;
 kpp?: string;
 reg_address?: string;
 fact_address?: string;
 ceo?: string;
 beneficiary?: string;
 okved?: string;
 is_resident?: boolean;
 created_at?: Date;
 updated_at?: Date;
}

export interface VDmPersonQueryParams {
 skip?: number;
 take?: number;
 inn?: string;
 ogrn?: string;
 name?: string;
 type?: string;
 status?: string;
}

export interface PaginatedResult<T> {
 items: T[];
 total: number;
 page: number;
 limit: number;
 totalPages: number;
}

@Injectable()
export class PersonsService {
 constructor(private prisma: PrismaService) {}

 /**
 * Получить список персон с пагинацией
 */
 async findAll(params: VDmPersonQueryParams): Promise<PaginatedResult<VDmPerson>> {
 const { skip =0, take =20, inn, ogrn, name, type, status } = params;

 // Построение условий WHERE
 const whereClauses: string[] = [];
 const queryParams: (string | number)[] = [];
 let paramIndex =1;

 if (inn) {
 whereClauses.push(`inn ILIKE $${paramIndex}`);
 queryParams.push(`%${inn}%`);
 paramIndex++;
 }
 if (ogrn) {
 whereClauses.push(`ogrn ILIKE $${paramIndex}`);
 queryParams.push(`%${ogrn}%`);
 paramIndex++;
 }
 if (name) {
 whereClauses.push(`(name ILIKE $${paramIndex} OR full_name ILIKE $${paramIndex})`);
 queryParams.push(`%${name}%`);
 paramIndex++;
 }
 if (type) {
 whereClauses.push(`type = $${paramIndex}`);
 queryParams.push(type);
 paramIndex++;
 }
 if (status) {
 whereClauses.push(`status = $${paramIndex}`);
 queryParams.push(status);
 paramIndex++;
 }

 const whereClause = whereClauses.length >0 
 ? `WHERE ${whereClauses.join(' AND ')}` 
 : '';

 // Получаем общее количество
 const countQuery = `SELECT COUNT(*) as total FROM v_dm_persons ${whereClause}`;
 const countResult = await this.prisma.$queryRawUnsafe<[{ total: bigint }]>(
 countQuery,
 ...queryParams
 );
 const total = Number(countResult[0]?.total ||0);

 // Получаем данные с пагинацией
 const dataQuery = `
 SELECT * FROM v_dm_persons 
 ${whereClause}
 ORDER BY id DESC
 LIMIT $${paramIndex} OFFSET $${paramIndex +1}
 `;
 queryParams.push(take, skip);

 const items = await this.prisma.$queryRawUnsafe<VDmPerson[]>(
 dataQuery,
 ...queryParams
 );

 const page = Math.floor(skip / take) +1;
 const totalPages = Math.ceil(total / take);

 return {
 items,
 total,
 page,
 limit: take,
 totalPages,
 };
 }

 /**
 * Получить персону по ID
 */
 async findById(id: number): Promise<VDmPerson | null> {
 const result = await this.prisma.$queryRawUnsafe<VDmPerson[]>(
 'SELECT * FROM v_dm_persons WHERE id = $1 LIMIT1',
 id
 );
 return result[0] || null;
 }

 /**
 * Получить персону по ИНН
 */
 async findByInn(inn: string): Promise<VDmPerson | null> {
 const result = await this.prisma.$queryRawUnsafe<VDmPerson[]>(
 'SELECT * FROM v_dm_persons WHERE inn = $1 LIMIT1',
 inn
 );
 return result[0] || null;
 }

 /**
 * Поиск персон по нескольким критериям
 */
 async search(query: string, limit =50): Promise<VDmPerson[]> {
 const result = await this.prisma.$queryRawUnsafe<VDmPerson[]>(
 `SELECT * FROM v_dm_persons 
 WHERE inn ILIKE $1 OR name ILIKE $1 OR full_name ILIKE $1
 ORDER BY name ASC
 LIMIT $2`,
 `%${query}%`,
 limit
 );
 return result;
 }
}
