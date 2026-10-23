import { useCallback, useEffect, useRef, useState } from 'react';

interface QueryState<T> {
  data: T | undefined;
  error: Error | null;
  isFetching: boolean;
  lastUpdated: Date | null;
}

export const useQuery = <T>(fetcher: (signal: AbortSignal) => Promise<T>) => {
  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    error: null,
    isFetching: true,
    lastUpdated: null,
  });
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    if (controllerRef.current) {
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    const isActive = () => controllerRef.current === controller && !controller.signal.aborted;

    setState((previous) => ({ ...previous, isFetching: true }));
    try {
      const data = await fetcher(controller.signal);
      if (isActive()) {
        setState({ data, error: null, isFetching: false, lastUpdated: new Date() });
      }
    } catch (error) {
      if (isActive()) {
        setState((previous) => ({
          ...previous,
          error: error instanceof Error ? error : new Error(String(error)),
          isFetching: false,
        }));
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
    return () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [refetch]);

  return {
    ...state,
    isLoading: state.isFetching && state.data === undefined,
    refetch,
  };
};
