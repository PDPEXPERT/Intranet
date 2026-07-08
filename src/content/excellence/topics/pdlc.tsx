import {
  WikiCallout,
  WikiEyebrow,
  WikiLede,
  WikiP,
  WikiSection,
  WikiSources,
  WikiSubtitle,
  WikiTable,
  WikiTitle,
  WikiVariant,
} from '@/components/excellence/wiki';

export default function PDLC() {
  return (
    <article>
      <WikiEyebrow>Fundamentos · Ciclo de vida</WikiEyebrow>
      <WikiTitle>Ciclo de desarrollo de producto</WikiTitle>
      <WikiSubtitle>Product Development Lifecycle (PDLC)</WikiSubtitle>
      <WikiLede>
        Es el proceso que sigue un equipo de producto para llevar una idea desde la deteccion de
        un problema hasta un producto en manos de usuarios, y su mejora continua despues del
        lanzamiento. No es una linea recta: aunque las etapas se presentan en orden, en la
        practica el equipo vuelve sobre etapas anteriores a medida que aprende cosas nuevas.
      </WikiLede>

      <WikiSection title="Las 7 etapas" first>
        <WikiTable
          headers={['Etapa', 'Descripcion', 'Herramientas de PM']}
          widths={['22%', '48%', '30%']}
          rows={[
            [
              <span key="e1">
                1. Descubrimiento del problema
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Problem Discovery
                </span>
              </span>,
              <span key="d1">
                Se identifica y valida que existe un problema real que vale la pena resolver. Se
                recopilan senales de usuarios, soporte, mercado y datos de producto.
                <WikiVariant label="Desarrollo interno">
                  el &quot;cliente&quot; es un area de la empresa; la validacion es mas rapida por
                  acceso directo a los usuarios.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  requiere validar la necesidad en una muestra representativa del mercado externo,
                  con mayor incertidumbre y riesgo.
                </WikiVariant>
              </span>,
              'Entrevistas de usuario, analisis de tickets de soporte, encuestas (NPS/CSAT), monitoreo de competencia, analisis de datos de uso',
            ],
            [
              <span key="e2">
                2. Descubrimiento de la solucion
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Solution Discovery
                </span>
              </span>,
              <span key="d2">
                Se exploran y prueban posibles soluciones al problema validado, antes de
                comprometer recursos de construccion.
                <WikiVariant label="Desarrollo interno">
                  prototipos simples validados con pocos usuarios internos identificables.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  requiere pruebas mas robustas (prototipos, tests A/B conceptuales) dado el
                  publico externo y desconocido.
                </WikiVariant>
              </span>,
              'Prototipos de baja fidelidad, pruebas de concepto, Jobs-to-be-Done, entrevistas de validacion de solucion',
            ],
            [
              <span key="e3">
                3. Definicion
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Definition
                </span>
              </span>,
              <span key="d3">
                Se transforma la solucion validada en alcance concreto: requisitos, historias de
                usuario, criterios de aceptacion y metricas de exito (PRD).
                <WikiVariant label="Desarrollo interno">
                  el caso de negocio se centra en eficiencia/ahorro operativo; alcance negociable
                  con el area solicitante.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  el caso de negocio incluye tamano de mercado, monetizacion y ventaja
                  competitiva; el alcance debe contemplar multiples segmentos.
                </WikiVariant>
              </span>,
              'PRD (Product Requirements Document), historias de usuario, OKRs/metricas de exito, priorizacion (RICE, MoSCoW), market sizing (TAM/SAM/SOM)',
            ],
            [
              <span key="e4">
                4. Diseno
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Design
                </span>
              </span>,
              <span key="d4">
                Se disena la experiencia de usuario y, cuando aplica, la arquitectura tecnica de
                la solucion.
                <WikiVariant label="Desarrollo interno">
                  diseno mas funcional, con menos necesidad de pulir la experiencia visual.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  requiere mayor inversion en UX, dado que compite por la atencion y preferencia
                  de usuarios externos.
                </WikiVariant>
              </span>,
              'Wireframes/prototipos (Figma), design systems, pruebas de usabilidad',
            ],
            [
              <span key="e5">
                5. Desarrollo
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Development
                </span>
              </span>,
              <span key="d5">
                Se construye la solucion de forma iterativa, con ciclos de feedback continuos
                entre producto, diseno e ingenieria.
                <WikiVariant label="Desarrollo interno">
                  ciclos de feedback mas cortos, usuarios accesibles dentro de la misma
                  organizacion.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  se agregan validaciones mas formales (beta cerrada, testing con distintos
                  segmentos) antes de lanzar a todo el mercado.
                </WikiVariant>
              </span>,
              'Sprints agiles (Scrum/Kanban), backlog priorizado, pruebas de QA',
            ],
            [
              <span key="e6">
                6. Lanzamiento
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Launch
                </span>
              </span>,
              <span key="d6">
                La solucion pasa de desarrollo a uso real, con planeacion de lanzamiento,
                comunicacion y despliegue gradual.
                <WikiVariant label="Desarrollo interno">
                  el lanzamiento es comunicacion y capacitacion interna, sin necesidad de
                  estrategia comercial.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  requiere una estrategia de go-to-market completa: pricing, mensajes, canales de
                  venta y habilitacion de equipos comerciales/soporte.
                </WikiVariant>
              </span>,
              'Plan de lanzamiento, rollout gradual (feature flags, beta), plan de comunicacion, sales/customer enablement',
            ],
            [
              <span key="e7">
                7. Iteracion
                <span className="block text-xs text-neutral-dark/50 font-normal mt-0.5">
                  Iteration
                </span>
              </span>,
              <span key="d7">
                Se mide el resultado contra las metricas definidas en la etapa de Definicion, y
                ese aprendizaje alimenta el siguiente ciclo de Descubrimiento.
                <WikiVariant label="Desarrollo interno">
                  el exito se mide en adopcion interna y eficiencia lograda.
                </WikiVariant>
                <WikiVariant label="Producto de mercado">
                  el exito se mide en adopcion de mercado, retencion, ingresos y satisfaccion del
                  cliente externo.
                </WikiVariant>
              </span>,
              'Dashboards de producto (analytics), North Star Metric, retrospectivas, encuestas post-lanzamiento',
            ],
          ]}
        />
      </WikiSection>

      <WikiSection title="No confundir con...">
        <WikiCallout label="PDLC vs. Product Life Cycle">
          <p>
            El <strong>PDLC (Product Development Lifecycle)</strong> descrito arriba es el proceso
            de crear o evolucionar el producto. Es distinto del{' '}
            <strong>Product Life Cycle</strong> clasico de marketing (introduccion, crecimiento,
            madurez, declive), que describe la vida comercial de un producto una vez ya esta
            lanzado en el mercado. Suenan igual, pero son modelos distintos.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Idea clave">
        <WikiP>
          La diferencia entre un buen y un mal proceso de PM no esta en tener estas etapas, sino
          en no saltarse el <em>discovery</em>. Es comun pasar directo de &quot;tenemos una
          idea&quot; a &quot;construyamosla&quot; sin validar el problema, lo que produce
          productos que resuelven bien algo que nadie necesitaba.
        </WikiP>
      </WikiSection>

      <WikiSources>
        Amplitude — Product Development Lifecycle · Plane.so — What is the product development
        lifecycle · Pendo — Product Management Lifecycle · ProdPad — Product Management Lifecycle
        glossary · Academy of PM — The Product Development Process: Discovery
      </WikiSources>
    </article>
  );
}
