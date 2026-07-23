'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { listProcedures } from '@/lib/procedures';
import type { ProcedureSummary } from '@/lib/types';
import { TOPICS } from '@/content/excellence/registry';
import { useSidebar } from './SidebarContext';

interface NavItem {
  href: string;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconProcedures({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10h6M9 14h6M9 18h4" strokeLinecap="round" />
    </svg>
  );
}

function IconOrgChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <rect x="3" y="17" width="6" height="4" rx="1" />
      <rect x="15" y="17" width="6" height="4" rx="1" />
      <path d="M12 7v5M12 12H6v5M12 12h6v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWiki({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 5a2 2 0 0 1 2-2h11v17H6a2 2 0 0 0-2 2V5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8h6M8 12h6" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOP_NAV: NavItem[] = [
  { href: '/', label: 'Inicio', icon: IconHome },
  { href: '/procesos', label: 'Procedimientos', icon: IconProcedures },
  { href: '/organigrama', label: 'Organigrama', icon: IconOrgChart },
  { href: '/excellence', label: 'Excellence Wiki', icon: IconWiki },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname() ?? '/';
  const { collapsed, toggle } = useSidebar();
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
    <aside
      className={`fixed top-0 left-0 h-screen bg-primary text-on-primary flex flex-col transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-on-primary/10">
        {!collapsed && (
          <div>
            <div className="font-heading font-bold text-lg leading-tight">PDP Expert</div>
            <div className="font-body text-xs text-on-primary/70">Intranet</div>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          className="p-1.5 rounded-md text-on-primary/70 hover:bg-accent hover:text-on-primary shrink-0"
        >
          <IconChevron className={`w-4 h-4 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {TOP_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const showSub =
            !collapsed &&
            ((item.href === '/procesos' && inProcesos) ||
              (item.href === '/excellence' && inExcellence));
          const Icon = item.icon;
          return (
            <div key={item.href}>
              <Link
                href={`${item.href}/`}
                title={collapsed ? item.label : undefined}
                className={
                  active
                    ? `flex items-center gap-3 rounded-md font-body text-sm font-medium bg-accent text-on-primary ${collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'}`
                    : `flex items-center gap-3 rounded-md font-body text-sm font-medium text-on-primary/70 hover:bg-accent hover:text-on-primary ${collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'}`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
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
        {!collapsed && (
          <div className="font-body text-xs text-on-primary/70 truncate">{email}</div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Cerrar sesion' : undefined}
          className={`flex items-center gap-2 font-body text-xs text-on-primary/70 hover:text-on-primary ${
            collapsed ? 'justify-center w-full' : 'w-full text-left'
          }`}
        >
          <IconLogout className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Cerrar sesion</span>}
        </button>
      </div>
    </aside>
  );
}
