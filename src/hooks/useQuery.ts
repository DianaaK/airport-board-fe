import { useCallback, useEffect, useRef, useState } from 'react';

interface QueryState<T> {
  data: T | undefined;
  error: Error | null;
  isFetching: boolean;
  lastUpdated: Date | null;
}

interface UseQueryOptions {
  refetchInterval?: number;
}

export type QueryStatus = 'initial-loading' | 'initial-error' | 'success' | 'refreshing' | 'stale';

function getQueryStatus<T>(state: QueryState<T>): QueryStatus {
  if (state.data === undefined) return state.isFetching ? 'initial-loading' : 'initial-error';
  if (state.error) return 'stale';
  return state.isFetching ? 'refreshing' : 'success';
}

// One resource per mount: changing the fetcher does not invalidate existing data.
export function useQuery<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  { refetchInterval = 0 }: UseQueryOptions = {},
) {
  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    error: null,
    isFetching: true,
    lastUpdated: null,
  });
  const fetcherRef = useRef(fetcher);
  const controllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(false);

  // Update after commit rather than mutating a ref during render.
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const refetch = useCallback(async () => {
    if (!isMountedRef.current || controllerRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    const isActive = () => controllerRef.current === controller && !controller.signal.aborted;

    // Keep a previous refresh error visible until a successful response arrives.
    setState((previous) => ({ ...previous, isFetching: true }));
    try {
      const data = await fetcherRef.current(controller.signal);
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
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    // Scheduling also lets Strict Mode clean up its first setup before fetching.
    const initial = window.setTimeout(() => void refetch(), 0);
    const interval =
      refetchInterval > 0 ? window.setInterval(() => void refetch(), refetchInterval) : undefined;
    return () => {
      isMountedRef.current = false;
      window.clearTimeout(initial);
      if (interval !== undefined) window.clearInterval(interval);
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [refetch, refetchInterval]);

  return {
    ...state,
    status: getQueryStatus(state),
    isLoading: state.isFetching && state.data === undefined,
    isInitialError: state.error !== null && state.data === undefined,
    isRefreshError: state.error !== null && state.data !== undefined,
    isStale: state.error !== null && state.data !== undefined,
    refetch,
  };
}
