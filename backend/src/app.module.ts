import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma.module';
import { ProxyModule } from './common/proxy.module';
import { EmailModule } from './common/email.module';
import { LegalEntitiesModule } from './legal-entities/legal-entities.module';
import { ChecksModule } from './checks/checks.module';
import { UsersModule } from './users/users.module';
import { PersonsModule } from './persons/persons.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ProxyModule,
    EmailModule,
    LegalEntitiesModule,
    ChecksModule,
    UsersModule,
    PersonsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
