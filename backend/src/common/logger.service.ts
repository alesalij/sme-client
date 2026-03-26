import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
 level: 'log' | 'error' | 'warn' | 'debug' | 'verbose';
 message: string;
 context?: string;
 timestamp?: Date;
 stack?: string;
}

export interface EmailConfig {
 host: string;
 port: number;
 secure: boolean;
 auth: { user: string; pass: string; };
 from: string;
 to: string[];
}

export interface MattermostConfig {
 webhookUrl: string;
 channel?: string;
 username?: string;
 iconEmoji?: string;
}

@Injectable()
export class LoggerService implements NestLoggerService {
 private emailConfig: EmailConfig | null = null;
 private mattermostConfig: MattermostConfig | null = null;
 private isProduction: boolean;
 private errorBuffer: LogEntry[] = [];
 private readonly bufferSize =10;
 private readonly flushInterval =60000;
 private logDir: string;
 private logStream: fs.WriteStream | null = null;
 private errorStream: fs.WriteStream | null = null;

 constructor(private config: ConfigService) {
 this.isProduction = this.config.get('NODE_ENV') === 'production';
 this.initLogFiles();
 this.initEmailConfig();
 this.initMattermostConfig();

 setInterval(() => this.flushErrorBuffer(), this.flushInterval);
 }

 private initLogFiles(): void {
 // Директория для логов
 this.logDir = this.config.get('LOG_DIR') || path.join(process.cwd(), 'logs');
 
 // Создаем директорию если нет
 if (!fs.existsSync(this.logDir)) {
 fs.mkdirSync(this.logDir, { recursive: true });
 }

 const date = new Date().toISOString().split('T')[0];
 const logFile = path.join(this.logDir, `app-${date}.log`);
 const errorFile = path.join(this.logDir, `error-${date}.log`);

 this.logStream = fs.createWriteStream(logFile, { flags: 'a' });
 this.errorStream = fs.createWriteStream(errorFile, { flags: 'a' });

 // Очистка старых логов (старше30 дней)
 this.cleanOldLogs();
 }

 private cleanOldLogs(): void {
 try {
 const files = fs.readdirSync(this.logDir);
 const HalfYear = Date.now() -6*30 *24 *60 *60 *1000;

 files.forEach(file => {
 const filePath = path.join(this.logDir, file);
 const stats = fs.statSync(filePath);
 if (stats.mtimeMs< HalfYear) {
 fs.unlinkSync(filePath);
 }
 });
 } catch (error) {
 // Игнорируем ошибки очистки
 }
 }

 private getFormattedLine(entry: LogEntry): string {
 const timestamp = entry.timestamp?.toISOString() || new Date().toISOString();
 const context = entry.context ? `[${entry.context}]` : '';
 const level = entry.level.toUpperCase().padEnd(7);
 const stack = entry.stack ? `\n${entry.stack}` : '';
 
 return `${timestamp} ${level} ${context} ${entry.message}${stack}\n`;
 }

 private writeToFile(entry: LogEntry): void {
 const line = this.getFormattedLine(entry);
 
 this.logStream?.write(line);
 
 if (entry.level === 'error' || entry.level === 'warn') {
 this.errorStream?.write(line);
 }
 }

 private initEmailConfig(): void {
 const emailHost = this.config.get('EMAIL_HOST');
 if (emailHost) {
 this.emailConfig = {
 host: emailHost,
 port: this.config.get('EMAIL_PORT') ||587,
 secure: this.config.get('EMAIL_SECURE') === 'true',
 auth: {
 user: this.config.get('EMAIL_USER') || '',
 pass: this.config.get('EMAIL_PASS') || '',
 },
 from: this.config.get('EMAIL_FROM') || 'noreply@example.com',
 to: (this.config.get('EMAIL_TO') || '').split(',').filter(Boolean),
 };
 }
 }

 private initMattermostConfig(): void {
 const webhookUrl = this.config.get('MATTERMOST_WEBHOOK_URL');
 if (webhookUrl) {
 this.mattermostConfig = {
 webhookUrl,
 channel: this.config.get('MATTERMOST_CHANNEL'),
 username: this.config.get('MATTERMOST_USERNAME') || 'SME Bot',
 iconEmoji: this.config.get('MATTERMOST_ICON') || ':warning:',
 };
 }
 }

 log(message: string, context?: string) {
 const entry: LogEntry = {
 level: 'log',
 message,
 context,
 timestamp: new Date(),
 };
 this.logToConsole(entry);
 this.writeToFile(entry);
 }

 error(message: string, trace?: string, context?: string) {
 const entry: LogEntry = {
 level: 'error',
 message,
 context,
 timestamp: new Date(),
 stack: trace,
 };
 this.logToConsole(entry);
 this.writeToFile(entry);
 this.handleCriticalError(entry);
 }

 warn(message: string, context?: string) {
 const entry: LogEntry = {
 level: 'warn',
 message,
 context,
 timestamp: new Date(),
 };
 this.logToConsole(entry);
 this.writeToFile(entry);
 }

 debug(message: string, context?: string) {
 if (!this.isProduction) {
 const entry: LogEntry = {
 level: 'debug',
 message,
 context,
 timestamp: new Date(),
 };
 this.logToConsole(entry);
 this.writeToFile(entry);
 }
 }

 verbose(message: string, context?: string) {
 if (!this.isProduction) {
 const entry: LogEntry = {
 level: 'verbose',
 message,
 context,
 timestamp: new Date(),
 };
 this.logToConsole(entry);
 this.writeToFile(entry);
 }
 }

 private logToConsole(entry: LogEntry): void {
 const timestamp = entry.timestamp?.toISOString() || new Date().toISOString();
 const context = entry.context ? `[${entry.context}]` : '';
 const level = entry.level.toUpperCase().padEnd(7);
 
 console.log(`${timestamp} ${level} ${context} ${entry.message}`);
 if (entry.stack) {
 console.error(entry.stack);
 }
 }

 private async handleCriticalError(entry: LogEntry): Promise<void> {
 this.errorBuffer.push(entry);

 if (entry.level === 'error' && (entry.stack || entry.message.includes('FATAL'))) {
 await this.sendErrorNotification(entry);
 }

 if (this.errorBuffer.length >= this.bufferSize) {
 await this.flushErrorBuffer();
 }
 }

 private async flushErrorBuffer(): Promise<void> {
 if (this.errorBuffer.length ===0) return;

 const errors = [...this.errorBuffer];
 this.errorBuffer = [];

 const summary = this.createErrorSummary(errors);
 await this.sendErrorNotification(summary);
 }

 private createErrorSummary(errors: LogEntry[]): LogEntry {
 const uniqueContexts = [...new Set(errors.map(e => e.context).filter(Boolean))];
 const errorMessages = errors.slice(0,5).map(e => `- ${e.message}`).join('\n');

 return {
 level: 'error',
 message: `Критические ошибки (${errors.length}):\n${errorMessages}\n... контексты: ${uniqueContexts.join(', ')}`,
 context: 'ErrorSummary',
 timestamp: new Date(),
 };
 }

 private async sendErrorNotification(entry: LogEntry): Promise<void> {
 const promises: Promise<void>[] = [];

 if (this.emailConfig && this.emailConfig.to.length >0) {
 promises.push(this.sendEmail(entry));
 }

 if (this.mattermostConfig) {
 promises.push(this.sendMattermost(entry));
 }

 await Promise.allSettled(promises);
 }

 private async sendEmail(entry: LogEntry): Promise<void> {
 if (!this.emailConfig) return;

 try {
 const transporter = nodemailer.createTransport({
 host: this.emailConfig.host,
 port: this.emailConfig.port,
 secure: this.emailConfig.secure,
 auth: this.emailConfig.auth,
 });

 const subject = `[${this.isProduction ? 'PROD' : 'DEV'}] ${entry.level.toUpperCase()} - SME Client`;
 const htmlBody = this.formatEmailBody(entry);

 await transporter.sendMail({
 from: this.emailConfig.from,
 to: this.emailConfig.to,
 subject,
 html: htmlBody,
 });

 console.log(`Email notification sent: ${subject}`);
 } catch (error) {
 console.error('Failed to send email notification:', error);
 }
 }

 private formatEmailBody(entry: LogEntry): string {
 const timestamp = entry.timestamp?.toLocaleString('ru-RU') || new Date().toLocaleString('ru-RU');

 return `
<h2>🔴 Уведомление об ошибке</h2>
<table style="border-collapse: collapse; width:100%;">
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Уровень</strong></td>
<td style="padding:8px; border:1px solid #ddd;">${entry.level.toUpperCase()}</td>
</tr>
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Контекст</strong></td>
<td style="padding:8px; border:1px solid #ddd;">${entry.context || '-'}</td>
</tr>
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Время</strong></td>
<td style="padding:8px; border:1px solid #ddd;">${timestamp}</td>
</tr>
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Сообщение</strong></td>
<td style="padding:8px; border:1px solid #ddd;">${entry.message}</td>
</tr>
 ${entry.stack ? `
<tr>
<td style="padding:8px; border:1px solid #ddd; background: #f5f5f5;"><strong>Stack Trace</strong></td>
<td style="padding:8px; border:1px solid #ddd; font-family: monospace; font-size:12px; white-space: pre-wrap;">${entry.stack}</td>
</tr>
 ` : ''}
</table>
<p style="color: #666; font-size:12px; margin-top:20px;">
 Это автоматическое уведомление от системы SME Client
</p>
 `;
 }

 private async sendMattermost(entry: LogEntry): Promise<void> {
 if (!this.mattermostConfig) return;

 try {
 const timestamp = entry.timestamp?.toLocaleString('ru-RU') || new Date().toLocaleString('ru-RU');
 const emoji = entry.level === 'error' ? '🔴' : entry.level === 'warn' ? '⚠️' : 'ℹ️';

 const payload = {
 channel: this.mattermostConfig.channel,
 username: this.mattermostConfig.username,
 icon_emoji: this.mattermostConfig.iconEmoji,
 attachments: [
 {
 color: entry.level === 'error' ? '#ff0000' : entry.level === 'warn' ? '#ffa500' : '#008800',
 title: `${emoji} ${entry.level.toUpperCase()} - SME Client`,
 fields: [
 { short: true, title: 'Контекст', value: entry.context || '-' },
 { short: true, title: 'Время', value: timestamp },
 { short: false, title: 'Сообщение', value: entry.message.substring(0,500) },
 ],
 ...(entry.stack && { text: `\`\`\`\n${entry.stack.substring(0,1500)}\n\`\`\`` }),
 },
 ],
 };

 const response = await fetch(this.mattermostConfig.webhookUrl, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload),
 });

 if (!response.ok) {
 throw new Error(`Mattermost responded with ${response.status}`);
 }
 } catch (error) {
 console.error('Failed to send Mattermost notification:', error);
 }
 }
}
