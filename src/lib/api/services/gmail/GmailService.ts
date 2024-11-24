import { google } from 'googleapis';
import { AuthManager } from '../../auth/AuthManager';
import { EmailService, Email, EmailOptions } from '../types';

export class GmailService implements EmailService {
  private auth: AuthManager;
  private gmail = google.gmail('v1');

  constructor(auth: AuthManager) {
    this.auth = auth;
  }

  async listEmails(options: EmailOptions): Promise<Email[]> {
    try {
      const accessToken = await this.auth.getValidToken();
      const response = await this.gmail.users.messages.list({
        oauth_token: accessToken,
        userId: 'me',
        maxResults: options.limit,
        q: options.query,
      });

      const emails = await Promise.all(
        (response.data.messages || []).map(async (message) => {
          const details = await this.gmail.users.messages.get({
            oauth_token: accessToken,
            userId: 'me',
            id: message.id!,
          });

          return this.parseGmailMessage(details.data);
        })
      );

      return emails;
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const accessToken = await this.auth.getValidToken();
      const message = this.createEmailMessage(options);

      await this.gmail.users.messages.send({
        oauth_token: accessToken,
        userId: 'me',
        requestBody: {
          raw: message,
        },
      });
    } catch (error) {
      console.error('Error sending Gmail message:', error);
      throw new Error('Failed to send email');
    }
  }

  private parseGmailMessage(message: any): Email {
    const headers = message.payload.headers;
    return {
      id: message.id,
      subject: headers.find((h: any) => h.name === 'Subject')?.value || '',
      from: headers.find((h: any) => h.name === 'From')?.value || '',
      to: headers.find((h: any) => h.name === 'To')?.value || '',
      date: new Date(headers.find((h: any) => h.name === 'Date')?.value || ''),
      body: this.getMessageBody(message.payload),
    };
  }

  private getMessageBody(payload: any): string {
    if (payload.body.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }

    if (payload.parts) {
      return payload.parts
        .filter((part: any) => part.mimeType === 'text/plain')
        .map((part: any) => Buffer.from(part.body.data, 'base64').toString())
        .join('\n');
    }

    return '';
  }

  private createEmailMessage(options: EmailOptions): string {
    const email = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      `To: ${options.to}\n`,
      `Subject: ${options.subject}\n\n`,
      options.body,
    ].join('');

    return Buffer.from(email).toString('base64url');
  }
}