import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "./common/logger.module";
import { PrismaModule } from "./common/prisma.module";
import { DatabaseModule } from "./common/database.module";
import { ProxyModule } from "./common/proxy.module";
import { LegalEntitiesModule } from "./legal-entities/legal-entities.module";
import { ChecksModule } from "./checks/checks.module";
import { UsersModule } from "./users/users.module";
import { ExportModule } from "./export/export.module";
import { PersonsModule } from "./persons/persons.module";
import { HealthController } from "./common/health.controller";
import { RootController } from "./common/root.controller";

@Module({
 imports: [
 ConfigModule.forRoot({
 isGlobal: true,
 envFilePath: ".env",
 }),
 LoggerModule,
 PrismaModule,
 DatabaseModule,
 ProxyModule,
 LegalEntitiesModule,
 ChecksModule,
 UsersModule,
 ExportModule,
 PersonsModule,
 ],
 controllers: [HealthController, RootController],
})
export class AppModule {}
