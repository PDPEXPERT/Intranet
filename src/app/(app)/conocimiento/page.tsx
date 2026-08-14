import Link from 'next/link';
import { RoleGuard } from '@/components/RoleGuard';
import { getCategoriesWithCounts } from '@/content/conocimiento/registry';

export default function ConocimientoPage() {
  const categories = getCategoriesWithCounts();

  return (
    <RoleGuard allow={['gerente', 'admin']}>
      <div className="max-w-[960px] mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-primary">
            Gestión del Conocimiento
          </h1>
          <p className="font-body text-sm text-neutral-dark/80">
            Mapa de consulta de los componentes del sistema de gestión del
            conocimiento: dónde vive, cómo fluye y qué lo sostiene. No es el
            repositorio de los activos de conocimiento en sí — este entorno
            apunta hacia ellos.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/conocimiento/${cat.slug}/`}
              className="block border border-neutral rounded-md px-4 py-3 hover:border-accent hover:bg-accent-light/5 transition-colors group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-sm font-medium text-primary group-hover:text-accent">
                  {cat.label}
                </span>
                <span className="font-body text-[10px] text-neutral-dark/40 border border-neutral rounded-full px-2 py-0.5 shrink-0">
                  {cat.count}
                </span>
              </div>
              <p className="font-body text-xs text-neutral-dark/60 mt-1 leading-snug">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
