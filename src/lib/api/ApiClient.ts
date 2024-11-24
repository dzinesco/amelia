import { retryWithBackoff } from '../utils/retry';
import { CacheManager } from '../cache/CacheManager';
import { WorkerPool } from '../workers/WorkerPool';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  retry?: boolean;
  background?: boolean;
}

export class ApiClient {
  private cache: CacheManager<any>;
  private workerPool: WorkerPool;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.cache = new CacheManager();
    this.workerPool = new WorkerPool();
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache = false,
      retry = true,
      background = false,
    } = options;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body)}`;

    if (cache && method === 'GET') {
      try {
        const cachedData = await this.cache.get(cacheKey, z.any(), () =>
          this.executeRequest<T>(endpoint, { method, headers, body, retry })
        );
        return cachedData;
      } catch (error) {
        console.error('Cache error:', error);
        // Fall through to normal request
      }
    }

    if (background) {
      return this.workerPool.execute(() =>
        this.executeRequest<T>(endpoint, { method, headers, body, retry })
      );
    }

    return this.executeRequest<T>(endpoint, { method, headers, body, retry });
  }

  private async executeRequest<T>(
    endpoint: string,
    options: Required<Omit<RequestOptions, 'cache' | 'background'>>
  ): Promise<T> {
    const { method, headers, body, retry } = options;

    const fetchFn = async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json();
    };

    if (retry) {
      return retryWithBackoff(fetchFn, {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 5000,
      });
    }

    return fetchFn();
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      // Implement pattern-based cache invalidation
    } else {
      this.cache.clear();
    }
  }
}