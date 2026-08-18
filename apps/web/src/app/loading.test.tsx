import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Loading from './loading';

describe('Loading', () => {
  it('guards the skeleton pulse animation behind motion-safe', async () => {
    const stream = await renderToReadableStream(<Loading />);
    const html = await new Response(stream).text();

    const pulseCount = (html.match(/animate-pulse/g) ?? []).length;
    const guardedCount = (html.match(/motion-safe:animate-pulse/g) ?? []).length;

    expect(pulseCount).toBe(3);
    expect(guardedCount).toBe(3);
    expect(html).toContain('role="status"');
  });
});
