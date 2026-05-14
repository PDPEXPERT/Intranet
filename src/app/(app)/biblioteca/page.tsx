interface Resource {
  title: string;
  description: string;
  link?: string;
  status?: 'disponible' | 'proximamente';
}

interface Category {
  title: string;
  description: string;
  resources: Resource[];
}

const CATEGORIES: Category[] = [
  {
    title: 'Manuales internos',
    description:
      'Documentos normativos internos de PDP Expert que rigen como trabaja el equipo.',
    resources: [
      {
        title: 'Manual de Marca PDP Expert v2.0',
        description:
          'Identidad visual: paleta, tipografias, uso del logo, aplicaciones.',
        status: 'proximamente',
      },
      {
        title: 'Manual de Procedimientos de Consultoria (MAN-CON-001)',
        description:
          'Documento maestro que consolida los 7 procedimientos de consultoria.',
        status: 'proximamente',
      },
    ],
  },
  {
    title: 'Normativa aplicable',
    description:
      'Leyes, reglamentos y estandares relevantes para la practica de proteccion de datos personales.',
    resources: [
      {
        title: 'Ley peruana de Proteccion de Datos Personales',
        description:
          'Texto vigente y reglamento. Acceso a la interfaz de lectura interna (en construccion).',
        status: 'proximamente',
      },
      {
        title: 'ISO/IEC 29100 - Privacy framework',
        description: 'Principios de privacidad de referencia internacional.',
        status: 'proximamente',
      },
      {
        title: 'ISO/IEC 27701 - Sistema de gestion de privacidad',
        description:
          'Extension de ISO/IEC 27001 para gestion de informacion de privacidad.',
        status: 'proximamente',
      },
    ],
  },
  {
    title: 'Plantillas operativas',
    description:
      'Documentos de trabajo listos para usar en los procesos de consultoria.',
    resources: [
      {
        title: 'Formulario de Traspaso Comercial',
        description: 'Insumo de PRC-CON-001 (Activar servicio).',
        status: 'proximamente',
      },
      {
        title: 'Acta de kick-off',
        description: 'Salida de PRC-CON-001 (Activar servicio).',
        status: 'proximamente',
      },
      {
        title: 'Ficha de diagnostico inicial',
        description: 'Insumo de PRC-CON-002 (Ejecutar diagnostico).',
        status: 'proximamente',
      },
    ],
  },
];

export default function BibliotecaPage() {
  return (
    <div className="max-w-[960px] mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Biblioteca
        </h1>
        <p className="font-body text-sm text-neutral-dark/80">
          Recursos para el trabajo de consultoria: manuales internos, normativa
          aplicable y plantillas operativas. Los recursos se iran agregando
          conforme se digitalicen.
        </p>
      </header>

      {CATEGORIES.map((cat) => (
        <section key={cat.title} className="space-y-3 border-t border-neutral/30 pt-6">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-semibold text-primary">
              {cat.title}
            </h2>
            <p className="font-body text-sm text-neutral-dark/70">
              {cat.description}
            </p>
          </div>
          <ul className="space-y-2">
            {cat.resources.map((r) => (
              <li
                key={r.title}
                className="border border-neutral/40 rounded-md p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-body text-sm font-medium text-primary">
                    {r.title}
                  </div>
                  {r.status === 'proximamente' && (
                    <span className="font-body text-xs text-neutral-dark/50 shrink-0">
                      Proximamente
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-neutral-dark/80 mt-1">
                  {r.description}
                </p>
                {r.link && (
                  <a
                    href={r.link}
                    className="inline-block font-body text-sm text-accent hover:text-primary mt-2"
                  >
                    Abrir
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
