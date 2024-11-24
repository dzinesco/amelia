import { z } from 'zod';

export enum ChatPlatform {
  Mattermost = 'mattermost',
  Teams = 'teams',
  Direct = 'direct'
}

export const MessageSchema = z.object({
  id: z.string(),
  platform: z.nativeEnum(ChatPlatform),
  content: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional()
  }),
  channel: z.object({
    id: z.string(),
    name: z.string()
  }),
  thread: z.string().optional(),
  timestamp: z.date(),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string(),
    name: z.string()
  })).optional()
});

export type Message = z.infer<typeof MessageSchema>;

export interface ChatIntegration {
  platform: ChatPlatform;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(channelId: string, content: string, thread?: string): Promise<void>;
  onMessage(callback: (message: Message) => void): void;
  onCommand(command: string, callback: (args: string[], message: Message) => void): void;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
}

export interface ChatConfig {
  platform: ChatPlatform;
  enabled: boolean;
  webhooks: {
    incoming: WebhookConfig[];
    outgoing: WebhookConfig[];
  };
  credentials: Record<string, string>;
}