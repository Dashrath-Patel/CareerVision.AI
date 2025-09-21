"use client";

import { useEffect, useState } from "react";

export function useApi<T>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

export function useMutation<T, U>(
  mutationFn: (data: U) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: U): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}