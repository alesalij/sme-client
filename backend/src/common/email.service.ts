import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;
  private from: string;
  private isEnabled: boolean = false;

  constructor(private config: ConfigService) {
    const host = this.config.get('EMAIL_HOST') || 'mail.rccf.ru';
    const port = this.config.get('EMAIL_PORT') || '275';
    const user = this.config.get('EMAIL_USER');
    const password = this.config.get('EMAIL_PASS');
    const from = this.config.get('EMAIL_FROM') || 'sme@rencredit.ru';

    const transportConfig: any = {
      host,
      port: parseInt(port as string),
      tls: {
        rejectUnauthorized: false,
      },
    };

    // Добавляем аутентификацию только если есть user и password
    if (user && password) {
      transportConfig.auth = { user, pass: password };
      transportConfig.secure =
        (this.config.get('EMAIL_SECURE') as string) === 'true';
    }

    if (host) {
      this.transporter = nodemailer.createTransport(transportConfig);
      this.from = from;
      this.isEnabled = true;
      console.log(`Email configured: ${host}:${port}, from: ${this.from}`);
    } else {
      console.log('Email not configured');
    }
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.isEnabled || !this.transporter) {
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
      await this.transporter.sendMail({
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
