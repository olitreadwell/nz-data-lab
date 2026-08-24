import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MicrositeReferences } from './MicrositeReferences';

describe('MicrositeReferences', () => {
  it('renders the sources heading as an h2 so heading levels do not skip', () => {
    render(
      <MicrositeReferences
        references={[{ label: 'Stats NZ', url: 'https://example.com', kind: 'data' }]}
      />,
    );
    const heading = screen.getByRole('heading', { name: 'Sources and further reading' });
    expect(heading.tagName).toBe('H2');
  });
});
