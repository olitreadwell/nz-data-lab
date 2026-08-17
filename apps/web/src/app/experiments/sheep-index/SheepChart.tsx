import type { SheepSeriesPoint } from './sheep-data';

interface SheepChartProps {
  points: SheepSeriesPoint[];
}

const VIEWBOX_WIDTH = 720;
const VIEWBOX_HEIGHT = 240;
const PADDING_LEFT = 48;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;

export function SheepChart({ points }: SheepChartProps): React.ReactElement {
  const sheepValues = points.map((point) => point.sheep);
  const minSheep = Math.min(...sheepValues);
  const maxSheep = Math.max(...sheepValues);
  const span = maxSheep - minSheep || 1;
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const chartWidth = VIEWBOX_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartHeight = VIEWBOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const xFor = (index: number): number =>
    PADDING_LEFT + (points.length === 1 ? 0 : (index / (points.length - 1)) * chartWidth);
  const yFor = (sheep: number): number => PADDING_TOP + ((maxSheep - sheep) / span) * chartHeight;

  const linePoints = points
    .map((point, index) => `${xFor(index).toFixed(1)},${yFor(point.sheep).toFixed(1)}`)
    .join(' ');

  const label =
    points.length === 0
      ? 'Sheep numbers over time'
      : `Sheep numbers, ${firstYear ?? ''} to ${lastYear ?? ''}: peaked at ${Math.round(maxSheep).toLocaleString()} and fell to ${Math.round(minSheep).toLocaleString()}`;

  if (points.length === 0) {
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="h-auto w-full"
      >
        <title>{label}</title>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className="h-auto w-full"
    >
      <title>{label}</title>
      <line
        x1={PADDING_LEFT}
        y1={PADDING_TOP}
        x2={PADDING_LEFT}
        y2={VIEWBOX_HEIGHT - PADDING_BOTTOM}
        stroke="var(--color-border)"
        strokeWidth="1"
      />
      <line
        x1={PADDING_LEFT}
        y1={VIEWBOX_HEIGHT - PADDING_BOTTOM}
        x2={VIEWBOX_WIDTH - PADDING_RIGHT}
        y2={VIEWBOX_HEIGHT - PADDING_BOTTOM}
        stroke="var(--color-border)"
        strokeWidth="1"
      />
      <text
        x={PADDING_LEFT - 8}
        y={yFor(maxSheep) + 4}
        textAnchor="end"
        className="fill-[var(--color-muted)] text-[11px]"
      >
        {Math.round(maxSheep / 1000000)}m
      </text>
      <text
        x={PADDING_LEFT - 8}
        y={yFor(minSheep) + 4}
        textAnchor="end"
        className="fill-[var(--color-muted)] text-[11px]"
      >
        {Math.round(minSheep / 1000000)}m
      </text>
      <text
        x={PADDING_LEFT}
        y={VIEWBOX_HEIGHT - 8}
        className="fill-[var(--color-muted)] text-[11px]"
      >
        {firstYear ?? ''}
      </text>
      <text
        x={VIEWBOX_WIDTH - PADDING_RIGHT}
        y={VIEWBOX_HEIGHT - 8}
        textAnchor="end"
        className="fill-[var(--color-muted)] text-[11px]"
      >
        {lastYear ?? ''}
      </text>
      <polyline
        points={linePoints}
        fill="none"
        stroke="var(--color-fg)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
