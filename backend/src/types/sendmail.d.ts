declare module 'sendmail' {
  interface SendmailOptions {
    from?: string;
    to: string;
    cc?: string;
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer;
    }>;
  }

  interface SendmailInstance {
    (options: SendmailOptions, callback: (err: Error | null) => void): void;
  }

  interface SendmailConfig {
    silent?: boolean;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    defaultFrom?: string;
  }

  function sendmail(config?: SendmailConfig): SendmailInstance;
  export = sendmail;
}
