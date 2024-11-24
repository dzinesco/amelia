import { useState, useCallback } from 'react';
import { WorkerPool } from '../workers/WorkerPool';

interface MutationOptions<T, R> {
  onSuccess?: (data: R) => void;
  onError?: (error: Error) => void;
  onSettled?: (data?: R, error?: Error) => void;
  background?: boolean;
}

interface MutationResult<T, R> {
  mutate: (variables: T) => Promise<void>;
  data: R | undefined;
  error: Error | null;
  isLoading: boolean;
  reset: () => void;
}

const workerPool = new WorkerPool();

export function useAsyncMutation<T, R>(
  mutationFn: (variables: T) => Promise<R>,
  options: MutationOptions<T, R> = {}
): MutationResult<T, R> {
  const { onSuccess, onError, onSettled, background = false } = options;

  const [data, setData] = useState<R>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeMutation = async (variables: T) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = background
        ? await workerPool.execute(() => mutationFn(variables))
        : await mutationFn(variables);

      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Mutation failed');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      onSettled?.(data, error);
    }
  };

  const mutate = useCallback(
    async (variables: T) => {
      await executeMutation(variables);
    },
    [executeMutation]
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    data,
    error,
    isLoading,
    reset,
  };
}