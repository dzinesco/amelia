import { Client } from '@microsoft/microsoft-graph-client';
import { ChatIntegration, ChatPlatform, Message } from './types';

export class TeamsIntegration implements ChatIntegration {
  platform = ChatPlatform.Teams;
  private graphClient: Client;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private commandHandlers: Map<string, (args: string[], message: Message) => void> = new Map();

  constructor(private token: string) {
    this.graphClient = Client.init({
      authProvider: (done) => done(null, token)
    });
  }

  async connect(): Promise<void> {
    try {
      // Test connection by getting current user
      await this.graphClient.api('/me').get();
    } catch (error) {
      console.error('Failed to connect to Teams:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.messageCallbacks = [];
    this.commandHandlers.clear();
  }

  async sendMessage(channelId: string, content: string, thread?: string): Promise<void> {
    try {
      await this.graphClient.api(`/teams/${channelId}/channels/${thread || 'primary'}/messages`)
        .post({
          body: {
            content
          }
        });
    } catch (error) {
      console.error('Failed to send Teams message:', error);
      throw error;
    }
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  onCommand(command: string, callback: (args: string[], message: Message) => void): void {
    this.commandHandlers.set(command, callback);
  }

  private async handleMessage(message: any): Promise<void> {
    try {
      const formattedMessage: Message = {
        id: message.id,
        platform: ChatPlatform.Teams,
        content: message.body.content,
        sender: {
          id: message.from.user.id,
          name: message.from.user.displayName,
          avatar: undefined
        },
        channel: {
          id: message.channelIdentity.channelId,
          name: await this.getChannelName(message.channelIdentity)
        },
        thread: message.replyToId,
        timestamp: new Date(message.createdDateTime),
        attachments: message.attachments?.map((attachment: any) => ({
          type: attachment.contentType,
          url: attachment.contentUrl,
          name: attachment.name
        }))
      };

      if (formattedMessage.content.startsWith('/')) {
        const [cmd, ...args] = formattedMessage.content.slice(1).split(' ');
        const handler = this.commandHandlers.get(cmd);
        if (handler) {
          handler(args, formattedMessage);
          return;
        }
      }

      for (const callback of this.messageCallbacks) {
        callback(formattedMessage);
      }
    } catch (error) {
      console.error('Failed to handle Teams message:', error);
    }
  }

  private async getChannelName(channelIdentity: any): Promise<string> {
    try {
      const channel = await this.graphClient.api(
        `/teams/${channelIdentity.teamId}/channels/${channelIdentity.channelId}`
      ).get();
      return channel.displayName;
    } catch (error) {
      console.error('Failed to get channel name:', error);
      return 'Unknown Channel';
    }
  }
}