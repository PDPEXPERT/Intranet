import Link from 'next/link';
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
} from '@/components/excellence/wiki';

export default function ProcesosPDP() {
  return (
    <article>
      <WikiEyebrow>Arquitectura Empresarial · Protección de Datos Personales</WikiEyebrow>
      <WikiTitle>Procesos de protección de datos personales</WikiTitle>
      <WikiSubtitle>Del qué a los procesos concretos</WikiSubtitle>
      <WikiLede>
        Una vez identificada la capacidad de protección de datos personales y su relación con las
        demás capacidades de la organización (ver{' '}
        <Link
          href="/excellence/arquitectura-empresarial-y-negocio/"
          className="text-accent hover:underline"
        >
          Arquitectura empresarial y arquitectura de negocio
        </Link>
        ), toca especificar el cómo: los procesos que instancian esa capacidad. Hay dos tipos de
        procesos relevantes para protección de datos: los que tratan datos personales y los que dan
        soporte a su protección.
      </WikiLede>

      <WikiSection title="Procesos propios y procesos de soporte" first>
        <WikiP>
          Dentro de los procesos de soporte, algunos son específicos de protección de datos y otros
          pertenecen a otra función (que da soporte a la protección de datos) pero actualizan
          algunos de sus componentes: es el caso de la gestión de incidentes, que sigue siendo un
          proceso de seguridad de la información al que se le añaden controles de protección de
          datos.
        </WikiP>
        <WikiCallout label="Protección de datos desde el diseño">
          <p>
            La normativa de protección de datos personales se transforma en una política a partir
            de la cual se dan especificaciones para el diseño de los procesos de la organización:
            eso es la protección de datos desde el diseño.
          </p>
        </WikiCallout>

        <WikiP>
          <strong>Procesos propios de gestión de protección de datos.</strong> A nivel de gestión,
          para el cumplimiento de la normativa:
        </WikiP>
        <WikiTable
          headers={['#', 'Proceso']}
          widths={['8%', '92%']}
          rows={[
            ['1', 'Gestión de requisitos del tratamiento de datos personales.'],
            ['2', 'Gestión de no conformidades y acciones correctivas.'],
            ['3', 'Gestión del consentimiento y deber de transparencia e información.'],
            ['4', 'Gestión del encargo del tratamiento de datos personales.'],
            [
              '5',
              'Gestión de solicitudes de ejercicio de derechos y consultas de titulares de datos personales.',
            ],
            ['6', 'Gestión de consultas internas y requerimientos.'],
          ]}
        />

        <WikiP>
          <strong>Procesos que se integran en capacidades existentes.</strong> Generalmente a cargo
          de otra función, a la que se le actualizan algunos componentes:
        </WikiP>
        <WikiTable
          headers={['#', 'Proceso']}
          widths={['8%', '92%']}
          rows={[
            ['1', 'Gestión de controles de protección de datos en la relación con terceros.'],
            ['2', 'Gestión de incidentes de seguridad.'],
            ['3', 'Gestión de riesgos en el tratamiento de datos personales.'],
            ['4', 'Gestión de requisitos de protección de datos sobre activos.'],
            ['5', 'Gestión de requisitos de protección de datos en desarrollo.'],
            ['6', 'Gestión de la retención y disposición final de datos personales.'],
            ['7', 'Gestión de auditoría interna en protección de datos personales.'],
            ['8', 'Gestión de monitoreo del entorno regulatorio y cambios en la normativa.'],
            ['9', 'Gestión de información documentada.'],
            ['10', 'Reporte a la alta dirección.'],
            ['11', 'Formación en materia de protección de datos personales.'],
          ]}
        />

        <WikiCallout label="Dónde profundizar el proceso 9">
          <p>
            El proceso 9, gestión de información documentada, tiene su propio desarrollo en{' '}
            <Link
              href="/excellence/informacion-e-informacion-documentada/"
              className="text-accent hover:underline"
            >
              Información e información documentada
            </Link>
            : qué es información documentada, la distinción entre mantenerla y conservarla, y cómo
            PDP Expert decide qué documentar dónde.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSources>
        Material de referencia sobre procesos de protección de datos personales conforme al enfoque
        de arquitectura empresarial y de negocio (TOGAF) adoptado por PDP Expert.
      </WikiSources>
    </article>
  );
}
