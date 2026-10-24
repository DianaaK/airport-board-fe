import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useQuery } from '../useQuery';

describe('useQuery', () => {
  it('starts loading and stores the successful result and timestamp', async () => {
    let resolveRequest: (data: string) => void;
    const fetcher = vi.fn().mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const { result } = renderHook(() => useQuery(fetcher));

    expect(result.current).toMatchObject({
      data: undefined,
      error: null,
      isLoading: true,
      isFetching: true,
      lastUpdated: null,
    });
    await act(async () => {
      resolveRequest('result');
    });
    expect(result.current).toMatchObject({
      data: 'result',
      isLoading: false,
      isFetching: false,
      error: null,
    });
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it('reports initial failures and normalizes non-Error rejections', async () => {
    const fetcher = vi.fn().mockRejectedValue('offline');
    const { result } = renderHook(() => useQuery(fetcher));
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.error).toEqual(new Error('offline'));
    expect(result.current.data).toBeUndefined();
    expect(result.current.lastUpdated).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('retains data while refreshing', async () => {
    let resolveRequest: (data: string) => void;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce('result')
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveRequest = resolve;
          }),
      );
    const { result } = renderHook(() => useQuery(fetcher));
    await waitFor(() => expect(result.current.data).toEqual('result'));

    act(() => {
      result.current.refetch();
    });
    expect(result.current).toMatchObject({
      data: 'result',
      isFetching: true,
      isLoading: false,
    });

    await act(async () => {
      resolveRequest('updated');
    });
    expect(result.current).toMatchObject({ data: 'updated', isFetching: false });
  });

  it('retains data and timestamp after a refresh failure', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(['first'])
      .mockRejectedValueOnce(new Error('offline'));
    const { result } = renderHook(() => useQuery(fetcher));
    await waitFor(() => expect(result.current.data).toEqual(['first']));
    const lastSuccessfulUpdate = result.current.lastUpdated;

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current).toMatchObject({
      data: ['first'],
      error: new Error('offline'),
      isFetching: false,
      isLoading: false,
    });
    expect(result.current.lastUpdated).toBe(lastSuccessfulUpdate);
  });

  it('clears the error after a successful retry', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(['first'])
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(['updated']);
    const { result } = renderHook(() => useQuery(fetcher));
    await waitFor(() => expect(result.current.data).toEqual(['first']));

    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.error).toEqual(new Error('offline'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current).toMatchObject({
      data: ['updated'],
      error: null,
      isFetching: false,
    });
  });

  it('ignores refetch calls while a request is pending', async () => {
    let resolveRequest: (data: string) => void;
    const fetcher = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const { result } = renderHook(() => useQuery(fetcher));
    await act(async () => {
      await result.current.refetch();
      await result.current.refetch();
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolveRequest('done');
    });
    expect(result.current.data).toBe('done');
  });

  it('ignores an old response when the fetcher changes', async () => {
    let resolveOldRequest: (data: string) => void;
    const oldFetcher = vi.fn(
      (_signal: AbortSignal) =>
        new Promise<string>((resolve) => {
          resolveOldRequest = resolve;
        }),
    );
    const newFetcher = vi.fn().mockResolvedValue('new');
    const { result, rerender } = renderHook(({ fetcher }) => useQuery(fetcher), {
      initialProps: { fetcher: oldFetcher },
    });
    rerender({ fetcher: newFetcher });
    await waitFor(() => expect(result.current.data).toBe('new'));
    expect(oldFetcher.mock.calls[0][0].aborted).toBe(true);
    await act(async () => {
      resolveOldRequest('old');
    });
    expect(result.current.data).toBe('new');
  });
});
