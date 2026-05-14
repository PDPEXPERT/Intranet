'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchProcedures, SearchHit } from '@/lib/procedures';

const DEBOUNCE_MS = 250;

export function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = window.setTimeout(async () => {
      try {
        const hits = await searchProcedures(q);
        setResults(hits);
      } catch {
        setResults([]);
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

  function navigate(code: string) {
    setOpen(false);
    setQuery('');
    router.push(`/procesos/${code}/`);
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        placeholder="Buscar procedimientos..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-64 px-3 py-1.5 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent"
      />
      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-96 max-h-96 overflow-y-auto bg-surface border border-neutral/40 rounded-md z-50">
          {loading && (
            <div className="px-4 py-3 text-xs text-neutral-dark/60">Buscando...</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-xs text-neutral-dark/60">
              Sin resultados
            </div>
          )}
          {!loading &&
            results.map((hit) => (
              <button
                key={hit.code}
                type="button"
                onClick={() => navigate(hit.code)}
                className="block w-full text-left px-4 py-3 border-b border-neutral/30 last:border-b-0 hover:bg-accent-light/20"
              >
                <div className="text-xs text-neutral-dark/60 font-medium">
                  {hit.code}
                </div>
                <div className="text-sm font-medium text-primary">{hit.title}</div>
                {hit.snippet && (
                  <div className="text-xs text-neutral-dark/70 mt-0.5 line-clamp-2">
                    {hit.snippet}
                  </div>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
