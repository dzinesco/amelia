import { ChatIntegration, ChatPlatform, Message, ChatConfig } from './types';
import { MattermostIntegration } from './MattermostIntegration';
import { TeamsIntegration } from './TeamsIntegration';
import { useAmeliaStore } from '../../store/useAmeliaStore';

export class ChatManager {
  private integrations: Map<ChatPlatform, ChatIntegration> = new Map();
  private configs: Map<ChatPlatform, ChatConfig> = new Map();

  async initialize(configs: ChatConfig[]): Promise<void> {
    for (const config of configs) {
      if (!config.enabled) continue;

      let integration: ChatIntegration;

      switch (config.platform) {
        case ChatPlatform.Mattermost:
          integration = new MattermostIntegration(
            config.credentials.serverUrl,
            config.credentials.token,
            config.credentials.botUsername
          );
          break;

        case ChatPlatform.Teams:
          integration = new TeamsIntegration(
            config.credentials.token
          );
          break;

        default:
          continue;
      }

      try {
        await integration.connect();
        this.setupIntegration(integration);
        this.integrations.set(config.platform, integration);
        this.configs.set(config.platform, config);
      } catch (error) {
        console.error(`Failed to initialize ${config.platform} integration:`, error);
      }
    }
  }

  async shutdown(): Promise<void> {
    for (const integration of this.integrations.values()) {
      await integration.disconnect();
    }
    this.integrations.clear();
    this.configs.clear();
  }

  private setupIntegration(integration: ChatIntegration): void {
    // Set up message handling
    integration.onMessage(async (message) => {
      const { processMessage } = useAmeliaStore.getState();
      
      try {
        const response = await processMessage(message.content);
        await this.sendResponse(message, response);
      } catch (error) {
        console.error('Failed to process message:', error);
        await this.sendResponse(message, 
          "I apologize, but I encountered an error processing your request."
        );
      }
    });

    // Set up common commands
    integration.onCommand('help', (_, message) => {
      this.sendResponse(message, 
        "Available commands:\n" +
        "/help - Show this help message\n" +
        "/status - Check Amelia's status\n" +
        "/clear - Clear conversation history"
      );
    });

    integration.onCommand('status', (_, message) => {
      const platforms = Array.from(this.integrations.keys())
        .map(p => p.toString())
        .join(', ');

      this.sendResponse(message,
        `Amelia is online and connected to: ${platforms}`
      );
    });
  }

  private async sendResponse(originalMessage: Message, content: string): Promise<void> {
    const integration = this.integrations.get(originalMessage.platform);
    if (!integration) return;

    try {
      await integration.sendMessage(
        originalMessage.channel.id,
        content,
        originalMessage.thread
      );
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  }

  async broadcastMessage(content: string, platforms: ChatPlatform[] = []): Promise<void> {
    const targetPlatforms = platforms.length > 0 
      ? platforms 
      : Array.from(this.integrations.keys());

    for (const platform of targetPlatforms) {
      const integration = this.integrations.get(platform);
      const config = this.configs.get(platform);
      
      if (!integration || !config) continue;

      try {
        // Send to all configured channels for broadcasts
        const broadcastChannels = config.webhooks.outgoing
          .filter(w => w.events.includes('broadcast'))
          .map(w => w.url.split('/').pop()!);

        for (const channelId of broadcastChannels) {
          await integration.sendMessage(channelId, content);
        }
      } catch (error) {
        console.error(`Failed to broadcast to ${platform}:`, error);
      }
    }
  }
}