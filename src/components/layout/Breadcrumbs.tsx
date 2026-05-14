'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Crumb {
  href: string | null;
  label: string;
}

function buildCrumbs(pathname: string): Crumb[] {
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '' || clean === '/') return [{ href: null, label: 'Inicio' }];

  const segments = clean.split('/').filter(Boolean);
  const crumbs: Crumb[] = [];
  let acc = '';

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    acc += `/${seg}`;
    const isLast = i === segments.length - 1;
    crumbs.push({
      href: isLast ? null : `${acc}/`,
      label: labelFor(segments, i),
    });
  }
  return crumbs;
}

function labelFor(segments: string[], idx: number): string {
  const seg = segments[idx];
  if (seg === 'procesos') return 'Procedimientos';
  if (seg === 'pgf') return 'PGF';
  if (seg === 'biblioteca') return 'Biblioteca';
  if (seg.startsWith('PRC-')) return seg;
  return seg;
}

export function Breadcrumbs() {
  const pathname = usePathname() ?? '/';
  const crumbs = buildCrumbs(pathname);

  return (
    <nav className="font-body text-xs text-neutral-dark/60">
      {crumbs.map((c, i) => (
        <span key={`${c.label}-${i}`}>
          {i > 0 && <span className="mx-2">/</span>}
          {c.href ? (
            <Link href={c.href} className="hover:text-primary">
              {c.label}
            </Link>
          ) : (
            <span className="text-neutral-dark">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
