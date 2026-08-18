import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { AgeBulgeRidgeline } from './AgeBulgeRidgeline';

expect.extend(toHaveNoViolations);

describe('AgeBulgeRidgeline', () => {
  it('renders all three census ridges by default', () => {
    render(<AgeBulgeRidgeline />);
    expect(screen.getByRole('img', { name: /2013, 2018, and 2023 censuses/i })).toBeInTheDocument();
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('2013');
    expect(legend).toHaveTextContent('2018');
    expect(legend).toHaveTextContent('2023');
  });

  it('shows a single census when asked', () => {
    render(<AgeBulgeRidgeline />);
    fireEvent.click(screen.getByRole('radio', { name: '2018 only' }));
    expect(screen.getByRole('img', { name: /2018 census/i })).toBeInTheDocument();
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('2018');
    expect(legend).not.toHaveTextContent('2013');
    expect(legend).not.toHaveTextContent('2023');
  });

  it('exposes the year selector as a radio group with one checked option', () => {
    render(<AgeBulgeRidgeline />);
    const group = screen.getByRole('radiogroup', { name: 'Which census years to show' });
    expect(group).toBeInTheDocument();
    const checked = within(group)
      .getAllByRole('radio')
      .filter((radio) => radio.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent('All three censuses');
  });

  it('reads the count for a hovered age band', () => {
    render(<AgeBulgeRidgeline />);
    const overlay = document.querySelector('svg rect');
    if (overlay === null) {
      throw new Error('expected the hover overlay rect to render');
    }
    fireEvent.mouseMove(overlay, { clientX: 126 });
    expect(screen.getByTestId('age-bulge-readout')).toHaveTextContent('10-14');
    expect(screen.getByTestId('age-bulge-readout')).toHaveTextContent('286,830');
  });

  it('lists the verified age band figures in the data table', () => {
    const { container } = render(<AgeBulgeRidgeline />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('30-34')).toBeInTheDocument();
    expect(within(table).getByText('374,079')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AgeBulgeRidgeline />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
