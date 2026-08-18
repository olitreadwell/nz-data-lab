import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { SlopeChart } from './SlopeChart';
import type { SlopeChartRow } from './SlopeChart';

expect.extend(toHaveNoViolations);

const ROWS: SlopeChartRow[] = [
  { name: 'Alpha', values: [10, 12, 5] },
  { name: 'Beta', values: [8, 8, 8] },
  { name: 'Gamma', values: [5, 6, 7] },
];

describe('SlopeChart', () => {
  it('renders the slope chart with the movers mode on by default', () => {
    render(
      <SlopeChart
        rows={ROWS}
        timePoints={['2013', '2018', '2023']}
        chartLabel="Test ranks across three censuses"
        moverSummary={(count) => `${count} series moved rank`}
        rowSummary={(row, ranks) =>
          `${row.name} rank ${ranks[0] ?? 0} to ${ranks[ranks.length - 1] ?? 0}`
        }
      />,
    );
    expect(
      screen.getByRole('img', { name: /Test ranks across three censuses/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/1 series moved rank/)).toBeInTheDocument();
  });

  it('switches to showing every series', () => {
    render(
      <SlopeChart
        rows={ROWS}
        timePoints={['2013', '2018', '2023']}
        chartLabel="Test ranks across three censuses"
        moverSummary={(count) => `${count} series moved rank`}
        rowSummary={(row, ranks) =>
          `${row.name} rank ${ranks[0] ?? 0} to ${ranks[ranks.length - 1] ?? 0}`
        }
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'All 3' }));
    expect(screen.getByRole('button', { name: 'All 3' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('summarises the hovered line', () => {
    const { container } = render(
      <SlopeChart
        rows={ROWS}
        timePoints={['2013', '2018', '2023']}
        chartLabel="Test ranks across three censuses"
        moverSummary={(count) => `${count} series moved rank`}
        rowSummary={(row, ranks) =>
          `${row.name} rank ${ranks[0] ?? 0} to ${ranks[ranks.length - 1] ?? 0}`
        }
      />,
    );
    fireEvent.mouseEnter(container.querySelectorAll('polyline')[0] ?? document.body);
    expect(screen.getByText(/Alpha rank 1 to 3/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SlopeChart
        rows={ROWS}
        timePoints={['2013', '2018', '2023']}
        chartLabel="Test ranks across three censuses"
        moverSummary={(count) => `${count} series moved rank`}
        rowSummary={(row, ranks) =>
          `${row.name} rank ${ranks[0] ?? 0} to ${ranks[ranks.length - 1] ?? 0}`
        }
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
