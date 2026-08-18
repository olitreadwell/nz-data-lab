import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

type ChangeListener = (event: { matches: boolean }) => void;

const mediaQueryListeners = new Map<string, ChangeListener>();

function mockMatchMedia(query: string): MediaQueryList {
  const mediaQueryList = {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: (type: string, listener: ChangeListener) => {
      if (type === 'change') {
        mediaQueryListeners.set(query, listener);
      }
    },
    removeEventListener: (type: string, listener: ChangeListener) => {
      if (type === 'change' && mediaQueryListeners.get(query) === listener) {
        mediaQueryListeners.delete(query);
      }
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
  return mediaQueryList;
}

function setReducedMotion(matches: boolean): void {
  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
  Object.defineProperty(mediaQueryList, 'matches', { value: matches, configurable: true });
  act(() => {
    const listener = mediaQueryListeners.get('(prefers-reduced-motion: reduce)');
    listener?.({ matches });
  });
}

describe('usePrefersReducedMotion', () => {
  const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(mockMatchMedia);

  afterEach(() => {
    mediaQueryListeners.clear();
    matchMediaSpy.mockReset();
    matchMediaSpy.mockImplementation(mockMatchMedia);
  });

  it('defaults to false when reduced motion is not requested', () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it('reports true when reduced motion is requested', () => {
    const mediaQueryList = mockMatchMedia('(prefers-reduced-motion: reduce)');
    Object.defineProperty(mediaQueryList, 'matches', { value: true });
    matchMediaSpy.mockReturnValue(mediaQueryList);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    setReducedMotion(true);
    expect(result.current).toBe(true);
    setReducedMotion(false);
    expect(result.current).toBe(false);
  });
});
