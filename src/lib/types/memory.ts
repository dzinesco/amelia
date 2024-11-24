import { z } from 'zod';

export const MemoryMetadataSchema = z.object({
  type: z.enum(['conversation', 'task', 'calendar', 'email']),
  importance: z.number().min(0).max(1).optional(),
  context: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type MemoryMetadata = z.infer<typeof MemoryMetadataSchema>;

export interface VectorizedMemory {
  id: string;
  values: number[];
  metadata: MemoryMetadata & {
    text: string;
    timestamp: string;
  };
}

export interface MemorySearchResult {
  id: string;
  score: number;
  metadata: VectorizedMemory['metadata'];
}