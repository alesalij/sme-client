import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as util from 'util';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sendmail = require('sendmail');

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

@Injectable()
export class EmailService {
  private sendmailAsync: ReturnType<typeof util.promisify> | null = null;
  private from: string;
  private isEnabled: boolean = false;

  constructor(private config: ConfigService) {
    const smtpHost = this.config.get('EMAIL_SMTP_HOST') || 'mail.rccf.ru';
    const smtpPort = this.config.get('EMAIL_SMTP_PORT') || '275';
    const from = this.config.get('EMAIL_FROM') || 'sme@rencredit.ru';

    if (smtpHost && smtpPort) {
      const sendmailInstance = sendmail({
        silent: true,
        smtpHost,
        smtpPort: parseInt(smtpPort),
      });

      this.sendmailAsync = util.promisify(sendmailInstance);
      this.from = from;
      this.isEnabled = true;
      console.log(
        `Email configured: ${smtpHost}:${smtpPort}, from: ${this.from}`,
      );
    } else {
      console.log('Email not configured');
    }
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.isEnabled || !this.sendmailAsync) {
      console.log('Email disabled or not configured');
      return false;
    }

    const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    const cc = options.cc
      ? Array.isArray(options.cc)
        ? options.cc.join(', ')
        : options.cc
      : undefined;

    try {
      const reply = await this.sendmailAsync({
        from: this.from,
        to,
        cc,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      });

      console.log(`Email sent to ${to}: ${options.subject}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.isEnabled;
  }
}
