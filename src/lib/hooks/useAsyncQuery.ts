import { useState, useEffect, useCallback } from 'react';
import { CacheManager } from '../cache/CacheManager';
import { z } from 'zod';

interface QueryOptions<T> {
  enabled?: boolean;
  retry?: boolean;
  cacheTime?: number;
  staleTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

const cache = new CacheManager();

export function useAsyncQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  schema: z.ZodSchema<T>,
  options: QueryOptions<T> = {}
): QueryResult<T> {
  const {
    enabled = true,
    retry = true,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await cache.get(key, schema, queryFn);
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Query failed');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, queryFn, schema, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  const refetch = useCallback(async () => {
    cache.invalidate(key);
    await fetchData();
  }, [key, fetchData]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    refetch,
  };
}