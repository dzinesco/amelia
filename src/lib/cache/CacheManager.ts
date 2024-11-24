import { z } from 'zod';

export interface CacheOptions {
  ttl?: number;  // Time to live in milliseconds
  maxSize?: number;  // Maximum number of items in cache
  updateInterval?: number;  // Background update interval
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
}

export class CacheManager<T> {
  private cache: Map<string, CacheEntry<T>>;
  private options: Required<CacheOptions>;
  private updateTimer?: NodeJS.Timer;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.options = {
      ttl: options.ttl ?? 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize ?? 1000,
      updateInterval: options.updateInterval ?? 60 * 1000, // 1 minute default
    };

    this.startBackgroundUpdate();
  }

  async get<S extends z.ZodSchema>(
    key: string,
    schema: S,
    fetchFn: () => Promise<z.infer<S>>
  ): Promise<z.infer<S>> {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (entry && now < entry.expiresAt) {
      entry.lastAccessed = now;
      return schema.parse(entry.value);
    }

    const value = await fetchFn();
    const validated = schema.parse(value);
    
    this.set(key, validated);
    return validated;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.options.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.options.ttl,
      lastAccessed: Date.now(),
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruKey = key;
        lruTime = entry.lastAccessed;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  private startBackgroundUpdate(): void {
    this.updateTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now >= entry.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, this.options.updateInterval);
  }

  destroy(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }
}