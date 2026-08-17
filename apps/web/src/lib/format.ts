/** Formats a hectare count with thousands separators, e.g. "37,627 ha". */
export function formatHectares(value: number): string {
  return `${Math.round(value).toLocaleString('en-NZ')} ha`;
}

/** Formats a raw count as a rounded millions figure, e.g. "5.8 million". */
export function formatMillions(value: number): string {
  return `${(value / 1000000).toFixed(1)} million`;
}
