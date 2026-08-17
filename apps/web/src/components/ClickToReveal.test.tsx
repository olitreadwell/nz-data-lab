import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ClickToReveal } from './ClickToReveal';

describe('ClickToReveal', () => {
  it('reveals its children when the button is clicked', () => {
    render(
      <ClickToReveal buttonLabel="Reveal the sheep index" hideLabel="Hide the sheep index">
        <p>hidden content</p>
      </ClickToReveal>,
    );
    expect(screen.queryByText('hidden content')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal the sheep index' }));
    expect(screen.getByText('hidden content')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Hide the sheep index' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('hides its children again when clicked a second time', () => {
    render(
      <ClickToReveal buttonLabel="Reveal" hideLabel="Hide">
        <p>hidden content</p>
      </ClickToReveal>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(screen.queryByText('hidden content')).toBeNull();
  });
});
