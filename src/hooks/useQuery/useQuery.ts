import { useCallback, useEffect, useRef, useState } from 'react';

interface QueryState<T> {
  key: string;
  data: T | undefined;
  error: Error | null;
  isFetching: boolean;
  lastUpdated: Date | null;
}

type QueryOptions<T> = {
  queryKey: unknown[];
  queryFn: (signal: AbortSignal) => Promise<T>;
  enabled?: boolean;
};

export const useQuery = <T>({ queryKey, queryFn, enabled = true }: QueryOptions<T>) => {
  const key = JSON.stringify(queryKey);
  const [state, setState] = useState<QueryState<T>>({
    key,
    data: undefined,
    error: null,
    isFetching: enabled,
    lastUpdated: null,
  });

  const controllerRef = useRef<AbortController | null>(null);
  const queryFnRef = useRef(queryFn);

  const refetch = useCallback(async () => {
    if (!enabled || controllerRef.current) {
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    const isActive = () => controllerRef.current === controller && !controller.signal.aborted;

    setState((previous) =>
      previous.key === key
        ? { ...previous, isFetching: true }
        : { key, data: undefined, error: null, isFetching: true, lastUpdated: null },
    );

    try {
      const data = await queryFnRef.current(controller.signal);
      if (isActive()) {
        setState({ key, data, error: null, isFetching: false, lastUpdated: new Date() });
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
  }, [key, enabled]);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

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
