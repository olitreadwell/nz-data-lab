const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/**
 * Returns a self-contained inline script that applies the dark theme from the
 * user's OS `prefers-color-scheme` preference before first paint. It is
 * injected into `<head>` in the root layout so a user on a dark OS preference
 * never sees a flash of the light theme.
 *
 * The script toggles the `.dark` class on `<html>`, which the token system
 * (`packages/ui/src/tokens/tokens.css`) and the Tailwind `dark` variant both
 * consume, and keeps the class in sync when the OS preference changes.
 *
 * @returns a JavaScript string safe to inject via `dangerouslySetInnerHTML`
 */
export function getDarkThemeInitScript(): string {
  return `(function () {
  var query = window.matchMedia ? window.matchMedia('${DARK_SCHEME_QUERY}') : null;
  function applyTheme() {
    document.documentElement.classList.toggle('dark', !!(query && query.matches));
  }
  applyTheme();
  if (query && query.addEventListener) {
    query.addEventListener('change', applyTheme);
  }
})();`;
}
