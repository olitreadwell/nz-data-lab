import { afterEach, describe, expect, it } from 'vitest';

import { getDarkThemeInitScript } from './dark-theme-init';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * Replaces `window.matchMedia` with a controllable mock so the generated
 * script can be exercised in jsdom, which does not implement `matchMedia`.
 *
 * @param initialMatches - whether the OS starts in dark mode
 * @returns a `setMatches` helper that flips the preference and fires the
 *   change listeners, mirroring how the OS theme change is reported
 */
function installPrefersColorSchemeMock(initialMatches: boolean): {
  setMatches: (next: boolean) => void;
} {
  const listeners = new Set<(event: Event) => void>();
  let matches = initialMatches;

  const mediaQueryList: MediaQueryList = {
    media: DARK_SCHEME_QUERY,
    onchange: null,
    get matches(): boolean {
      return matches;
    },
    addEventListener: (_type: string, listener: (event: Event) => void): void => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: Event) => void): void => {
      listeners.delete(listener);
    },
    addListener: (): void => undefined,
    removeListener: (): void => undefined,
    dispatchEvent: () => false,
  };

  window.matchMedia = (_query: string) => mediaQueryList;

  return {
    setMatches(next: boolean): void {
      matches = next;
      for (const listener of listeners) {
        listener(new Event('change'));
      }
    },
  };
}

function runThemeInitScript(): void {
  window.eval(getDarkThemeInitScript());
}

afterEach(() => {
  document.documentElement.classList.remove('dark');
});

describe('getDarkThemeInitScript', () => {
  it('adds the dark class when the OS prefers dark', () => {
    installPrefersColorSchemeMock(true);

    runThemeInitScript();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('keeps the light theme when the OS prefers light', () => {
    installPrefersColorSchemeMock(false);

    runThemeInitScript();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('tracks OS preference changes after first paint', () => {
    const mock = installPrefersColorSchemeMock(false);

    runThemeInitScript();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    mock.setMatches(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    mock.setMatches(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
