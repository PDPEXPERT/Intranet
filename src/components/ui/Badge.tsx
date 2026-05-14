import { ReactNode } from 'react';

type Tone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'pending'
  | 'muted';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-neutral/30 text-neutral-dark',
  accent: 'bg-accent-light/20 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  pending: 'bg-pending/15 text-pending',
  muted: 'bg-muted/15 text-neutral-dark/50',
};

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
