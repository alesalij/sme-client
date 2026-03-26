import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ExportService, ExportItem, ExportOptions, ExportResult } from './export.service';

interface MassExportDto {
 items: ExportItem[];
 options: ExportOptions;
 actualDate?: string;
 notifyEmail?: string;
}

@Controller('export')
export class ExportController {
 constructor(private exportService: ExportService) {}

 @Post('mass')
 @HttpCode(HttpStatus.OK)
 async massExport(@Body() dto: MassExportDto): Promise<ExportResult> {
 return this.exportService.massExport(
 dto.items,
 dto.options,
 dto.actualDate,
 dto.notifyEmail,
 );
 }
}
