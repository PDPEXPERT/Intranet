import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RoleGuard } from '@/components/RoleGuard';
import { Badge } from '@/components/ui/Badge';
import {
  CATEGORIES,
  getCategoryMeta,
  getComponentsByCategory,
  type ComponentStatus,
} from '@/content/conocimiento/registry';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categoria: c.slug }));
}

const STATUS_TONE: Record<ComponentStatus, 'success' | 'pending' | 'muted'> = {
  activo: 'success',
  'en-construccion': 'pending',
  deprecado: 'muted',
};

const STATUS_LABEL: Record<ComponentStatus, string> = {
  activo: 'Activo',
  'en-construccion': 'En construcción',
  deprecado: 'Deprecado',
};

interface PageProps {
  params: { categoria: string };
}

export default function CategoriaConocimientoPage({ params }: PageProps) {
  const meta = getCategoryMeta(params.categoria);
  if (!meta) notFound();

  const components = getComponentsByCategory(meta.slug);

  return (
    <RoleGuard allow={['gerente', 'admin']}>
      <div className="max-w-[960px] mx-auto space-y-6">
        <div className="space-y-2">
          <Link
            href="/conocimiento/"
            className="font-body text-xs text-accent hover:text-primary"
          >
            ← Gestión del Conocimiento
          </Link>
          <h1 className="font-heading text-2xl font-bold text-primary">
            {meta.label}
          </h1>
          <p className="font-body text-sm text-neutral-dark/80 max-w-2xl">
            {meta.description}
          </p>
        </div>

        {components.length === 0 ? (
          <div className="border border-dashed border-neutral rounded-md px-4 py-6 text-center">
            <p className="font-body text-sm text-neutral-dark/60">
              Todavía no hay componentes registrados en esta categoría.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((comp) => (
              <div
                key={comp.code}
                className="border border-neutral rounded-md px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-heading text-sm font-semibold text-primary">
                      {comp.link ? (
                        <a
                          href={comp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent"
                        >
                          {comp.name}
                        </a>
                      ) : (
                        comp.name
                      )}
                    </h2>
                    <p className="font-body text-xs text-neutral-dark/70 mt-1 leading-snug">
                      {comp.description}
                    </p>
                    {comp.owner && (
                      <p className="font-body text-[11px] text-neutral-dark/40 mt-1.5">
                        Responsable: <span className="text-neutral-dark/70">{comp.owner}</span>
                      </p>
                    )}
                  </div>
                  {comp.status && (
                    <Badge tone={STATUS_TONE[comp.status]}>
                      {STATUS_LABEL[comp.status]}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
