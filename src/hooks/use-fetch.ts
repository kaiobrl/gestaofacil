"use client";

import { useState, useCallback } from "react";

interface UseFetchOptions<T> {
  url: string | null;
  initialData?: T;
  enabled?: boolean;
}

interface UseFetchResult<T> {
  data: T | undefined;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

export function useFetch<T>({ url, initialData, enabled = true }: UseFetchOptions<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  return { data, error, loading, refetch: fetchData };
}

export function useMutation<TData, TVariables>() {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (url: string, options?: { method?: string; body?: TVariables }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options?.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, mutate };
}
