import { z } from 'zod';
import { ApiClient } from '../../ApiClient';
import { retryWithBackoff } from '../../../utils/retry';

export const CallStatusSchema = z.enum([
  'initiated',
  'ringing',
  'in-progress',
  'completed',
  'failed',
  'no-answer',
]);

export const MessageStatusSchema = z.enum([
  'queued',
  'sent',
  'delivered',
  'failed',
]);

export type CallStatus = z.infer<typeof CallStatusSchema>;
export type MessageStatus = z.infer<typeof MessageStatusSchema>;

export interface CallLog {
  id: string;
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  status: CallStatus;
  duration: number;
  timestamp: Date;
  recording?: string;
  transcription?: string;
}

export interface MessageLog {
  id: string;
  phoneNumber: string;
  content: string;
  status: MessageStatus;
  timestamp: Date;
}

export class ThreeCXService {
  private api: ApiClient;

  constructor(
    private apiKey: string,
    private baseUrl: string
  ) {
    this.api = new ApiClient(baseUrl);
  }

  async initiateCall(phoneNumber: string, options?: {
    script?: string;
    recordCall?: boolean;
    transcribe?: boolean;
  }): Promise<string> {
    try {
      const response = await retryWithBackoff(
        () => this.api.request<{ callId: string }>('/calls', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: {
            phoneNumber,
            ...options,
          },
        }),
        { maxRetries: 3, baseDelay: 1000, maxDelay: 5000 }
      );

      return response.callId;
    } catch (error) {
      console.error('Failed to initiate call:', error);
      throw new Error('Call initiation failed');
    }
  }

  async sendMessage(phoneNumber: string, content: string): Promise<string> {
    try {
      const response = await retryWithBackoff(
        () => this.api.request<{ messageId: string }>('/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: {
            phoneNumber,
            content,
          },
        }),
        { maxRetries: 3, baseDelay: 1000, maxDelay: 5000 }
      );

      return response.messageId;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Message sending failed');
    }
  }

  async getCallStatus(callId: string): Promise<CallStatus> {
    try {
      const response = await this.api.request<{ status: CallStatus }>(
        `/calls/${callId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return CallStatusSchema.parse(response.status);
    } catch (error) {
      console.error('Failed to get call status:', error);
      throw new Error('Failed to retrieve call status');
    }
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      const response = await this.api.request<{ status: MessageStatus }>(
        `/messages/${messageId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return MessageStatusSchema.parse(response.status);
    } catch (error) {
      console.error('Failed to get message status:', error);
      throw new Error('Failed to retrieve message status');
    }
  }

  async getCallLogs(options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<CallLog[]> {
    try {
      const response = await this.api.request<CallLog[]>('/calls/logs', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        params: options,
      });

      return response;
    } catch (error) {
      console.error('Failed to get call logs:', error);
      throw new Error('Failed to retrieve call logs');
    }
  }

  async getMessageLogs(options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<MessageLog[]> {
    try {
      const response = await this.api.request<MessageLog[]>('/messages/logs', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        params: options,
      });

      return response;
    } catch (error) {
      console.error('Failed to get message logs:', error);
      throw new Error('Failed to retrieve message logs');
    }
  }

  async scheduleCall(
    phoneNumber: string,
    scheduledTime: Date,
    options?: {
      script?: string;
      recordCall?: boolean;
      transcribe?: boolean;
    }
  ): Promise<string> {
    try {
      const response = await this.api.request<{ scheduleId: string }>(
        '/calls/schedule',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: {
            phoneNumber,
            scheduledTime: scheduledTime.toISOString(),
            ...options,
          },
        }
      );

      return response.scheduleId;
    } catch (error) {
      console.error('Failed to schedule call:', error);
      throw new Error('Call scheduling failed');
    }
  }

  async scheduleMessage(
    phoneNumber: string,
    content: string,
    scheduledTime: Date
  ): Promise<string> {
    try {
      const response = await this.api.request<{ scheduleId: string }>(
        '/messages/schedule',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: {
            phoneNumber,
            content,
            scheduledTime: scheduledTime.toISOString(),
          },
        }
      );

      return response.scheduleId;
    } catch (error) {
      console.error('Failed to schedule message:', error);
      throw new Error('Message scheduling failed');
    }
  }
}