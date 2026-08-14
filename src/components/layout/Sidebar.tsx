'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { listProcedures } from '@/lib/procedures';
import type { ProcedureSummary } from '@/lib/types';
import { TOPICS } from '@/content/excellence/registry';
import { CATEGORIES as KM_CATEGORIES } from '@/content/conocimiento/registry';
import { ABOUT_SECTIONS } from '@/content/sobre-nosotros/sections';
import { useSidebar } from './SidebarContext';
import { useUserRoles, type AppRole } from '@/lib/useUserRoles';

type SectionKey = 'sobre' | 'procesos' | 'excellence' | 'conocimiento';

interface NavItem {
  href: string;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
  section?: SectionKey;
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

function IconAbout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" strokeLinecap="round" />
      <path d="M12 8h.01" strokeLinecap="round" />
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

function IconClientes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M3 21h18" strokeLinecap="round" />
      <path d="M5 21V7l7-4 7 4v14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11h.01M15 11h.01M9 7h.01M15 7h.01" strokeLinecap="round" />
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

function IconLeadership({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="3" />
    </svg>
  );
}

function IconKnowledge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 18h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.44.9 1.15.9 1.9v.2h5.2v-.2c0-.75.3-1.46.9-1.9A6 6 0 0 0 12 3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOP_NAV: NavItem[] = [
  { href: '/', label: 'Inicio', icon: IconHome },
  { href: '/sobre-nosotros', label: 'Sobre nosotros', icon: IconAbout, section: 'sobre' },
  { href: '/procesos', label: 'Procedimientos', icon: IconProcedures, section: 'procesos' },
  { href: '/clientes', label: 'Clientes', icon: IconClientes },
  { href: '/excellence', label: 'Excellence Wiki', icon: IconWiki, section: 'excellence' },
];

// Ítems visibles solo para ciertos roles. Se agregan al final del nav
// principal cuando el usuario logueado tiene alguno de los roles listados.
const RESTRICTED_NAV: (NavItem & { allow: AppRole[] })[] = [
  {
    href: '/liderazgo',
    label: 'Liderazgo',
    icon: IconLeadership,
    allow: ['gerente', 'admin'],
  },
  {
    href: '/conocimiento',
    label: 'Gestión del Conocimiento',
    icon: IconKnowledge,
    section: 'conocimiento',
    allow: ['gerente', 'admin'],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function sectionOf(pathname: string): SectionKey | null {
  if (pathname.startsWith('/sobre-nosotros')) return 'sobre';
  if (pathname.startsWith('/procesos')) return 'procesos';
  if (pathname.startsWith('/excellence')) return 'excellence';
  if (pathname.startsWith('/conocimiento')) return 'conocimiento';
  return null;
}

export function Sidebar() {
  const pathname = usePathname() ?? '/';
  const { collapsed, toggle } = useSidebar();
  const { roles, hasRole } = useUserRoles();
  const [email, setEmail] = useState<string>('');
  const [procedures, setProcedures] = useState<ProcedureSummary[]>([]);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? '');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user.email ?? '');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const visibleRestrictedNav = RESTRICTED_NAV.filter((item) =>
    hasRole(item.allow)
  );

  // Al entrar a una seccion, se abre su subnav; el usuario puede colapsarla.
  useEffect(() => {
    const sec = sectionOf(pathname);
    if (!sec) return;
    setOpenSections((prev) => (prev.has(sec) ? prev : new Set(prev).add(sec)));
  }, [pathname]);

  const inProcesos = pathname.startsWith('/procesos');

  useEffect(() => {
    if (!inProcesos) return;
    if (procedures.length > 0) return;
    listProcedures()
      .then(setProcedures)
      .catch(() => setProcedures([]));
  }, [inProcesos, procedures.length]);

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
          <Link href="/" className="min-w-0 hover:opacity-90">
            <div className="font-heading font-bold text-lg leading-tight">PDP Expert</div>
            <div className="font-body text-xs text-on-primary/70">Intranet</div>
          </Link>
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
          const linkHref = item.href === '/' ? '/' : `${item.href}/`;
          const hasChildren = !!item.section;
          const isOpen = hasChildren && item.section ? openSections.has(item.section) : false;
          const showSub = !collapsed && hasChildren && isOpen;
          const Icon = item.icon;
          return (
            <div key={item.href}>
              <div
                className={`flex items-center rounded-md ${
                  active
                    ? 'bg-accent text-on-primary'
                    : 'text-on-primary/70 hover:bg-accent hover:text-on-primary'
                }`}
              >
                <Link
                  href={linkHref}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 font-body text-sm font-medium flex-1 min-w-0 ${
                    collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
                {hasChildren && !collapsed && item.section && (
                  <button
                    type="button"
                    onClick={() => toggleSection(item.section as SectionKey)}
                    aria-label={isOpen ? `Colapsar ${item.label}` : `Expandir ${item.label}`}
                    aria-expanded={isOpen}
                    className="px-2 py-2 shrink-0 opacity-70 hover:opacity-100"
                  >
                    <IconChevron
                      className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </button>
                )}
              </div>

              {showSub && item.section === 'sobre' && (
                <div className="mt-1 mb-2 space-y-0.5">
                  {ABOUT_SECTIONS.map((s) => {
                    const subActive = pathname.includes(`/sobre-nosotros/${s.slug}`);
                    return (
                      <Link
                        key={s.slug}
                        href={`/sobre-nosotros/${s.slug}/`}
                        className={
                          subActive
                            ? 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary border-l-2 border-accent'
                            : 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary/60 hover:text-on-primary'
                        }
                      >
                        <span className="block text-on-primary/60 truncate">{s.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {showSub && item.section === 'procesos' && procedures.length > 0 && (
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
                        <span className="block text-on-primary/50 truncate">{p.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {showSub && item.section === 'excellence' && (
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

        {visibleRestrictedNav.length > 0 && (
          <div className="pt-2 mt-2 border-t border-on-primary/10 space-y-1">
            {visibleRestrictedNav.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              const hasChildren = !!item.section;
              const isOpen = hasChildren && item.section ? openSections.has(item.section) : false;
              const showSub = !collapsed && hasChildren && isOpen;
              return (
                <div key={item.href}>
                  <div
                    className={`flex items-center rounded-md ${
                      active
                        ? 'bg-accent text-on-primary'
                        : 'text-on-primary/70 hover:bg-accent hover:text-on-primary'
                    }`}
                  >
                    <Link
                      href={`${item.href}/`}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 font-body text-sm font-medium flex-1 min-w-0 ${
                        collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {hasChildren && !collapsed && item.section && (
                      <button
                        type="button"
                        onClick={() => toggleSection(item.section as SectionKey)}
                        aria-label={isOpen ? `Colapsar ${item.label}` : `Expandir ${item.label}`}
                        aria-expanded={isOpen}
                        className="px-2 py-2 shrink-0 opacity-70 hover:opacity-100"
                      >
                        <IconChevron
                          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {showSub && item.section === 'conocimiento' && (
                    <div className="mt-1 mb-2 space-y-0.5">
                      {KM_CATEGORIES.map((cat) => {
                        const subActive = pathname.includes(`/conocimiento/${cat.slug}`);
                        return (
                          <Link
                            key={cat.slug}
                            href={`/conocimiento/${cat.slug}/`}
                            className={
                              subActive
                                ? 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary border-l-2 border-accent'
                                : 'block pl-8 pr-3 py-1.5 font-body text-xs text-on-primary/60 hover:text-on-primary'
                            }
                          >
                            <span className="block text-on-primary/50 truncate">{cat.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-on-primary/10 space-y-2">
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-body text-xs text-on-primary/70 truncate">{email}</div>
            {roles.length > 0 && (
              <div className="font-body text-[10px] text-on-primary/50 truncate">
                {roles.join(', ')}
              </div>
            )}
          </div>
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
