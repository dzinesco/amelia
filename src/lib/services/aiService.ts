import OpenAI from 'openai';
import { MemoryService } from './memoryService';
import { AIMessage, MessageRole } from '../types/ai';
import { MemoryMetadata } from '../types/memory';

interface ProcessMessageOptions {
  systemPrompt?: string;
  metadata?: Partial<MemoryMetadata>;
}

export class AIService {
  private openai: OpenAI;
  private memoryService: MemoryService;

  constructor(apiKey: string, memoryService: MemoryService) {
    this.openai = new OpenAI({ apiKey });
    this.memoryService = memoryService;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw new Error('Embedding generation failed');
    }
  }

  async processMessage(
    message: string,
    context: AIMessage[],
    options: ProcessMessageOptions = {}
  ): Promise<string> {
    try {
      const embedding = await this.generateEmbedding(message);
      
      const memories = await this.memoryService.searchMemories(embedding, {
        limit: 5,
        minScore: 0.7,
        filter: this.buildMemoryFilter(options.metadata),
      });

      const conversationContext = [
        {
          role: MessageRole.System,
          content: this.buildSystemPrompt(memories, options.systemPrompt),
        },
        ...context.slice(-5),
        { role: MessageRole.User, content: message },
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: conversationContext,
        temperature: 0.7,
        stream: true,
      });

      let response = '';
      for await (const chunk of completion) {
        if (chunk.choices[0]?.delta?.content) {
          response += chunk.choices[0].delta.content;
        }
      }

      await this.memoryService.storeMemory(
        `User: ${message}\nAssistant: ${response}`,
        embedding,
        {
          type: 'conversation',
          importance: this.calculateImportance(message, response),
          ...options.metadata,
        }
      );

      return response;
    } catch (error) {
      console.error('Failed to process message:', error);
      throw new Error('Message processing failed');
    }
  }

  private buildSystemPrompt(memories: any[], customPersonality?: string): string {
    const relevantMemories = memories
      .map(m => m.metadata.text)
      .join('\n\n');

    return `${customPersonality || ''}\n\nRelevant context from previous conversations:\n\n${relevantMemories}`;
  }

  private buildMemoryFilter(metadata: Partial<MemoryMetadata> = {}): Record<string, any> {
    const filter: Record<string, any> = {};
    
    if (metadata.type) {
      filter.type = metadata.type;
    }
    
    if (metadata.tags?.length) {
      filter.tags = { $in: metadata.tags };
    }

    return filter;
  }

  private calculateImportance(message: string, response: string): number {
    const combinedText = `${message} ${response}`.toLowerCase();
    const importantKeywords = [
      'remember', 'important', 'urgent', 'critical',
      'schedule', 'meeting', 'deadline', 'priority',
    ];

    const hasImportantKeywords = importantKeywords.some(
      keyword => combinedText.includes(keyword)
    );

    return hasImportantKeywords ? 1 : 0.5;
  }
}