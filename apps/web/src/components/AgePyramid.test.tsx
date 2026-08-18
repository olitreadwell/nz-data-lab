import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { AgePyramid } from './AgePyramid';

expect.extend(toHaveNoViolations);

describe('AgePyramid', () => {
  it('renders the pyramid with both sexes by default', () => {
    render(<AgePyramid />);
    expect(screen.getByRole('img', { name: /by sex and 5-year age group/i })).toBeInTheDocument();
    expect(screen.getAllByText('30-34').length).toBeGreaterThan(0);
    expect(screen.getAllByText('90+').length).toBeGreaterThan(0);
  });

  it('shows a legend identifying both sexes by default', () => {
    render(<AgePyramid />);
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('Male');
    expect(legend).toHaveTextContent('Female');
  });

  it('keeps the legend correct in single-sex views', () => {
    render(<AgePyramid />);
    fireEvent.click(screen.getByRole('radio', { name: 'Male only' }));
    const maleLegend = screen.getByRole('list', { name: 'Chart legend' });
    expect(maleLegend).toHaveTextContent('Male');
    expect(maleLegend).not.toHaveTextContent('Female');

    fireEvent.click(screen.getByRole('radio', { name: 'Female only' }));
    const femaleLegend = screen.getByRole('list', { name: 'Chart legend' });
    expect(femaleLegend).toHaveTextContent('Female');
    expect(femaleLegend).not.toHaveTextContent('Male');
  });

  it('switches to a single sex view', () => {
    render(<AgePyramid />);
    fireEvent.click(screen.getByRole('radio', { name: 'Male only' }));
    expect(
      screen.getByRole('img', { name: /New Zealand male population by 5-year age group/i }),
    ).toBeInTheDocument();
  });

  it('exposes the sex selector as a radio group with one checked option', () => {
    render(<AgePyramid />);
    const group = screen.getByRole('radiogroup', { name: 'Sex to display' });
    expect(group).toBeInTheDocument();
    const checked = screen
      .getAllByRole('radio')
      .filter((radio) => radio.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent('Male and female');
  });

  it('moves focus to the newly selected radio on arrow keys and keeps only the checked radio in the tab order', () => {
    render(<AgePyramid />);
    const both = screen.getByRole('radio', { name: 'Male and female' });
    const male = screen.getByRole('radio', { name: 'Male only' });
    const female = screen.getByRole('radio', { name: 'Female only' });
    expect(both).toHaveAttribute('tabindex', '0');
    expect(male).toHaveAttribute('tabindex', '-1');
    expect(female).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(both, { key: 'ArrowDown' });
    expect(male).toHaveFocus();
    expect(male).toHaveAttribute('aria-checked', 'true');
    expect(male).toHaveAttribute('tabindex', '0');
    expect(both).toHaveAttribute('tabindex', '-1');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AgePyramid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
