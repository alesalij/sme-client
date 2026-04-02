import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Pool, QueryResult, QueryResultRow } from "pg";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "sme_client",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async onModuleInit() {
    const client = await this.pool.connect();
    client.release();
    console.log("Database connected");
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  // Выполнить сырой SQL запрос
  async $queryRawUnsafe<T = QueryResultRow>(
    query: string,
    ...params: unknown[]
  ): Promise<T[]> {
    const result = await this.pool.query(query, params);
    return result.rows as T[];
  }

  // Выполнить запрос с параметрами
  async query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }
}
