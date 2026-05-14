'use client';

import { useCallback } from 'react';
import { Button } from './Button';

interface ExpandCollapseAllProps {
  targetSelector: string;
}

export function ExpandCollapseAll({ targetSelector }: ExpandCollapseAllProps) {
  const setOpen = useCallback(
    (open: boolean) => {
      const root = document.querySelector(targetSelector);
      if (!root) return;
      root.querySelectorAll('details').forEach((d) => {
        if (open) d.setAttribute('open', '');
        else d.removeAttribute('open');
      });
    },
    [targetSelector],
  );

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Expandir todo
      </Button>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Colapsar todo
      </Button>
    </div>
  );
}
