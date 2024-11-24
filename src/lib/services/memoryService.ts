import { Pinecone } from '@pinecone-database/pinecone';
import { z } from 'zod';
import { MemoryMetadata, VectorizedMemory } from '../types/memory';
import { retryWithBackoff } from '../utils/retry';

const MEMORY_INDEX = 'amelia-memories';
const MEMORY_NAMESPACE = 'general';
const MAX_VECTORS = 1000;

export class MemoryService {
  private pinecone: Pinecone;
  private index: any;

  constructor(apiKey: string) {
    this.pinecone = new Pinecone({ apiKey });
    this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      this.index = this.pinecone.index(MEMORY_INDEX);
      await this.validateIndex();
    } catch (error) {
      console.error('Failed to initialize Pinecone index:', error);
      throw new Error('Memory system initialization failed');
    }
  }

  private async validateIndex() {
    const indexDescription = await this.index.describeIndex();
    if (indexDescription.dimension !== 1536) {
      throw new Error('Invalid index configuration');
    }
  }

  async storeMemory(
    text: string,
    embedding: number[],
    metadata: MemoryMetadata
  ): Promise<string> {
    try {
      const id = this.generateMemoryId();
      const vector: VectorizedMemory = {
        id,
        values: embedding,
        metadata: {
          ...metadata,
          text,
          timestamp: new Date().toISOString(),
        },
      };

      await retryWithBackoff(
        () => this.upsertVector(vector),
        {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 5000,
        }
      );

      await this.pruneOldMemories();
      return id;
    } catch (error) {
      console.error('Failed to store memory:', error);
      throw new Error('Memory storage failed');
    }
  }

  async searchMemories(
    embedding: number[],
    options: {
      limit?: number;
      minScore?: number;
      filter?: Record<string, any>;
    } = {}
  ) {
    try {
      const { limit = 5, minScore = 0.7, filter } = options;

      const results = await retryWithBackoff(
        () => this.index.query({
          vector: embedding,
          topK: limit,
          includeMetadata: true,
          includeValues: false,
          filter,
          namespace: MEMORY_NAMESPACE,
        }),
        {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 5000,
        }
      );

      return results.matches
        .filter(match => match.score >= minScore)
        .map(match => ({
          id: match.id,
          score: match.score,
          metadata: match.metadata,
        }));
    } catch (error) {
      console.error('Failed to search memories:', error);
      throw new Error('Memory search failed');
    }
  }

  async deleteMemory(id: string): Promise<void> {
    try {
      await retryWithBackoff(
        () => this.index.deleteOne(id, { namespace: MEMORY_NAMESPACE }),
        {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 5000,
        }
      );
    } catch (error) {
      console.error('Failed to delete memory:', error);
      throw new Error('Memory deletion failed');
    }
  }

  private async upsertVector(vector: VectorizedMemory): Promise<void> {
    await this.index.upsert([
      {
        ...vector,
        namespace: MEMORY_NAMESPACE,
      },
    ]);
  }

  private async pruneOldMemories(): Promise<void> {
    try {
      const stats = await this.index.describeIndexStats();
      const totalVectors = stats.namespaces[MEMORY_NAMESPACE]?.vectorCount || 0;

      if (totalVectors > MAX_VECTORS) {
        const results = await this.index.query({
          vector: new Array(1536).fill(0),
          topK: totalVectors - MAX_VECTORS,
          includeMetadata: false,
          namespace: MEMORY_NAMESPACE,
          filter: {
            timestamp: {
              $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        });

        if (results.matches.length > 0) {
          const ids = results.matches.map(match => match.id);
          await this.index.deleteMany(ids, { namespace: MEMORY_NAMESPACE });
        }
      }
    } catch (error) {
      console.error('Failed to prune old memories:', error);
    }
  }

  private generateMemoryId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
}