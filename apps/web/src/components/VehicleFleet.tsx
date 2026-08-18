'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, SunburstChart, Tooltip } from 'recharts';
import type { SunburstData, TooltipContentProps } from 'recharts';

import { fetchLiveMvrFleet } from '@/lib/live-sources';
import type { LiveMvrFleetRow } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const TOP_N = 8;

type ViewMode = 'motivePower' | 'vehicleType';

interface FleetDatum {
  label: string;
  count: number;
}

/** One sector in the sunburst and its legend entry: label, count, and fill colour. */
interface SectorDatum extends FleetDatum {
  color: string;
}

/** Colour per sector, reused by both the sunburst fill and the legend swatch. */
const SECTOR_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

const FALLBACK_SECTOR_COLOR = '#1f77b4';

function formatVehicles(value: string | number): string {
  return Number(value).toLocaleString('en-NZ');
}

/** Tooltip shown while hovering a sunburst sector. */
function FleetTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const name = payload[0]?.name;
  const value = payload[0]?.value;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{name}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {formatVehicles(value)} vehicles
      </p>
    </div>
  );
}

/** Keeps the top N rows and groups the rest into one Other row. */
export function groupFleetRows(rows: LiveMvrFleetRow[], topN: number): FleetDatum[] {
  const top = rows.slice(0, topN).map((row) => ({ label: row.label, count: row.count }));
  const restCount = rows.slice(topN).reduce((sum, row) => sum + row.count, 0);
  if (restCount > 0) {
    top.push({ label: 'Other', count: restCount });
  }
  return top;
}

/**
 * Live NZTA Motor Vehicle Register data drawn as a sunburst of the fleet by
 * motive power or vehicle type. Toggle the view to switch between the two
 * groupings.
 */
export function VehicleFleet(): React.ReactElement {
  const [motivePowerRows, setMotivePowerRows] = useState<LiveMvrFleetRow[]>([]);
  const [vehicleTypeRows, setVehicleTypeRows] = useState<LiveMvrFleetRow[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('motivePower');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFleet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [motivePower, vehicleType] = await Promise.all([
        fetchLiveMvrFleet('MOTIVE_POWER'),
        fetchLiveMvrFleet('VEHICLE_TYPE'),
      ]);
      setMotivePowerRows(motivePower);
      setVehicleTypeRows(vehicleType);
    } catch {
      setError('NZTA did not answer. Try again in a moment.');
      setMotivePowerRows([]);
      setVehicleTypeRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFleet();
  }, [loadFleet]);

  const rows = viewMode === 'motivePower' ? motivePowerRows : vehicleTypeRows;
  const totalVehicles = useMemo(() => rows.reduce((sum, row) => sum + row.count, 0), [rows]);
  const data = useMemo(() => groupFleetRows(rows, TOP_N), [rows]);
  const coloredData = useMemo<SectorDatum[]>(
    () =>
      data.map((row, index) => ({
        ...row,
        color: SECTOR_COLORS[index % SECTOR_COLORS.length] ?? FALLBACK_SECTOR_COLOR,
      })),
    [data],
  );
  const sunburstData = useMemo<SunburstData>(
    () => ({
      name: 'New Zealand fleet',
      children: coloredData.map((row) => ({
        name: row.label,
        value: row.count,
        fill: row.color,
      })),
    }),
    [coloredData],
  );
  const chartLabel =
    viewMode === 'motivePower'
      ? `New Zealand's vehicle fleet by motive power, ${formatVehicles(totalVehicles)} vehicles`
      : `New Zealand's vehicle fleet by type, ${formatVehicles(totalVehicles)} vehicles`;

  const tableColumns: ChartDataColumn<FleetDatum>[] = [
    { key: 'label', header: viewMode === 'motivePower' ? 'Motive power' : 'Vehicle type' },
    { key: 'count', header: 'Vehicles', format: formatVehicles },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Counting the fleet...'
          : (error ??
            `${formatVehicles(totalVehicles)} vehicles, fetched live from the NZTA Motor Vehicle Register.`)}
      </p>
      {!isLoading && error === null && motivePowerRows.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {(['motivePower', 'vehicleType'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                  viewMode === mode
                    ? 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                    : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'
                }`}
              >
                {mode === 'motivePower' ? 'By fuel' : 'By vehicle type'}
              </button>
            ))}
          </div>
          <div className="h-[clamp(300px,42vh,480px)]" role="img" aria-label={chartLabel}>
            <ResponsiveContainer width="100%" height="100%">
              <SunburstChart data={sunburstData}>
                <Tooltip content={FleetTooltip} />
              </SunburstChart>
            </ResponsiveContainer>
          </div>
          <ul
            className="mt-2 mb-2 flex flex-wrap gap-x-4 gap-y-1 text-sm"
            aria-label="Sector colours legend"
          >
            {coloredData.map((row) => (
              <li key={row.label} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: row.color }}
                  aria-hidden="true"
                />
                <span className="text-[var(--color-fg)]">{row.label}</span>
              </li>
            ))}
          </ul>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Each sector is one {viewMode === 'motivePower' ? 'fuel type' : 'vehicle type'}; the
            angle shows its share of the fleet. The table below lists every sector and its count.
          </p>
          <ChartDataTable
            summary="View the vehicle fleet as a table"
            columns={tableColumns}
            rows={coloredData}
            defaultOpen
          />
        </div>
      )}
    </div>
  );
}
