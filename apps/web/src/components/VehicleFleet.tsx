'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SunburstChart, Tooltip } from 'recharts';
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
  const sunburstData = useMemo<SunburstData>(
    () => ({
      name: 'New Zealand fleet',
      children: data.map((row) => ({ name: row.label, value: row.count })),
    }),
    [data],
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
          <div className="h-[420px]" role="img" aria-label={chartLabel}>
            <SunburstChart data={sunburstData} width={720} height={420}>
              <Tooltip content={FleetTooltip} />
            </SunburstChart>
          </div>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Each sector is one {viewMode === 'motivePower' ? 'fuel type' : 'vehicle type'}; the
            angle shows its share of the fleet. Hover a sector to read the count.
          </p>
          <ChartDataTable
            summary="View the vehicle fleet as a table"
            columns={tableColumns}
            rows={data}
          />
        </div>
      )}
    </div>
  );
}
