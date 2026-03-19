import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LegalEntitiesModule } from "./legal-entities/legal-entities.module";
import { ChecksModule } from "./checks/checks.module";
import { UsersModule } from "./users/users.module";
import { PrismaService } from "./prisma/prisma.service";
import { HealthController } from "./common/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    LegalEntitiesModule,
    ChecksModule,
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
