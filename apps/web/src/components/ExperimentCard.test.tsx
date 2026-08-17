import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { Experiment } from '@/lib/experiments';

import { ExperimentCard } from './ExperimentCard';

expect.extend(toHaveNoViolations);

const experiment: Experiment = {
  slug: 'test-experiment',
  title: 'A test experiment',
  pitch: 'Testing the card renders correctly.',
  dataSource: 'Stats NZ',
  status: 'alive',
};

describe('ExperimentCard', () => {
  it('links to the experiment slug and shows its status/source/pitch', () => {
    render(<ExperimentCard experiment={experiment} />);
    expect(screen.getByRole('link', { name: /a test experiment/i })).toHaveAttribute(
      'href',
      '/experiments/test-experiment',
    );
    expect(screen.getByText(/alive/i)).toBeInTheDocument();
    expect(screen.getByText(/stats nz/i)).toBeInTheDocument();
    expect(screen.getByText(experiment.pitch)).toBeInTheDocument();
  });

  it('shows dead status for dead experiments', () => {
    render(<ExperimentCard experiment={{ ...experiment, status: 'dead' }} />);
    expect(screen.getByText(/dead/i)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ExperimentCard experiment={experiment} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
