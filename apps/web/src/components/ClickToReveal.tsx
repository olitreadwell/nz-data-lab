'use client';

import { Button } from '@nzlab/ui';
import { useId, useState } from 'react';

interface ClickToRevealProps {
  buttonLabel: string;
  hideLabel: string;
  children: React.ReactNode;
}

/** Collapsible microsite content: a button that reveals (or hides) its children. */
export function ClickToReveal({
  buttonLabel,
  hideLabel,
  children,
}: ClickToRevealProps): React.ReactElement {
  const [revealed, setRevealed] = useState(false);
  const contentId = useId();

  return (
    <div>
      <Button
        tone="secondary"
        size="lg"
        aria-expanded={revealed}
        aria-controls={contentId}
        onClick={() => setRevealed((current) => !current)}
      >
        {revealed ? hideLabel : buttonLabel}
      </Button>
      {revealed && (
        <div id={contentId} className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
}
