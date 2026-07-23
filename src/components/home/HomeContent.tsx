'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { listProcedures } from '@/lib/procedures';
import type { ProcedureSummary } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface Tile {
  href: string;
  title: string;
  description: string;
}

const TILES: Tile[] = [
  {
    href: '/procesos/',
    title: 'Procedimientos',
    description:
      'Los 7 procedimientos de consultoria con sus actividades, responsabilidades, controles, riesgos e indicadores.',
  },
];

export function HomeContent() {
  const [email, setEmail] = useState<string>('');
  const [procedures, setProcedures] = useState<ProcedureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? '');
    });
  }, []);

  useEffect(() => {
    listProcedures()
      .then((data) => {
        setProcedures(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message ?? 'Error al cargar procedimientos');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[960px] mx-auto space-y-12">
      <section className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Bienvenido{email ? `, ${email}` : ''}
        </h1>
        <p className="font-body text-sm text-neutral-dark/80">
          Portal interno de PDP Expert. Aqui encuentras los procedimientos de
          consultoria para tu trabajo diario.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-primary">
          Accesos rapidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="block border border-neutral/40 rounded-md p-4 hover:border-accent"
            >
              <div className="font-heading text-lg font-semibold text-primary mb-2">
                {tile.title}
              </div>
              <p className="font-body text-sm text-neutral-dark/80 mb-3">
                {tile.description}
              </p>
              <span className="font-body text-sm text-accent">Ir</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-primary">
          Procedimientos de consultoria
        </h2>
        {loading && (
          <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>
        )}
        {error && <p className="font-body text-sm text-danger">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-1">
            {procedures.map((p) => (
              <li key={p.code}>
                <Link
                  href={`/procesos/${p.code}/`}
                  className="flex items-baseline gap-3 py-1.5 border-b border-neutral/30 hover:bg-accent-light/10 px-2 -mx-2 rounded"
                >
                  <span className="font-body text-xs font-medium text-neutral-dark/60 w-24 shrink-0">
                    {p.code}
                  </span>
                  <span className="font-body text-sm text-primary flex-1">
                    {p.title}
                  </span>
                  <Badge tone={p.part === 'compartidos' ? 'accent' : 'neutral'}>
                    {p.part === 'compartidos' ? 'Compartidos' : 'Servicio'}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
