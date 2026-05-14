'use client';

import { ReactNode } from 'react';

interface CollapsibleSectionProps {
  id?: string;
  title: ReactNode;
  summaryRight?: ReactNode;
  defaultOpen?: boolean;
  level?: 'h2' | 'h3';
  children: ReactNode;
}

export function CollapsibleSection({
  id,
  title,
  summaryRight,
  defaultOpen = true,
  level = 'h2',
  children,
}: CollapsibleSectionProps) {
  const headingClass =
    level === 'h2'
      ? 'font-heading text-xl font-semibold text-primary'
      : 'font-heading text-lg font-semibold text-primary';

  return (
    <details
      id={id}
      open={defaultOpen}
      className="group border-t border-neutral/30 pt-6 [&:not([open])>summary>.indicator]:-rotate-90"
    >
      <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
        <span className="flex items-baseline gap-3">
          <span className={headingClass}>{title}</span>
        </span>
        <span className="flex items-center gap-3 shrink-0">
          {summaryRight}
          <span
            aria-hidden="true"
            className="indicator text-primary text-xs select-none"
          >
            v
          </span>
        </span>
      </summary>
      <div className="pt-4 font-body text-sm text-neutral-dark">{children}</div>
    </details>
  );
}
