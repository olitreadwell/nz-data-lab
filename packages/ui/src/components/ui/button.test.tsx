import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './button';

describe('ui Button primitive', () => {
  it('renders a button with variant and size classes', () => {
    render(
      <Button variant="outline" size="sm">
        Action
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Action' });
    expect(btn.className).toContain('border-border');
    expect(btn.className).toContain('h-7');
  });

  it('forwards className', () => {
    render(<Button className="custom-cls">Action</Button>);
    expect(screen.getByRole('button', { name: 'Action' }).className).toContain('custom-cls');
  });
});
