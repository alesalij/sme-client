import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { ProxyModule } from '../common/proxy.module';

@Module({
 imports: [ProxyModule],
 controllers: [ExportController],
 providers: [ExportService],
 exports: [ExportService],
})
export class ExportModule {}
