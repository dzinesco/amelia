import { Client } from '@microsoft/microsoft-graph-client';
import { AuthManager } from '../../auth/AuthManager';
import { EmailService, Email, EmailOptions } from '../types';

export class OutlookService implements EmailService {
  private auth: AuthManager;
  private client: Client;

  constructor(auth: AuthManager) {
    this.auth = auth;
    this.client = Client.init({
      authProvider: async (done) => {
        try {
          const token = await this.auth.getValidToken();
          done(null, token);
        } catch (error) {
          done(error as Error, null);
        }
      },
    });
  }

  async listEmails(options: EmailOptions): Promise<Email[]> {
    try {
      const response = await this.client
        .api('/me/messages')
        .top(options.limit || 10)
        .filter(options.query || '')
        .get();

      return response.value.map(this.parseOutlookMessage);
    } catch (error) {
      console.error('Error fetching Outlook messages:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.client.api('/me/sendMail').post({
        message: {
          subject: options.subject,
          body: {
            contentType: 'Text',
            content: options.body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: options.to,
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error sending Outlook message:', error);
      throw new Error('Failed to send email');
    }
  }

  private parseOutlookMessage(message: any): Email {
    return {
      id: message.id,
      subject: message.subject,
      from: message.from.emailAddress.address,
      to: message.toRecipients[0]?.emailAddress.address,
      date: new Date(message.receivedDateTime),
      body: message.body.content,
    };
  }
}