/**
 * Formats a sheep count as a rounded millions figure, e.g. "23.3 million sheep".
 *
 * @param value - the raw sheep count
 * @returns the formatted string
 */
export function formatMillions(value: number): string {
  return `${(value / 1000000).toFixed(1)} million sheep`;
}
