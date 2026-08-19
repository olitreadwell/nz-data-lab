import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { LiveNzSchool } from '@/lib/live-sources';

import {
  buildSchoolTypeData,
  classifySchoolAuthority,
  classifySchoolYears,
  SchoolRoll,
} from './SchoolRoll';

expect.extend(toHaveNoViolations);

const SCHOOLS: LiveNzSchool[] = [
  { name: 'Burnside High School', years: '9-13', authority: 'state' },
  { name: 'Riverhead Montessori School', years: '1-6', authority: 'private' },
  { name: 'Te Kura o Te Rau Aroha', years: '1-8', authority: 'state' },
  { name: 'St Marys College', years: '7-13', authority: 'integrated' },
  { name: 'Aoraki Polytechnic', years: undefined, authority: undefined },
];

describe('classifySchoolYears', () => {
  it('classifies year ranges into school types', () => {
    expect(classifySchoolYears('1-6')).toBe('primary');
    expect(classifySchoolYears('1-8')).toBe('primary');
    expect(classifySchoolYears('7-8')).toBe('intermediate');
    expect(classifySchoolYears('9-13')).toBe('secondary');
    expect(classifySchoolYears('7-13')).toBe('secondary');
    expect(classifySchoolYears('1-13')).toBe('composite');
    expect(classifySchoolYears('special')).toBe('special');
    expect(classifySchoolYears(undefined)).toBe('other');
    expect(classifySchoolYears('1-6\\8')).toBe('other');
  });
});

describe('classifySchoolAuthority', () => {
  it('classifies authority tags into buckets', () => {
    expect(classifySchoolAuthority('state')).toBe('state');
    expect(classifySchoolAuthority('integrated')).toBe('integrated');
    expect(classifySchoolAuthority('private')).toBe('private');
    expect(classifySchoolAuthority(undefined)).toBe('other');
    expect(classifySchoolAuthority('charter')).toBe('other');
  });
});

describe('buildSchoolTypeData', () => {
  it('counts schools by type and authority', () => {
    const data = buildSchoolTypeData(SCHOOLS);
    const primary = data.find((row) => row.type === 'primary');
    expect(primary).toEqual({
      type: 'primary',
      label: 'Primary',
      state: 1,
      integrated: 0,
      private: 1,
      other: 0,
      total: 2,
    });
    const secondary = data.find((row) => row.type === 'secondary');
    expect(secondary?.total).toBe(2);
    const other = data.find((row) => row.type === 'other');
    expect(other?.total).toBe(1);
  });
});

describe('SchoolRoll', () => {
  it('shows the stacked school bar', async () => {
    render(<SchoolRoll schools={SCHOOLS} />);
    expect(
      await screen.findByText(/5 schools, fetched from OpenStreetMap at build time/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /5 schools by type and authority/ }),
    ).toBeInTheDocument();
  });

  it('filters schools by name', async () => {
    render(<SchoolRoll schools={SCHOOLS} />);
    await screen.findByText(/5 schools, fetched from OpenStreetMap at build time/);
    const search = screen.getByLabelText('Filter by name');
    fireEvent.change(search, { target: { value: 'burnside' } });
    expect(screen.getByRole('img', { name: /1 school by type and authority/ })).toBeInTheDocument();
  });

  it('toggles an authority off and on', async () => {
    render(<SchoolRoll schools={SCHOOLS} />);
    await screen.findByText(/5 schools, fetched from OpenStreetMap at build time/);
    const privateButton = screen.getByRole('button', { name: 'Private' });
    fireEvent.click(privateButton);
    expect(privateButton).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('img', { name: /4 schools by type and authority/ }),
    ).toBeInTheDocument();
    fireEvent.click(privateButton);
    expect(privateButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SchoolRoll schools={SCHOOLS} />);
    await screen.findByText(/5 schools, fetched from OpenStreetMap at build time/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
