import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from '../common/proxy.service';
import { LoggerService } from '../common/logger.service';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

export interface ExportItem {
 inn?: string;
 ogrn?: string;
 account?: string;
 name?: string;
 type?: string;
 [key: string]: unknown;
}

export interface ExportOptions {
 [key: string]: boolean;
}

export interface ExportResult {
 totalClients: number;
 successCount: number;
 failedCount: number;
 items: ExportItem[];
 errors: string[];
}

@Injectable()
export class ExportService {
 private emailTransporter: nodemailer.Transporter | null = null;
 private fromEmail: string;

 constructor(
 private config: ConfigService,
 private proxy: ProxyService,
 private logger: LoggerService,
 ) {
 this.initEmailTransporter();
 this.fromEmail = this.config.get('EXPORT_EMAIL_FROM') || 'noreply@example.com';
 }

 private initEmailTransporter(): void {
 const host = this.config.get('EMAIL_HOST');
 const port = this.config.get('EMAIL_PORT');
 const user = this.config.get('EMAIL_USER');
 const pass = this.config.get('EMAIL_PASS');

 if (host && user && pass) {
 this.emailTransporter = nodemailer.createTransport({
 host,
 port: Number(port) ||587,
 secure: port === '465',
 auth: { user, pass },
 });
 }
 }

 /**
 * Массовая выгрузка клиентов
 */
 async massExport(
 items: ExportItem[],
 options: ExportOptions,
 actualDate?: string,
 notifyEmail?: string,
 ): Promise<ExportResult> {
 this.logger.log(`Начало массовой выгрузки: ${items.length} клиентов`, 'Export');

 const result: ExportResult = {
 totalClients: items.length,
 successCount:0,
 failedCount:0,
 items: [],
 errors: [],
 };

 // Выполняем запрос к внешнему сервису
 try {
 const response = await this.proxy.post('LEGAL_ENTITIES_API', '/export/mass', {
 items,
 options,
 actualDate,
 });

 // Обрабатываем результат
 const exportData = response as ExportResult;
 result.items = exportData.items || [];
 result.successCount = exportData.successCount || items.length;
 result.failedCount = exportData.failedCount ||0;
 result.errors = exportData.errors || [];

 // Генерируем XML и отправляем на email
 if (notifyEmail) {
 await this.sendResultByEmail(result, notifyEmail);
 }

 this.logger.log(`Массовая выгрузка завершена: ${result.successCount} успешно`, 'Export');

 } catch (error) {
 this.logger.error(`Ошибка массовой выгрузки: ${(error as Error).message}`, (error as Error).stack, 'Export');
 throw new HttpException(
 `Ошибка выгрузки: ${(error as Error).message}`,
 HttpStatus.BAD_GATEWAY,
 );
 }

 return result;
 }

 /**
 * Генерация XML из результата
 */
 private generateXml(result: ExportResult): string {
 const itemsXml = result.items.map(item => {
 const fields: string[] = [];
 for (const [key, value] of Object.entries(item)) {
 if (value !== undefined && value !== null) {
 fields.push(`<${key}>${this.escapeXml(String(value))}</${key}>`);
 }
 }
 return `<item>\n${fields.join('\n')}\n</item>`;
 }).join('\n');

 const errorsXml = result.errors.map(err => 
 `<error>${this.escapeXml(err)}</error>`
 ).join('\n');

 return `<?xml version="1.0" encoding="UTF-8"?>
<ExportResult>
<summary>
<totalClients>${result.totalClients}</totalClients>
<successCount>${result.successCount}</successCount>
<failedCount>${result.failedCount}</failedCount>
</summary>
<errors>
${errorsXml}
</errors>
<items>
${itemsXml}
</items>
</ExportResult>`;
 }

 private escapeXml(str: string): string {
 return str
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&apos;');
 }

 /**
 * Сохранение XML в файл
 */
 private saveXmlToFile(xml: string): string {
 const logDir = this.config.get('LOG_DIR') || path.join(process.cwd(), 'logs');
 const exportDir = path.join(logDir, 'exports');
 
 if (!fs.existsSync(exportDir)) {
 fs.mkdirSync(exportDir, { recursive: true });
 }

 const filename = `export_${new Date().toISOString().replace(/[:.]/g, '-')}.xml`;
 const filePath = path.join(exportDir, filename);
 
 fs.writeFileSync(filePath, xml, 'utf-8');
 this.logger.log(`XML сохранен: ${filePath}`, 'Export');

 return filePath;
 }

 /**
 * Отправка результата на email
 */
 private async sendResultByEmail(result: ExportResult, email: string): Promise<void> {
 if (!this.emailTransporter) {
 this.logger.warn('Email transporter не настроен', 'Export');
 return;
 }

 try {
 // Генерируем XML
 const xml = this.generateXml(result);
 const filePath = this.saveXmlToFile(xml);

 // Читаем файл
 const xmlBuffer = fs.readFileSync(filePath);

 // Отправляем email
 await this.emailTransporter.sendMail({
 from: this.fromEmail,
 to: email,
 subject: `[SME Client] Результаты выгрузки ${new Date().toLocaleDateString('ru-RU')}`,
 html: `
<h2>Результаты массовой выгрузки</h2>
<table style="border-collapse: collapse; width:100%;">
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Всего клиентов</strong></td>
<td style="padding:8px; border:1px solid #ddd;">${result.totalClients}</td>
</tr>
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Успешно</strong></td>
<td style="padding:8px; border:1px solid #ddd; color: green;">${result.successCount}</td>
</tr>
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Ошибки</strong></td>
<td style="padding:8px; border:1px solid #ddd; color: red;">${result.failedCount}</td>
</tr>
</table>
<p>Подробности в прикрепленном XML файле.</p>
 `,
 attachments: [
 {
 filename: `export_${new Date().toISOString().split('T')[0]}.xml`,
 content: xmlBuffer,
 },
 ],
 });

 this.logger.log(`Результат отправлен на ${email}`, 'Export');

 } catch (error) {
 this.logger.error(`Ошибка отправки email: ${(error as Error).message}`, (error as Error).stack, 'Export');
 }
 }
}
