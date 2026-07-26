'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type {
  Capability,
  CapabilityMapData,
  CapabilityTier,
  TierKey,
} from '@/lib/capabilityMap';

interface CapabilityMapProps {
  data: CapabilityMapData;
}

interface TierStyle {
  head: string;
  border: string;
  chip: string;
}

const TIER_STYLE: Record<TierKey, TierStyle> = {
  strat: {
    head: 'bg-primary text-on-primary',
    border: 'border-l-primary',
    chip: 'bg-primary text-on-primary',
  },
  core: {
    head: 'bg-accent text-on-primary',
    border: 'border-l-accent',
    chip: 'bg-accent text-on-primary',
  },
  supp: {
    head: 'bg-accent-light text-primary',
    border: 'border-l-accent-light',
    chip: 'bg-accent-light text-primary',
  },
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`w-3 h-3 text-accent shrink-0 mt-0.5 transition-transform ${open ? 'rotate-90' : ''}`}
    >
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CapabilityMap({ data }: CapabilityMapProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const allWithSub = data.tiers
    .flatMap((t) => t.capabilities)
    .filter((c) => c.subcapabilities.length > 0)
    .map((c) => c.code);

  function toggle(code: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function expandAll() {
    setOpen(new Set(allWithSub));
  }

  function collapseAll() {
    setOpen(new Set());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <Button variant="ghost" onClick={expandAll}>
          Expandir todo
        </Button>
        <Button variant="ghost" onClick={collapseAll}>
          Colapsar todo
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-neutral-dark/70">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary" /> Estratégico
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-accent" /> Núcleo (Core)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-accent-light" /> Soporte
        </span>
      </div>

      <div className="space-y-4">
        {data.tiers.map((tier) => (
          <TierBlock key={tier.key} tier={tier} open={open} onToggle={toggle} />
        ))}
      </div>

      <div className="border border-neutral rounded-md px-4 py-3">
        <h3 className="font-heading text-sm font-semibold text-primary mb-2">
          Cobertura de las líneas de negocio
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.businessLines.map((line) => (
            <span
              key={line.name}
              className="font-body text-xs text-neutral-dark/80 bg-accent-light/15 border border-neutral rounded-full px-3 py-1"
            >
              <b className="text-primary font-semibold">{line.name}</b>
              {line.codes ? `: ${line.codes.join(', ')}` : ''}
              {line.note ? `: ${line.note}` : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TierBlock({
  tier,
  open,
  onToggle,
}: {
  tier: CapabilityTier;
  open: Set<string>;
  onToggle: (code: string) => void;
}) {
  const style = TIER_STYLE[tier.key];
  return (
    <section className="border border-neutral rounded-lg overflow-hidden bg-surface">
      <div className={`px-4 py-3 ${style.head}`}>
        <h2 className="font-heading text-sm font-semibold">{tier.name}</h2>
        <p className="font-body text-xs opacity-90 mt-0.5">{tier.tag}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 items-start">
        {tier.capabilities.map((cap) => (
          <CapabilityCard
            key={cap.code}
            cap={cap}
            style={style}
            open={open.has(cap.code)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}

function CapabilityCard({
  cap,
  style,
  open,
  onToggle,
}: {
  cap: Capability;
  style: TierStyle;
  open: boolean;
  onToggle: (code: string) => void;
}) {
  const hasSub = cap.subcapabilities.length > 0;
  return (
    <div
      className={`border border-neutral rounded-md border-l-4 ${style.border} bg-surface p-3 ${
        hasSub ? 'cursor-pointer hover:shadow-sm transition-shadow' : ''
      }`}
      onClick={hasSub ? () => onToggle(cap.code) : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-body text-[10px] font-semibold tracking-wide text-neutral-dark/40">
          {cap.code}
        </span>
        {hasSub && <Chevron open={open} />}
      </div>
      <h3 className="font-heading font-semibold text-[13px] text-primary mt-1 leading-tight">
        {cap.name}
      </h3>
      <p className="font-body text-[11px] text-neutral-dark/70 mt-1 leading-snug">
        {cap.description}
      </p>
      <div className="font-body text-[10px] text-neutral-dark/40 mt-1.5">
        Objeto: <span className="text-accent font-medium">{cap.objeto}</span>
        {hasSub && (
          <span className="ml-1.5 border border-neutral rounded-full px-1.5 py-px text-neutral-dark/40">
            L2
          </span>
        )}
      </div>
      {hasSub && open && (
        <ul className="mt-2.5 pt-2.5 border-t border-dashed border-neutral space-y-1.5">
          {cap.subcapabilities.map((sub) => (
            <li key={sub.code} className="flex gap-2">
              <span
                className={`font-body text-[9px] font-semibold rounded px-1.5 py-px h-fit shrink-0 mt-0.5 ${style.chip}`}
              >
                {sub.code}
              </span>
              <span className="font-body text-[11px] leading-snug">
                <b className="text-primary font-semibold">{sub.name}.</b>{' '}
                <span className="text-neutral-dark/70">{sub.description}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
