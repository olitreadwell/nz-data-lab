/**
 * Formats a rabbits-per-kilometre spotlight rate with one decimal place,
 * e.g. "13.3 per km".
 *
 * @param value - the pooled rate
 * @returns the formatted string
 */
export function formatRabbitsPerKm(value: number): string {
  return `${value.toFixed(1)} per km`;
}

/**
 * Formats a raw rabbit count with thousands separators, e.g. "3,102".
 *
 * @param value - the raw count
 * @returns the formatted string
 */
export function formatRabbitCount(value: number): string {
  return value.toLocaleString('en-NZ');
}
