import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;
  private from: string;
  private isEnabled: boolean = false;

  constructor(private config: ConfigService) {
    const host = this.config.get("EMAIL_HOST");
    const port = this.config.get("EMAIL_PORT");
    const user = this.config.get("EMAIL_USER");
    const password = this.config.get("EMAIL_PASS");

    if (host && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port as string) || 587,
        secure: (this.config.get("EMAIL_SECURE") as string) === "true",
        auth: {
          user,
          pass: password,
        },
      });

      this.from = (this.config.get("EMAIL_FROM") as string) || "SME Client <noreply@example.com>";
      this.isEnabled = true;
    }
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.isEnabled || !this.transporter) {
      console.log("Email disabled or not configured");
      return false;
    }

    const recipients = Array.isArray(options.to) ? options.to.join(", ") : options.to;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: recipients,
        subject: options.subject,
        html: options.html,
      });
      console.log(`Email sent to ${recipients}`);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.isEnabled;
  }
}
