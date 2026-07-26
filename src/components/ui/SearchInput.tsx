'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchAll, SearchGroup } from '@/lib/search';

const DEBOUNCE_MS = 250;

export function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = window.setTimeout(async () => {
      try {
        const result = await searchAll(q);
        setGroups(result);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery('');
    router.push(href);
  }

  const showDropdown = open && query.trim().length >= 2;
  const hasResults = groups.some((g) => g.hits.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        placeholder="Buscar en la intranet..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-64 px-3 py-1.5 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent"
      />
      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-96 max-h-[28rem] overflow-y-auto bg-surface border border-neutral/40 rounded-md z-50 shadow-sm">
          {loading && (
            <div className="px-4 py-3 text-xs text-neutral-dark/60">Buscando...</div>
          )}
          {!loading && !hasResults && (
            <div className="px-4 py-3 text-xs text-neutral-dark/60">Sin resultados</div>
          )}
          {!loading &&
            groups.map((group) => (
              <div key={group.area} className="border-b border-neutral/30 last:border-b-0">
                <div className="px-4 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-dark/40">
                  {group.area}
                </div>
                {group.hits.map((hit) => (
                  <button
                    key={`${hit.area}-${hit.href}-${hit.title}`}
                    type="button"
                    onClick={() => navigate(hit.href)}
                    className="block w-full text-left px-4 py-2 hover:bg-accent-light/20"
                  >
                    <div className="text-sm font-medium text-primary">{hit.title}</div>
                    {hit.subtitle && (
                      <div className="text-xs text-neutral-dark/60 mt-0.5 line-clamp-2">
                        {hit.subtitle}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
