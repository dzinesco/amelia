import { ChatIntegration, ChatPlatform, Message } from './types';

export class MattermostIntegration implements ChatIntegration {
  platform = ChatPlatform.Mattermost;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private commandHandlers: Map<string, (args: string[], message: Message) => void> = new Map();
  private baseUrl: string;
  private token: string;
  private botUsername: string;

  constructor(serverUrl: string, token: string, botUsername: string) {
    this.baseUrl = serverUrl;
    this.token = token;
    this.botUsername = botUsername;
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v4/users/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Mattermost');
      }
    } catch (error) {
      console.error('Failed to connect to Mattermost:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.messageCallbacks = [];
    this.commandHandlers.clear();
  }

  async sendMessage(channelId: string, content: string, thread?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v4/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          channel_id: channelId,
          message: content,
          root_id: thread,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send Mattermost message:', error);
      throw error;
    }
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  onCommand(command: string, callback: (args: string[], message: Message) => void): void {
    this.commandHandlers.set(command, callback);
  }

  private async handleMessage(post: any): Promise<void> {
    try {
      const [user, channel] = await Promise.all([
        this.fetchUser(post.user_id),
        this.fetchChannel(post.channel_id),
      ]);

      const message: Message = {
        id: post.id,
        platform: ChatPlatform.Mattermost,
        content: post.message,
        sender: {
          id: user.id,
          name: user.username,
          avatar: user.last_picture_update ? 
            `${this.baseUrl}/api/v4/users/${user.id}/image?_=${user.last_picture_update}` : 
            undefined
        },
        channel: {
          id: channel.id,
          name: channel.display_name
        },
        thread: post.root_id || undefined,
        timestamp: new Date(post.create_at),
      };

      if (message.content.startsWith('/')) {
        const [cmd, ...args] = message.content.slice(1).split(' ');
        const handler = this.commandHandlers.get(cmd);
        if (handler) {
          handler(args, message);
          return;
        }
      }

      for (const callback of this.messageCallbacks) {
        callback(message);
      }
    } catch (error) {
      console.error('Failed to handle Mattermost message:', error);
    }
  }

  private async fetchUser(userId: string) {
    const response = await fetch(`${this.baseUrl}/api/v4/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.json();
  }

  private async fetchChannel(channelId: string) {
    const response = await fetch(`${this.baseUrl}/api/v4/channels/${channelId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.json();
  }
}