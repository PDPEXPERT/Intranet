'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { listProcedures } from '@/lib/procedures';
import type { ProcedureSummary } from '@/lib/types';
import { TOPICS } from '@/content/excellence/registry';

interface NavItem {
  href: string;
  label: string;
}

const TOP_NAV: NavItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/procesos', label: 'Procedimientos' },
  { href: '/pgf', label: 'PGF' },
  { href: '/organigrama', label: 'Organigrama' },
  { href: '/biblioteca', label: 'Biblioteca' },
  { href: '/excellence', label: 'Excellence Wiki' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname() ?? '/';
  const [email, setEmail] = useState<string>('');
  const [procedures, setProcedures] = useState<ProcedureSummary[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? '');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user.email ?? '');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const inProcesos = pathname.startsWith('/procesos');
  const inExcellence = pathname.startsWith('/excellence');

  useEffect(() => {
    if (!inProcesos) return;
    if (procedures.length > 0) return;
    listProcedures()
      .then(setProcedures)
      .catch(() => setProcedures([]));
  }, [inProcesos, procedures.length]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-primary text-on-primary flex flex-col">
      <div className="p-6 border-b border-on-primary/10">
        <div className="font-heading font-bold text-lg leading-tight">
          PDP Expert
        </div>
        <div className="font-body text-xs text-on-primary/70">Intranet</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {TOP_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const showSub =
            (item.href === '/procesos' && inProcesos) ||
            (item.href === '/excellence' && inExcellence);
          return (
            <div key={item.href}>
              <Link
                href={`${item.href}/`}
                className={
                  active
                    ? 'block px-3 py-2 rounded-md font-body text-sm font-medium bg-accent text-on-primary'
                    : 'block px-3 py-2 rounded-md font-body text-sm font-medium text-on-primary/70 hover:bg-accent hover:text-on-primary'
                }
              >
                {item.label}
              </Link>
              {showSub && item.href === '/procesos' && procedures.length > 0 && (
                <div className="mt-1 mb-2 space-y-0.5">
                  {procedures.map((p) => {
                    const subActive = pathname.includes(`/procesos/${p.code}`);
                    return (
                      <Link
                        key={p.code}
                        href={`/procesos/${p.code}/`}
                        className={
                          subActive
                            ? 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary border-l-2 border-accent'
                            : 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary/60 hover:text-on-primary'
                        }
                      >
                        <span className="font-medium">{p.code}</span>
                        <span className="block text-on-primary/50 truncate">
                          {p.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {showSub && item.href === '/excellence' && (
                <div className="mt-1 mb-2 space-y-0.5">
                  {TOPICS.map((t) => {
                    const subActive = pathname.includes(`/excellence/${t.slug}`);
                    return (
                      <Link
                        key={t.slug}
                        href={`/excellence/${t.slug}/`}
                        className={
                          subActive
                            ? 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary border-l-2 border-accent'
                            : 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary/60 hover:text-on-primary'
                        }
                      >
                        <span className="block text-on-primary/50 truncate">{t.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-on-primary/10 space-y-2">
        <div className="font-body text-xs text-on-primary/70 truncate">
          {email}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left font-body text-xs text-on-primary/70 hover:text-on-primary"
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
