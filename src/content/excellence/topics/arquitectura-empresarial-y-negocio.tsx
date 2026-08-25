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
  WikiUL,
} from '@/components/excellence/wiki';

export default function ArquitecturaEmpresarialYNegocio() {
  return (
    <article>
      <WikiEyebrow>Arquitectura Empresarial · Fundamentos</WikiEyebrow>
      <WikiTitle>Arquitectura empresarial y arquitectura de negocio</WikiTitle>
      <WikiSubtitle>TOGAF · The Open Group Architecture Framework</WikiSubtitle>
      <WikiLede>
        La Arquitectura Empresarial (EA) es la estructura de los componentes de una empresa, sus
        interrelaciones y los principios que gobiernan su diseño y evolución en el tiempo. La
        Arquitectura de Negocio es uno de sus dominios: el que conecta la estrategia con la
        operación real. Esa conexión es también la vía por la que la normativa de protección de
        datos personales entra a la organización y se traduce en capacidades, procesos y controles
        concretos.
      </WikiLede>

      <WikiSection title="Qué es y qué no es arquitectura empresarial" first>
        <WikiP>
          La EA alinea los sistemas de negocio con los sistemas de información para alcanzar las
          metas de la organización, integrando procesos, personas y tecnología. Es un proceso de
          traducción: convierte la visión y la estrategia de negocio en cambio organizacional
          efectivo, mediante modelos que describen el estado futuro de la empresa.
        </WikiP>
        <WikiCallout label="Qué NO es">
          <WikiUL>
            <li>
              Un departamento o unidad organizativa: es una capacidad de gestión que facilita
              resultados, no un equipo con ese nombre.
            </li>
            <li>
              Solo diseño de implementación o estándares técnicos: esos son productos de trabajo,
              no la arquitectura en sí. La EA facilita el entendimiento entre interesados.
            </li>
            <li>
              Un modelo estático o académico: se desarrolla solo hasta el punto en que es
              suficiente para el propósito, no como ejercicio teórico.
            </li>
            <li>
              Construcción, despliegue o ejecución: da la guía de qué hacer, no el cómo construir
              o correr los sistemas; eso corresponde a otros profesionales técnicos.
            </li>
            <li>
              Un conjunto de casos de uso: los casos de uso describen interacción
              humano-computadora; la EA aborda problemas de negocio y arquitectura más amplios.
            </li>
          </WikiUL>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Arquitectura de negocio">
        <WikiP>
          Es el plano o &quot;blueprint&quot; de la organización: representa de forma holística las
          capacidades, la entrega de valor de extremo a extremo (flujos de valor), la información y
          la estructura organizacional. Crea un entendimiento compartido entre interesados y alinea
          la estrategia con la ejecución, definiendo qué hace la empresa para entregar valor y cómo
          se estructura para sostener esa operación.
        </WikiP>
        <WikiTable
          headers={['Dimensión', 'Cómo se diferencian']}
          widths={['22%', '78%']}
          rows={[
            [
              'Alcance',
              'La Arquitectura Empresarial es la suma de la Arquitectura de Negocio más la Arquitectura de TI (Datos, Aplicaciones y Tecnología).',
            ],
            [
              'Dependencia',
              'La Arquitectura de Negocio sin TI no tiene medios para traducir necesidades de negocio en habilitadores tecnológicos. La Arquitectura de TI sin Negocio no tiene dirección para priorizar inversiones.',
            ],
            [
              'Foco',
              'La EA vela por la congruencia de capacidades y estándares en toda la empresa, incluyendo infraestructura y gobernanza. La Arquitectura de Negocio se centra en motivaciones, operaciones y el enlace entre clientes, productos y finanzas.',
            ],
            [
              'Posicionamiento',
              'La Arquitectura de Negocio vive entre la gestión estratégica (traduce la estrategia en acciones) y la disciplina de EA (aporta el lenguaje de negocio y el contexto para las decisiones tecnológicas).',
            ],
          ]}
        />
        <WikiCallout label="El hilo dorado">
          <p>
            La Arquitectura de Negocio conecta la estrategia con la realidad operativa dentro de la
            Arquitectura Empresarial, asegurando que el resto de los dominios técnicos tenga un
            propósito de negocio claro.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="El puente hacia el cumplimiento normativo">
        <WikiP>
          Dentro de la Arquitectura Empresarial, la Arquitectura de Negocio es el punto de entrada
          para las regulaciones externas, incluida la normativa de protección de datos personales.
        </WikiP>
        <WikiTable
          headers={['Mecanismo', 'En qué consiste']}
          widths={['26%', '74%']}
          rows={[
            [
              'Políticas como dominio',
              'La normativa de protección de datos se cataloga dentro del dominio de Políticas de la Arquitectura de Negocio: guía a la organización y dicta restricciones para evitar riesgos legales y financieros.',
            ],
            [
              'Análisis de impacto',
              'Ante una nueva regulación, los arquitectos de negocio evalúan de forma bidireccional cómo afecta a las capacidades (por ejemplo, Gestión de Información del Cliente), los flujos de valor (por ejemplo, Adquisición de Clientes) y los procesos existentes.',
            ],
            [
              'Trazabilidad (el hilo dorado)',
              'Permite que una auditoría demuestre cómo una regla específica de la normativa se implementa a través de una capacidad de negocio, una unidad organizacional y, finalmente, un sistema de información.',
            ],
          ]}
        />

        <WikiP>
          <strong>Seguridad y privacidad, preocupación transversal.</strong> La Arquitectura de
          Seguridad, que incluye la privacidad, no es un silo aislado: impregna e informa a las
          arquitecturas de Negocio, Datos, Aplicaciones y Tecnología por igual.
        </WikiP>
        <WikiCallout label="Por qué importa">
          <p>
            La EA busca que las medidas de seguridad y privacidad no sean parches de último
            momento, sino que estén integradas desde el diseño (privacy by design, protección de
            datos desde el diseño). Eso ahorra costos y aumenta la efectividad frente a corregir
            después del hecho.
          </p>
        </WikiCallout>

        <WikiP>
          <strong>Mapa de información y gestión de datos maestros de clientes (C-MDM).</strong> La
          protección de datos personales se gestiona mediante artefactos específicos de
          información:
        </WikiP>
        <WikiTable
          headers={['Artefacto', 'Para qué sirve']}
          widths={['30%', '70%']}
          rows={[
            [
              'Mapa de información',
              'Usa Objetos de Negocio para definir qué datos captura la empresa y por qué son valiosos. Identificar qué objetos contienen información de identificación personal (PII) es el primer paso para el cumplimiento.',
            ],
            [
              'Gestión de Datos Maestros de Clientes (C-MDM)',
              'Centraliza la gestión de consentimientos y preferencias. Al establecer un punto único de verdad, permite que las solicitudes de eliminación o acceso de los titulares se ejecuten en todos los sistemas conectados.',
            ],
            [
              'Gestión de metadatos',
              'Etiqueta la información con su clasificación de seguridad y reglas de retención (cuánto tiempo se puede guardar un dato según la ley), facilitando la eliminación automática cuando ya no hay un propósito legítimo.',
            ],
          ]}
        />

        <WikiP>
          <strong>Integración en el ciclo de vida (ADM de TOGAF).</strong> La conexión con
          cumplimiento se formaliza a través de las fases del Método de Desarrollo de Arquitectura:
        </WikiP>
        <WikiTable
          headers={['Fase ADM', 'Qué aporta a protección de datos']}
          widths={['26%', '74%']}
          rows={[
            [
              'Fase Preliminar',
              'Se identifican los impulsores de cumplimiento y los principios de seguridad que regirán toda la arquitectura.',
            ],
            [
              'Fase B (Arquitectura de Negocio)',
              'Se genera el Registro de Leyes y Regulaciones Aplicables, donde se documenta explícitamente la normativa y sus implicaciones para las funciones de negocio.',
            ],
            [
              'Fases C y D',
              'Los requisitos de privacidad se traducen en controles técnicos, como el cifrado de datos o la gestión de identidades y accesos.',
            ],
            [
              'Fase G (Gobernanza)',
              'Se realizan revisiones de cumplimiento para asegurar que los proyectos de implementación sigan las directrices de privacidad establecidas.',
            ],
          ]}
        />
      </WikiSection>

      <WikiSection title="La normativa como impulsor (driver) de la arquitectura de negocio">
        <WikiP>
          Un driver (impulsor), como una nueva normativa, lleva a la organización a plantearse
          objetivos de negocio frente a ella y a actualizar sus capacidades para cumplirlos e
          implementar la regulación. Los requisitos normativos se vuelven un input más, junto a
          otros requisitos, a la hora de instanciar las capacidades empresariales.
        </WikiP>
        <WikiCallout label="Idea clave">
          <p>
            El driver obliga a ajustar un objetivo de cumplimiento. Ese objetivo impacta una
            capacidad. Y la planificación del cambio se materializa modificando los componentes de
            la instancia de esa capacidad (un proceso, una aplicación) hasta cerrar la brecha entre
            el estado actual y el objetivo.
          </p>
        </WikiCallout>
        <WikiTable
          headers={['Paso', 'Qué ocurre']}
          widths={['26%', '74%']}
          rows={[
            [
              'Driver',
              'Impulsores internos o externos (leyes, regulaciones, estándares de la industria) motivan un cambio en la organización y su posición estratégica.',
            ],
            [
              'Objetivo de negocio',
              'Se deriva del driver y debe ser SMART (específico, medible, accionable, realista, acotado en el tiempo). Ejemplo: un driver regulatorio de privacidad puede generar el objetivo "alcanzar el 100% de cumplimiento con las normas de protección de datos en el próximo año".',
            ],
            [
              'Análisis de impacto en capacidades',
              'El mapeo de capacidades identifica qué habilidades nuevas o mejoradas se necesitan para alcanzar el objetivo. El hilo dorado conecta objetivos, capacidades y flujos de valor.',
            ],
            [
              'Instancia de capacidad',
              'Las capacidades son abstracciones; para que el cambio ocurra se instancian: se mapea la habilidad general (por ejemplo, Gestión de Información del Cliente) a recursos, aplicaciones, personas y procesos concretos.',
            ],
            [
              'Ciclo de cambio',
              'La planificación se materializa al modificar los componentes de esa instancia (actualizar un proceso, mejorar una aplicación) para cerrar la brecha entre el estado base y el objetivo.',
            ],
          ]}
        />
      </WikiSection>

      <WikiSection title="Ontología de capacidades empresariales para la protección de datos">
        <WikiP>
          Las capacidades se pueden clasificar según cómo se ven afectadas por los requisitos de
          protección de datos. Esta ontología distingue cuatro tipos, útiles para decidir qué
          tratamiento darle a cada una.
        </WikiP>
        <WikiTable
          headers={['Tipo de capacidad', 'Qué significa']}
          widths={['30%', '70%']}
          rows={[
            [
              'Capacidad de cumplimiento en protección de datos',
              'La capacidad, generalmente de nivel 3, responsable principal de administrar o coordinar las medidas de protección de datos personales.',
            ],
            [
              'Capacidades de soporte a la protección de datos',
              'Capacidades empresariales existentes (TI, seguridad de la información, gobierno de datos, entre otras) en las que los requisitos de protección de datos exigen actualizaciones.',
            ],
            [
              'Capacidades que tratan datos personales',
              'Capacidades cuya operación implica el tratamiento directo de datos personales.',
            ],
            [
              'Capacidades con tratamiento accesorio de datos personales',
              'Capacidades donde el tratamiento de datos personales es incidental a su propósito principal.',
            ],
          ]}
        />
        <WikiCallout label="Una capacidad puede ser ambas cosas">
          <p>
            Una misma capacidad puede ser a la vez de soporte y de tratamiento. Seguridad de la
            información no solo da soporte a la protección de datos: al proteger la seguridad,
            también debe respetar la protección de datos personales.
          </p>
        </WikiCallout>
        <WikiP>
          Una forma de identificar las capacidades de soporte es mirar los objetos de negocio desde
          la óptica de protección de datos: los completamente nuevos (como el registro de
          actividades de tratamiento) suelen apuntar a una capacidad nueva de protección de datos;
          los que ya existían suelen estar cubiertos por otra capacidad empresarial existente.
        </WikiP>

        <WikiP>
          <strong>Capacidades de soporte típicas.</strong> Los cambios en ellas afectan toda la
          instancia (personas, procesos, información y tecnología), y en información se ve
          afectada también la documentación, no solo el flujo. Los flujos entre la capacidad de
          protección de datos y estas capacidades de soporte suelen ser de doble vía, orientados a
          coordinar medidas.
        </WikiP>
        <WikiTable
          headers={['Capacidad de soporte', 'Cómo se relaciona con protección de datos']}
          widths={['26%', '74%']}
          rows={[
            [
              'Tecnología de la información',
              'Habilita y adapta los sistemas y aplicaciones que almacenan o procesan datos personales.',
            ],
            [
              'Seguridad de la información',
              'Aporta los controles de acceso, cifrado y gestión de incidentes sobre los que se apoyan las medidas de protección de datos.',
            ],
            [
              'Gobierno de datos',
              'Aporta la clasificación y calidad de la información sobre la que se identifican los datos personales.',
            ],
            [
              'Compras y gestión de proveedores',
              'Incorpora la evaluación y el seguimiento de encargados y corresponsables del tratamiento.',
            ],
            [
              'Recursos humanos',
              'Gestiona los datos personales del personal y su formación en la materia.',
            ],
            [
              'Gestión por procesos',
              'Provee la estructura documental sobre la que se insertan los controles y remisiones propias de protección de datos.',
            ],
          ]}
        />
        <WikiCallout label="Flujo típico">
          <p>
            El área de protección de datos analiza el rol de un proveedor frente a la normativa; el
            área de compras aplica el acuerdo de protección de datos que corresponde según ese rol,
            y devuelve al área de protección de datos el estado de la suscripción de esos acuerdos.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Procesos e información documentada">
        <WikiP>
          A partir de esta ontología de capacidades se derivan los procesos concretos de protección
          de datos personales (propios y los que se integran en capacidades existentes), y la forma
          en que esos procesos se documentan. Ambos temas se desarrollan en artículos propios:
        </WikiP>
        <WikiUL>
          <li>
            <Link href="/excellence/procesos-pdp/" className="text-accent hover:underline">
              Procesos de protección de datos personales
            </Link>
            : el listado completo de procesos propios y de procesos que se integran en capacidades
            existentes.
          </li>
          <li>
            <Link
              href="/excellence/informacion-e-informacion-documentada/"
              className="text-accent hover:underline"
            >
              Información e información documentada
            </Link>
            : qué es información documentada según ISO 9000, la distinción entre mantener y
            conservar, y cómo PDP Expert gestiona esta capacidad de soporte en la práctica.
          </li>
        </WikiUL>
      </WikiSection>

      <WikiSources>
        Material de referencia sobre Arquitectura Empresarial y de Negocio conforme a TOGAF (The
        Open Group Architecture Framework), y su aplicación al cumplimiento de la normativa de
        protección de datos personales.
      </WikiSources>
    </article>
  );
}
