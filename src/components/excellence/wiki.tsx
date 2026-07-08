import type { ReactNode } from 'react';

export function WikiEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-xs font-semibold uppercase tracking-widest text-accent mb-3">
      {children}
    </p>
  );
}

export function WikiTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-heading text-3xl font-bold text-primary mb-1">{children}</h1>
  );
}

export function WikiSubtitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-sm text-neutral-dark/60 mb-6">{children}</p>
  );
}

export function WikiLede({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-base text-neutral-dark leading-relaxed max-w-prose mb-8">
      {children}
    </p>
  );
}

export function WikiSection({
  title,
  children,
  first,
}: {
  title: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section className={first ? 'mt-8' : 'mt-10 pt-8 border-t border-neutral'}>
      <h2 className="font-heading text-xl font-semibold text-primary mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function WikiP({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-sm text-neutral-dark leading-relaxed max-w-prose mb-4">
      {children}
    </p>
  );
}

export function WikiUL({ children }: { children: ReactNode }) {
  return (
    <ul className="font-body text-sm text-neutral-dark leading-relaxed max-w-prose list-disc pl-5 space-y-1 mb-4">
      {children}
    </ul>
  );
}

interface WikiTableProps {
  headers: string[];
  widths?: string[];
  rows: ReactNode[][];
}

export function WikiTable({ headers, widths, rows }: WikiTableProps) {
  return (
    <div className="overflow-x-auto border border-neutral rounded-lg my-4">
      <table className="w-full border-collapse text-sm min-w-[600px]">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="font-body text-xs font-medium tracking-wider uppercase text-on-primary bg-primary px-4 py-3 text-left"
                style={widths?.[i] ? { width: widths[i] } : undefined}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 1 ? 'bg-accent-light/10' : ''}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-4 border-t border-neutral align-top leading-relaxed font-body text-sm text-neutral-dark${
                    ci === 0 ? ' font-semibold text-primary' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WikiVariant({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="block mt-2 pl-3 border-l-2 border-accent-light text-sm text-neutral-dark/70">
      <strong className="text-neutral-dark font-semibold">{label}:</strong>{' '}
      {children}
    </span>
  );
}

export function WikiCallout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-accent-light/10 border border-accent-light/50 rounded-lg p-5 my-6 max-w-prose">
      <p className="font-body text-xs font-semibold tracking-wider uppercase text-accent mb-2">
        {label}
      </p>
      <div className="font-body text-sm text-neutral-dark space-y-2">{children}</div>
    </div>
  );
}

export function WikiSources({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 pt-4 border-t border-neutral">
      <p className="font-body text-xs font-semibold tracking-wider uppercase text-neutral-dark/50 mb-2">
        Fuentes consultadas
      </p>
      <p className="font-body text-xs text-neutral-dark/60 leading-relaxed">{children}</p>
    </div>
  );
}
