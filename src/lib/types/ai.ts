export enum MessageRole {
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
}

export interface AIMessage {
  role: MessageRole;
  content: string;
  timestamp?: Date;
}

export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}