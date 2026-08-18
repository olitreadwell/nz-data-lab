import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import RootLayout from './layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-sans' }),
}));

describe('RootLayout', () => {
  it('renders the html element with lang="en-NZ"', async () => {
    const stream = await renderToReadableStream(
      <RootLayout>
        <p>content</p>
      </RootLayout>,
    );
    const html = await new Response(stream).text();

    expect(html).toContain('<html lang="en-NZ"');
  });
});
