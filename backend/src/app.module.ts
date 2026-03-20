import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProxyModule } from "./common/proxy.module";
import { LegalEntitiesModule } from "./legal-entities/legal-entities.module";
import { ChecksModule } from "./checks/checks.module";
import { UsersModule } from "./users/users.module";
import { HealthController } from "./common/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ProxyModule,
    LegalEntitiesModule,
    ChecksModule,
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
