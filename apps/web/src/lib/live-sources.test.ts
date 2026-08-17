import { afterEach, describe, expect, it, vi } from 'vitest';

import { LIVE_SEARCH_TIMEOUT_MS, searchLiveDataGovtNz, searchLiveNzorNames } from './live-sources';

function stubHangingFetch(): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('live-sources fetchers', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('aborts the NZOR fetch after the timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = stubHangingFetch();

    const promise = searchLiveNzorNames('kiwi');
    const expectation = expect(promise).rejects.toThrow('Aborted');
    await vi.advanceTimersByTimeAsync(LIVE_SEARCH_TIMEOUT_MS);

    await expectation;
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('data.nzor.org.nz'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('aborts the data.govt.nz fetch after the timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = stubHangingFetch();

    const promise = searchLiveDataGovtNz('water');
    const expectation = expect(promise).rejects.toThrow('Aborted');
    await vi.advanceTimersByTimeAsync(LIVE_SEARCH_TIMEOUT_MS);

    await expectation;
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('catalogue.data.govt.nz'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
