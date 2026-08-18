import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import ExperimentError from './error';

describe('ExperimentError', () => {
  it('renders a generic message and never leaks the raw error message', async () => {
    const error = new Error('Stats NZ request to https://api.example/stats failed: 401');
    const stream = await renderToReadableStream(
      <ExperimentError error={error} reset={vi.fn()} />,
    );
    const html = await new Response(stream).text();

    expect(html).toContain('This experiment hit an error. The rest of the site is unaffected.');
    expect(html).not.toContain(error.message);
  });

  it('logs the real error for debugging', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('internal detail');
    const stream = await renderToReadableStream(
      <ExperimentError error={error} reset={vi.fn()} />,
    );
    await new Response(stream).text();

    expect(consoleError).toHaveBeenCalledWith(error);
    consoleError.mockRestore();
  });
});
