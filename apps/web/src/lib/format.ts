/** Converts a hectare count to square kilometres, e.g. "37,627 ha" -> "376.3 km²". */
export function formatAreaKm2(hectares: number): string {
  const squareKilometres = hectares / 100;
  return `${squareKilometres.toLocaleString('en-NZ', { maximumFractionDigits: 1 })} km²`;
}

/** Formats a raw count as a rounded millions figure, e.g. "5.8 million". */
export function formatMillions(value: number): string {
  return `${(value / 1000000).toFixed(1)} million`;
}
