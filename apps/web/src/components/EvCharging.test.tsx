import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveEvChargingCurrentType, LiveEvChargingOperator } from '@/lib/live-sources';

import { EvCharging } from './EvCharging';

expect.extend(toHaveNoViolations);

const { FETCH_OPERATORS_MOCK, FETCH_CURRENT_TYPES_MOCK } = vi.hoisted(() => ({
  FETCH_OPERATORS_MOCK: vi.fn(),
  FETCH_CURRENT_TYPES_MOCK: vi.fn(),
}));

const OPERATORS: LiveEvChargingOperator[] = [
  { operator: 'ChargeNet NZ', count: 307 },
  { operator: 'MERIDIAN ENERGY LIMITED', count: 104 },
  { operator: 'Z Energy', count: 63 },
  { operator: 'JOLT', count: 47 },
  { operator: 'BP', count: 42 },
];

const CURRENT_TYPES: LiveEvChargingCurrentType[] = [
  { currentType: 'DC', count: 566 },
  { currentType: 'AC', count: 44 },
  { currentType: 'Mixed', count: 29 },
];

FETCH_OPERATORS_MOCK.mockResolvedValue(OPERATORS);
FETCH_CURRENT_TYPES_MOCK.mockResolvedValue(CURRENT_TYPES);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveEvChargingOperators: FETCH_OPERATORS_MOCK,
  fetchLiveEvChargingCurrentTypes: FETCH_CURRENT_TYPES_MOCK,
}));

describe('EvCharging', () => {
  it('shows the operator lollipop', async () => {
    render(<EvCharging />);
    expect(await screen.findByText(/563 stations, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Operators of New Zealand's 563 public EV charging/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('ChargeNet NZ').length).toBeGreaterThan(0);
  });

  it('toggles to the current-type view', async () => {
    render(<EvCharging />);
    await screen.findByText(/563 stations, fetched live/);
    fireEvent.click(screen.getByRole('button', { name: 'By current type' }));
    expect(
      screen.getByRole('img', { name: /Current types of New Zealand's 563 public EV charging/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('DC').length).toBeGreaterThan(0);
  });

  it('filters operators by name', async () => {
    render(<EvCharging />);
    await screen.findByText(/563 stations, fetched live/);
    const search = screen.getByRole('searchbox', { name: /Filter/ });
    fireEvent.change(search, { target: { value: 'jolt' } });
    expect(screen.getAllByText('JOLT').length).toBeGreaterThan(0);
    expect(screen.queryByText('ChargeNet NZ')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EvCharging />);
    await screen.findByText(/563 stations, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
