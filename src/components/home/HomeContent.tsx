'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Tile {
  href: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => JSX.Element;
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

function IconProcedures({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10h6M9 14h6M9 18h4" strokeLinecap="round" />
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

const TILES: Tile[] = [
  {
    href: '/sobre-nosotros/',
    title: 'Sobre nosotros',
    description: 'Quiénes somos, por qué existimos y cómo nos organizamos.',
    icon: IconAbout,
  },
  {
    href: '/procesos/',
    title: 'Procedimientos',
    description:
      'Los procedimientos de consultoría con sus actividades, controles, riesgos e indicadores.',
    icon: IconProcedures,
  },
  {
    href: '/excellence/',
    title: 'Excellence Wiki',
    description: 'Conocimiento del equipo para la excelencia operativa.',
    icon: IconWiki,
  },
];

export function HomeContent() {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? '');
    });
  }, []);

  const nombre = email ? email.split('@')[0] : '';

  return (
    <div className="max-w-[960px] mx-auto space-y-10">
      <section className="space-y-3">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Hola{nombre ? `, ${nombre}` : ''}
        </h1>
        <p className="font-body text-base text-neutral-dark/85 max-w-[720px]">
          Este es el espacio interno de PDP Expert. Aquí encuentras cómo trabajamos,
          quiénes somos y las herramientas para tu día a día.
        </p>
        <p className="font-body text-sm text-neutral-dark/70 max-w-[720px]">
          Nos mueve un propósito claro: construir soluciones para gobernar, proteger y
          maximizar los datos regulados, con las personas en el centro. Gracias por lo que
          aportas cada día para lograrlo.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-neutral-dark/50">
          Explora
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="flex flex-col border border-neutral rounded-md p-5 hover:border-accent hover:bg-accent-light/5 transition-colors group"
              >
                <Icon className="w-6 h-6 text-accent mb-3" />
                <div className="font-heading text-base font-semibold text-primary group-hover:text-accent mb-1">
                  {tile.title}
                </div>
                <p className="font-body text-sm text-neutral-dark/70 flex-1">
                  {tile.description}
                </p>
                <span className="font-body text-sm text-accent mt-3">Entrar</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
