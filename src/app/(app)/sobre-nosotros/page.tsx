import Link from 'next/link';
import { ABOUT_SECTIONS } from '@/content/sobre-nosotros/sections';

function iconFor(slug: string) {
  const cls = 'w-5 h-5 text-accent';
  switch (slug) {
    case 'por-que':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" strokeLinecap="round" />
          <path d="M12 17h.01" strokeLinecap="round" />
        </svg>
      );
    case 'organizacion-inteligente':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}>
          <path d="M12 3a5 5 0 0 0-5 5c0 1.6.8 2.7 1.5 3.5S10 13 10 15h4c0-2 .8-2.7 1.5-3.5S17 9.6 17 8a5 5 0 0 0-5-5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18h4M10.5 21h3" strokeLinecap="round" />
        </svg>
      );
    case 'que':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}>
          <rect x="3" y="4" width="7" height="7" rx="1" />
          <rect x="14" y="4" width="7" height="7" rx="1" />
          <rect x="3" y="15" width="7" height="5" rx="1" />
          <rect x="14" y="15" width="7" height="5" rx="1" />
        </svg>
      );
    case 'quienes':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}>
          <circle cx="9" cy="8" r="3" />
          <path d="M4 20c0-2.8 2.2-5 5-5s5 2.2 5 5" strokeLinecap="round" />
          <path d="M16 11a3 3 0 0 0 0-6M20 20c0-2.5-1.7-4.6-4-5" strokeLinecap="round" />
        </svg>
      );
    case 'como':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cls}>
          <path d="M4 6h10M4 12h16M4 18h7" strokeLinecap="round" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="15" cy="18" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="font-heading text-2xl font-bold text-primary">Sobre nosotros</h1>
        <div className="space-y-3 font-body text-neutral-dark/85 max-w-[760px]">
          <p className="text-base">
            Somos PDP Expert, apoyamos a las organizaciones democratizando el acceso a
            soluciones para aprovechar legítimamente datos.
          </p>
          <p className="text-base font-medium text-primary">
            Construir soluciones para Gobernar, Proteger y Maximizar los datos regulados.
          </p>
          <p className="text-sm text-neutral-dark/70">
            Conoce más sobre nosotros{' '}
            <a href="#secciones" className="text-accent hover:text-primary font-medium">
              aquí
            </a>
            .
          </p>
        </div>
      </header>

      <section id="secciones" className="grid grid-cols-1 sm:grid-cols-2 gap-3 scroll-mt-6">
        {ABOUT_SECTIONS.map((s) => (
          <Link
            key={s.slug}
            href={`/sobre-nosotros/${s.slug}/`}
            className="flex items-start gap-3 border border-neutral rounded-md p-4 hover:border-accent hover:bg-accent-light/5 transition-colors group"
          >
            <span className="shrink-0 mt-0.5">{iconFor(s.slug)}</span>
            <span>
              <span className="block font-heading text-sm font-semibold text-primary group-hover:text-accent">
                {s.label}
              </span>
              <span className="block font-body text-xs text-neutral-dark/60 mt-0.5">
                {s.short}
              </span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
